/// <reference types="jest" />
import express, { Express, Router } from 'express';
import { AddressInfo } from 'net';
import { createDb, Db } from '../../../../src/db/client';
import { migrate } from '../../../../src/db/migrate';
import { PROCUREMENT_MIGRATIONS } from '../../../../src/procurement/migrations';
import { createPurchaseOrderService, PurchaseOrderError } from '../../../../src/procurement/purchaseOrders';
import { createVendorService, OEM_ADMIN_ROLE, VendorError } from '../../../../src/procurement/vendors';
import { vendorRoutes } from '../../../../src/procurement/vendorRoutes';

const full = {
  name: '  Acme Castings ',
  contact: 'R. Iyer',
  phone: '+91 80000 00000',
  email: 'sales@acme.example',
  gst: '29ABCDE1234F1Z5',
  address: '12 Industrial Area, Pune',
  notes: 'Net 30'
};

async function setup(now = () => new Date('2026-11-17T10:00:00Z')) {
  const db = createDb({ url: ':memory:' });
  await migrate(db, PROCUREMENT_MIGRATIONS);
  return { db, vendors: createVendorService(db, now), pos: createPurchaseOrderService(db, now) };
}

describe('vendor master contract', () => {
  it('creates a vendor with all fields, trimmed, active by default', async () => {
    const { vendors } = await setup();
    const v = await vendors.create('tenant-a', full);
    expect(v).toMatchObject({ name: 'Acme Castings', contact: 'R. Iyer', email: 'sales@acme.example', gst: '29ABCDE1234F1Z5', active: true });
    expect(v.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(await vendors.get('tenant-a', v.id)).toEqual(v);
  });

  it('accepts a vendor with no GST and no optional fields (GST is entered by hand, not checked)', async () => {
    const { vendors } = await setup();
    const v = await vendors.create('tenant-a', { name: 'Walk-in Supplies' });
    expect(v).toMatchObject({ name: 'Walk-in Supplies', gst: null, email: null, active: true });
  });

  it.each([
    ['missing name', {}, /name/],
    ['blank name', { name: '   ' }, /name/],
    ['bad email', { name: 'X', email: 'not-an-email' }, /email/],
    ['active as text', { name: 'X', active: 'yes' }, /active/],
    ['overlong GST', { name: 'X', gst: '1'.repeat(16) }, /gst/]
  ])('refuses %s with a 400 and stores nothing', async (_n, input, message) => {
    const { vendors } = await setup();
    const err = await vendors.create('tenant-a', input as any).catch((e) => e);
    expect(err).toBeInstanceOf(VendorError);
    expect(err.status).toBe(400);
    expect(err.message).toMatch(message);
    expect(await vendors.list('tenant-a')).toEqual([]);
  });

  it('edits only the fields sent and refuses an empty edit', async () => {
    const { vendors } = await setup();
    const v = await vendors.create('tenant-a', full);
    const edited = await vendors.update('tenant-a', v.id, { phone: '+91 99999 99999', gst: '' });
    expect(edited).toMatchObject({ phone: '+91 99999 99999', gst: null, name: 'Acme Castings', email: 'sales@acme.example' });
    await expect(vendors.update('tenant-a', v.id, {})).rejects.toThrow(/nothing to change/);
  });

  it('deactivates a vendor without deleting it, and lists active vendors on their own', async () => {
    const { vendors } = await setup();
    const a = await vendors.create('tenant-a', { name: 'Alpha' });
    const b = await vendors.create('tenant-a', { name: 'Beta' });
    const off = await vendors.deactivate('tenant-a', b.id);
    expect(off.active).toBe(false);
    expect((await vendors.list('tenant-a')).map((v) => v.name)).toEqual(['Alpha', 'Beta']);
    expect((await vendors.list('tenant-a', { activeOnly: true })).map((v) => v.id)).toEqual([a.id]);
  });

  it('answers 404 for a vendor that is not there, and keeps tenants apart', async () => {
    const { vendors } = await setup();
    const v = await vendors.create('tenant-a', { name: 'Alpha' });
    await expect(vendors.get('tenant-a', 'missing')).rejects.toMatchObject({ status: 404 });
    await expect(vendors.get('tenant-b', v.id)).rejects.toMatchObject({ status: 404 });
    expect(await vendors.list('tenant-b')).toEqual([]);
  });

  it('refuses an inactive vendor on a new PO with 422, and still accepts an active one', async () => {
    const { vendors, pos } = await setup();
    const active = await vendors.create('tenant-a', { name: 'Alpha' });
    const gone = await vendors.create('tenant-a', { name: 'Gone' });
    await vendors.deactivate('tenant-a', gone.id);

    const lines = [{ partId: 'P1', quantity: 2, rate: 10 }];
    const err = await pos.create('tenant-a', 'u1', { vendorId: gone.id, unitId: 'U1', lines }).catch((e) => e);
    expect(err).toBeInstanceOf(PurchaseOrderError);
    expect(err.status).toBe(422);
    expect(err.message).toMatch(/inactive/);
    expect(await pos.list('tenant-a')).toEqual([]);

    const po = await pos.create('tenant-a', 'u1', { vendorId: active.id, unitId: 'U1', lines });
    expect(po.vendorId).toBe(active.id);
  });

  it('keeps an existing PO working after its vendor is deactivated', async () => {
    const { vendors, pos } = await setup();
    const v = await vendors.create('tenant-a', { name: 'Alpha' });
    const po = await pos.create('tenant-a', 'u1', { vendorId: v.id, unitId: 'U1', lines: [{ partId: 'P1', quantity: 2, rate: 10 }] });
    await vendors.deactivate('tenant-a', v.id);
    expect(await pos.list('tenant-a')).toEqual([po]);
  });
});

// Routes: mounted as the app does (database on app.get('db'); the tenant and the caller's roles set by middleware in front).
function appFor(db: Db, tenantId: string): Express {
  const app = express();
  app.use(express.json());
  app.set('db', db);
  app.use((req: any, _res, next) => {
    req.tenantId = tenantId;
    const roles = req.headers['x-test-roles'];
    if (typeof roles === 'string') req.auth = { userId: 'u1', roles: roles.split(',') , claims: {} };
    next();
  });
  const router = Router();
  vendorRoutes.mount(router);
  app.use(router);
  app.use((err: any, _req: any, res: any, _next: any) => res.status(err.status ?? 500).json({ error: err.message }));
  return app;
}

async function withServer<T>(app: Express, fn: (base: string) => Promise<T>): Promise<T> {
  const server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  try {
    return await fn(`http://127.0.0.1:${(server.address() as AddressInfo).port}`);
  } finally {
    await new Promise((r) => server.close(r));
  }
}

describe('vendor routes', () => {
  it('lets an OEM admin create, edit and deactivate; the list shows the change', async () => {
    const db = createDb({ url: ':memory:' });
    await withServer(appFor(db, 'tenant-a'), async (base) => {
      const admin = { 'x-test-roles': OEM_ADMIN_ROLE };
      const created = await fetch(`${base}/api/procurement/vendors`, { method: 'POST', headers: { ...admin, 'content-type': 'application/json' }, body: JSON.stringify(full) });
      expect(created.status).toBe(201);
      const v = await created.json();

      const edited = await fetch(`${base}/api/procurement/vendors/${v.id}`, { method: 'PATCH', headers: { ...admin, 'content-type': 'application/json' }, body: JSON.stringify({ phone: '111' }) });
      expect((await edited.json()).phone).toBe('111');

      const off = await fetch(`${base}/api/procurement/vendors/${v.id}/deactivate`, { method: 'POST', headers: admin });
      expect((await off.json()).active).toBe(false);

      const active = await (await fetch(`${base}/api/procurement/vendors?activeOnly=true`)).json();
      expect(active.vendors).toEqual([]);
      const all = await (await fetch(`${base}/api/procurement/vendors`)).json();
      expect(all.vendors.map((x: any) => x.id)).toEqual([v.id]);
    });
  });

  it('refuses create, edit and deactivate to a caller without the OEM admin role (403)', async () => {
    const db = createDb({ url: ':memory:' });
    await withServer(appFor(db, 'tenant-a'), async (base) => {
      const other = { 'x-test-roles': 'buyer', 'content-type': 'application/json' };
      expect((await fetch(`${base}/api/procurement/vendors`, { method: 'POST', headers: other, body: JSON.stringify(full) })).status).toBe(403);
      expect((await fetch(`${base}/api/procurement/vendors/x/deactivate`, { method: 'POST', headers: other })).status).toBe(403);
      expect((await fetch(`${base}/api/procurement/vendors`)).status).toBe(200);
    });
  });

  it('refuses an anonymous caller on create (401)', async () => {
    const db = createDb({ url: ':memory:' });
    await withServer(appFor(db, 'tenant-a'), async (base) => {
      const res = await fetch(`${base}/api/procurement/vendors`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(full) });
      expect(res.status).toBe(401);
    });
  });
});
