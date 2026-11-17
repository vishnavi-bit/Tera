// Vendor master routes (WI-035): list and read vendors for the tenant; create, edit and deactivate need the OEM admin role.
// Data path and validation live in vendors.ts. The vendors table is created on first use (idempotent, once per database).
import { Request, Response, Router } from 'express';
import { requireRole } from '../auth/authMiddleware';
import { Db } from '../db/client';
import { getDb } from '../db/provider';
import { migrate } from '../db/migrate';
import { PROCUREMENT_MIGRATIONS } from './migrations';
import { createVendorService, OEM_ADMIN_ROLE } from './vendors';

const ready = new WeakMap<Db, Promise<void>>();

function ensureSchema(db: Db): Promise<void> {
  let p = ready.get(db);
  if (!p) {
    p = migrate(db, PROCUREMENT_MIGRATIONS).then(() => undefined);
    ready.set(db, p);
    p.catch(() => ready.delete(db));                                    // a failed attempt is retried on the next request
  }
  return p;
}

async function serviceFor(req: Request) {
  const db = getDb(req.app);
  await ensureSchema(db);
  return createVendorService(db);
}

const adminOnly = requireRole(OEM_ADMIN_ROLE) as any;

export const vendorRoutes = {
  id: 'procurement-vendors',
  mount(router: Router) {
    router.get('/api/procurement/vendors', async (req: Request, res: Response) => {
      const svc = await serviceFor(req);
      const activeOnly = req.query.activeOnly === 'true';
      res.json({ vendors: await svc.list((req as any).tenantId, { activeOnly }) });
    });
    router.get('/api/procurement/vendors/:id', async (req: Request, res: Response) => {
      const svc = await serviceFor(req);
      res.json(await svc.get((req as any).tenantId, String(req.params.id)));
    });
    router.post('/api/procurement/vendors', adminOnly, async (req: Request, res: Response) => {
      const svc = await serviceFor(req);
      const vendor = await svc.create((req as any).tenantId, req.body ?? {});
      res.status(201).json(vendor);
    });
    router.patch('/api/procurement/vendors/:id', adminOnly, async (req: Request, res: Response) => {
      const svc = await serviceFor(req);
      res.json(await svc.update((req as any).tenantId, String(req.params.id), req.body ?? {}));
    });
    router.post('/api/procurement/vendors/:id/deactivate', adminOnly, async (req: Request, res: Response) => {
      const svc = await serviceFor(req);
      res.json(await svc.deactivate((req as any).tenantId, String(req.params.id)));
    });
  }
};
