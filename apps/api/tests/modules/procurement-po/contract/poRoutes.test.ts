/// <reference types="jest" />
import express, { Express, Router } from 'express';
import { AddressInfo } from 'net';
import { createDb, Db } from '../../../../src/db/client';
import { poRoutes } from '../../../../src/procurement/poRoutes';

// Mounts the PO routes the way the app does: database on app.get('db'); the tenant, and the signed-in user when the test
// sends the x-test-user header, are set by the middleware in front of them.
function appFor(db: Db, tenantId: string): Express {
  const app = express();
  app.use(express.json());
  app.set('db', db);
  app.use((req: any, _res, next) => {
    req.tenantId = tenantId;
    const user = req.headers['x-test-user'];
    const roles = req.headers['x-test-roles'];
    if (typeof user === 'string') req.auth = { userId: user, roles: typeof roles === 'string' ? roles.split(',') : [], claims: {} };
    next();
  });
  const router = Router();
  poRoutes.mount(router);
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

const valid = { vendorId: 'VEN-1', unitId: 'UNIT-1', lines: [{ partId: 'PART-9', quantity: 14, rate: 250.5 }] };
const signedIn = { 'content-type': 'application/json', 'x-test-user': 'user-7', 'x-test-roles': 'procurement-manager' };
const PATH = '/api/procurement/vendor-purchase-orders';

describe('purchase order routes', () => {
  it('creates a PO for the signed-in user (201, number, draft, total) and lists it for the tenant', async () => {
    const db = createDb({ url: ':memory:' });
    await withServer(appFor(db, 'tenant-a'), async (base) => {
      const created = await fetch(`${base}${PATH}`, { method: 'POST', headers: signedIn, body: JSON.stringify(valid) });
      expect(created.status).toBe(201);
      const po = await created.json();
      expect(po).toMatchObject({ vendorId: 'VEN-1', unitId: 'UNIT-1', status: 'draft', createdBy: 'user-7', total: 3507 });
      expect(po.poNumber).toMatch(/^PO-\d{4}-0001$/);

      const listed = await (await fetch(`${base}${PATH}`)).json();
      expect(listed.purchaseOrders).toEqual([po]);

      const one = await (await fetch(`${base}${PATH}/${po.id}`)).json();
      expect(one).toEqual(po);
    });
  });

  it('refuses a create by a signed-in user without the procurement-manager role (403) and stores nothing', async () => {
    const db = createDb({ url: ':memory:' });
    await withServer(appFor(db, 'tenant-a'), async (base) => {
      const res = await fetch(`${base}${PATH}`, { method: 'POST', headers: { ...signedIn, 'x-test-roles': 'buyer' }, body: JSON.stringify(valid) });
      expect(res.status).toBe(403);
      expect((await (await fetch(`${base}${PATH}`)).json()).purchaseOrders).toEqual([]);
    });
  });

  it('refuses a create with no signed-in user (401) and stores nothing', async () => {
    const db = createDb({ url: ':memory:' });
    await withServer(appFor(db, 'tenant-a'), async (base) => {
      const res = await fetch(`${base}${PATH}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(valid) });
      expect(res.status).toBe(401);
      expect((await (await fetch(`${base}${PATH}`)).json()).purchaseOrders).toEqual([]);
    });
  });

  it('answers 400 with the validation message for a bad body and stores nothing', async () => {
    const db = createDb({ url: ':memory:' });
    await withServer(appFor(db, 'tenant-a'), async (base) => {
      const bad = { ...valid, lines: [{ ...valid.lines[0], quantity: 0 }] };
      const res = await fetch(`${base}${PATH}`, { method: 'POST', headers: signedIn, body: JSON.stringify(bad) });
      expect(res.status).toBe(400);
      expect((await res.json()).error).toMatch(/quantity/);
      expect((await (await fetch(`${base}${PATH}`)).json()).purchaseOrders).toEqual([]);
    });
  });

  it('answers 404 for a PO id that does not exist', async () => {
    const db = createDb({ url: ':memory:' });
    await withServer(appFor(db, 'tenant-a'), async (base) => {
      expect((await fetch(`${base}${PATH}/nope`)).status).toBe(404);
    });
  });

  it('does not show one tenant the POs of another', async () => {
    const db = createDb({ url: ':memory:' });
    await withServer(appFor(db, 'tenant-a'), (base) =>
      fetch(`${base}${PATH}`, { method: 'POST', headers: signedIn, body: JSON.stringify(valid) })
    );
    await withServer(appFor(db, 'tenant-b'), async (base) => {
      expect((await (await fetch(`${base}${PATH}`)).json()).purchaseOrders).toEqual([]);
    });
  });
});
