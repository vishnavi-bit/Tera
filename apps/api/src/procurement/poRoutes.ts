// Vendor purchase order routes (REQ-376, merged into REQ-370): create a PO with its lines, read one, list the tenant's POs.
// Creating needs a signed-in user (the PO records who raised it). The data path and rules live in purchaseOrders.ts.
import { Request, Response, Router } from 'express';
import { requireAnyRole } from '../auth/authMiddleware';
import { Db } from '../db/client';
import { getDb } from '../db/provider';
import { migrate } from '../db/migrate';
import { PROCUREMENT_MIGRATIONS } from './migrations';
import { createPurchaseOrderService, PO_ROLES } from './purchaseOrders';

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
  return createPurchaseOrderService(db);
}

const procurementOnly = requireAnyRole(PO_ROLES) as any;

export const poRoutes = {
  id: 'procurement-po',
  mount(router: Router) {
    router.get('/api/procurement/vendor-purchase-orders', async (req: Request, res: Response) => {
      const svc = await serviceFor(req);
      res.json({ purchaseOrders: await svc.list((req as any).tenantId) });
    });
    router.get('/api/procurement/vendor-purchase-orders/:id', async (req: Request, res: Response) => {
      const svc = await serviceFor(req);
      res.json(await svc.get((req as any).tenantId, String(req.params.id)));
    });
    router.post('/api/procurement/vendor-purchase-orders', procurementOnly, async (req: Request, res: Response) => {
      const svc = await serviceFor(req);
      const po = await svc.create((req as any).tenantId, (req as any).auth.userId, req.body ?? {});
      res.status(201).json(po);
    });
  }
};
