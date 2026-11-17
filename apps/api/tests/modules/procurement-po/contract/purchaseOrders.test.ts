/// <reference types="jest" />
import { createDb } from '../../../../src/db/client';
import { migrate } from '../../../../src/db/migrate';
import { PROCUREMENT_MIGRATIONS } from '../../../../src/procurement/migrations';
import { createPurchaseOrderService, PurchaseOrderError } from '../../../../src/procurement/purchaseOrders';
import { createVendorService } from '../../../../src/procurement/vendors';

const line = { partId: 'PART-9', quantity: 14, rate: 250.5 };
const valid = { vendorId: 'VEN-1', unitId: 'UNIT-1', lines: [line] };

async function setup(now = () => new Date('2026-11-17T10:00:00Z')) {
  const db = createDb({ url: ':memory:' });
  await migrate(db, PROCUREMENT_MIGRATIONS);
  return { db, pos: createPurchaseOrderService(db, now), vendors: createVendorService(db, now) };
}

describe('vendor purchase orders contract', () => {
  it('creates a PO with a PO number, status draft, the creator and the lines; then reads it back', async () => {
    const { pos } = await setup();
    const po = await pos.create('tenant-a', 'user-7', valid);
    expect(po).toMatchObject({
      poNumber: 'PO-2026-0001', vendorId: 'VEN-1', unitId: 'UNIT-1', status: 'draft', createdBy: 'user-7', createdAt: '2026-11-17T10:00:00.000Z'
    });
    expect(po.lines).toEqual([{ partId: 'PART-9', quantity: 14, rate: 250.5, amount: 3507 }]);
    expect(po.total).toBe(3507);
    expect(po.totalPaise).toBe(350700);
    expect(po.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(await pos.get('tenant-a', po.id)).toEqual(po);
    expect(await pos.list('tenant-a')).toEqual([po]);
  });

  it('calculates the total across several lines and stores the rate in paise', async () => {
    const { pos, db } = await setup();
    const po = await pos.create('tenant-a', 'user-7', {
      ...valid, lines: [{ partId: 'A', quantity: 3, rate: 10.1 }, { partId: 'B', quantity: 2, rate: 0.5 }]
    });
    expect(po.total).toBe(31.3);
    const stored = await db.execute("SELECT rate FROM vendor_purchase_order_lines WHERE spare_item_id = 'A'");
    expect(stored.rows[0].rate).toBe(1010);
  });

  it('numbers POs in sequence per year and per tenant', async () => {
    const { pos } = await setup();
    const a = await pos.create('tenant-a', 'u', valid);
    const b = await pos.create('tenant-a', 'u', valid);
    const other = await pos.create('tenant-b', 'u', valid);
    expect([a.poNumber, b.poNumber, other.poNumber]).toEqual(['PO-2026-0001', 'PO-2026-0002', 'PO-2026-0001']);
  });

  it('starts the number again in a new year', async () => {
    let when = new Date('2026-12-31T10:00:00Z');
    const { pos } = await setup(() => when);
    await pos.create('tenant-a', 'u', valid);
    when = new Date('2027-01-02T10:00:00Z');
    expect((await pos.create('tenant-a', 'u', valid)).poNumber).toBe('PO-2027-0001');
  });

  it('lists newest first and keeps tenants apart', async () => {
    let t = 0;
    const { pos } = await setup(() => new Date(Date.UTC(2026, 10, 17, 10, 0, t++)));
    const first = await pos.create('tenant-a', 'u', valid);
    const second = await pos.create('tenant-a', 'u', { ...valid, lines: [{ ...line, partId: 'PART-2' }] });
    expect((await pos.list('tenant-a')).map((p) => p.id)).toEqual([second.id, first.id]);
    expect(await pos.list('tenant-b')).toEqual([]);
  });

  it('answers 404 for a PO that is not there, and does not show it to another tenant', async () => {
    const { pos } = await setup();
    const po = await pos.create('tenant-a', 'u', valid);
    await expect(pos.get('tenant-b', po.id)).rejects.toMatchObject({ status: 404 });
  });

  it('rejects an invalid tenant id', async () => {
    const { pos } = await setup();
    await expect(pos.list('bad tenant!')).rejects.toThrow(/tenant/);
  });

  it.each([
    ['missing vendor', { ...valid, vendorId: '' }, /vendorId/],
    ['missing unit', { ...valid, unitId: undefined }, /unitId/],
    ['no lines', { ...valid, lines: [] }, /at least one line/],
    ['lines not a list', { ...valid, lines: 'x' }, /at least one line/],
    ['missing part on a line', { ...valid, lines: [{ ...line, partId: '' }] }, /partId/],
    ['zero quantity', { ...valid, lines: [{ ...line, quantity: 0 }] }, /quantity/],
    ['fractional quantity', { ...valid, lines: [{ ...line, quantity: 1.5 }] }, /quantity/],
    ['negative rate', { ...valid, lines: [{ ...line, rate: -1 }] }, /rate/],
    ['rate as text', { ...valid, lines: [{ ...line, rate: '250' }] }, /rate/],
    ['rate with three decimals', { ...valid, lines: [{ ...line, rate: 1.005 }] }, /2 decimal/],
    ['same part twice', { ...valid, lines: [line, { ...line, quantity: 2 }] }, /more than once/]
  ])('refuses %s with a 400 and stores nothing', async (_name, input, message) => {
    const { pos } = await setup();
    const err = await pos.create('tenant-a', 'u', input as any).catch((e) => e);
    expect(err).toBeInstanceOf(PurchaseOrderError);
    expect(err.status).toBe(400);
    expect(err.message).toMatch(message);
    expect(await pos.list('tenant-a')).toEqual([]);
  });

  it('refuses an inactive vendor with 422 and stores nothing; an active vendor is accepted', async () => {
    const { pos, vendors } = await setup();
    const active = await vendors.create('tenant-a', { name: 'Alpha' });
    const gone = await vendors.create('tenant-a', { name: 'Gone' });
    await vendors.deactivate('tenant-a', gone.id);

    const err = await pos.create('tenant-a', 'u', { ...valid, vendorId: gone.id }).catch((e) => e);
    expect(err).toBeInstanceOf(PurchaseOrderError);
    expect(err.status).toBe(422);
    expect(err.message).toMatch(/inactive/);
    expect(await pos.list('tenant-a')).toEqual([]);

    const po = await pos.create('tenant-a', 'u', { ...valid, vendorId: active.id });
    expect(po.vendorId).toBe(active.id);
  });

  it('trims the vendor and unit ids', async () => {
    const { pos } = await setup();
    const po = await pos.create('tenant-a', 'u', { ...valid, vendorId: '  VEN-1 ', unitId: ' UNIT-1 ' });
    expect(po).toMatchObject({ vendorId: 'VEN-1', unitId: 'UNIT-1' });
  });
});
