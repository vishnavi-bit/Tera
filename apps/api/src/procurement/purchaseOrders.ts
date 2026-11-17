// Vendor purchase orders (REQ-376, merged into REQ-370): a PO header with one or more lines, numbered PO-YYYY-NNNN per tenant.
// Rates are stored as integer paise; totals are calculated on read, never stored (docs/project/db_design.md, 3NF rule).
// Tables follow the design doc (vendor_purchase_orders, vendor_purchase_order_lines); po_number_sequences is added for numbering.
import crypto from 'crypto';
import { Db, asExecutor } from '../db/client';
import { createTenantDb } from '../tenancy/tenantDb';
import { createVendorService } from './vendors';

// First version (WI-032): a single-line table. Kept as history; new POs use the tables below.
export const PURCHASE_ORDER_MIGRATION = {
  id: '001-purchase-orders',
  sql: `CREATE TABLE purchase_orders (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    vendor_id TEXT NOT NULL,
    part_id TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    rate REAL NOT NULL CHECK (rate >= 0),
    status TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX purchase_orders_tenant_created ON purchase_orders (tenant_id, created_at)`
};

export const VENDOR_PURCHASE_ORDER_MIGRATION = {
  id: '003-vendor-purchase-orders',
  sql: `CREATE TABLE vendor_purchase_orders (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    vendor_id TEXT NOT NULL,
    unit_id TEXT NOT NULL,
    po_number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'received', 'cancelled')),
    created_by TEXT NOT NULL,
    approved_by TEXT,
    approved_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE (tenant_id, po_number)
  );
  CREATE INDEX vpo_tenant_created ON vendor_purchase_orders (tenant_id, created_at);
  CREATE TABLE vendor_purchase_order_lines (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    vpo_id TEXT NOT NULL REFERENCES vendor_purchase_orders (id),
    spare_item_id TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    rate INTEGER NOT NULL CHECK (rate >= 0),
    UNIQUE (vpo_id, spare_item_id)
  );
  CREATE INDEX vpol_vpo ON vendor_purchase_order_lines (vpo_id);
  CREATE TABLE po_number_sequences (
    tenant_id TEXT NOT NULL,
    year INTEGER NOT NULL,
    last_no INTEGER NOT NULL,
    PRIMARY KEY (tenant_id, year)
  )`
};

const HEADER_COLUMNS = ['id', 'vendor_id', 'unit_id', 'po_number', 'status', 'created_by', 'created_at', 'updated_at'];
const LINE_COLUMNS = ['id', 'vpo_id', 'spare_item_id', 'quantity', 'rate'];
const SEQUENCE_COLUMNS = ['year', 'last_no'];
const LIST_LIMIT = 200;
const MAX_LINES = 50;
const MAX_ALLOCATION_TRIES = 5;

export const INITIAL_STATUS = 'draft';
// Roles that may raise a purchase order (docs/source/screen_details.md: Procurement Mgr).
export const PO_ROLES = ['procurement-manager'];

export interface PurchaseOrderLineInput { partId: unknown; quantity: unknown; rate: unknown }
export interface PurchaseOrderInput { vendorId: unknown; unitId: unknown; lines: unknown }

// Rates and amounts are returned in rupees (number, 2 decimals). Money is stored as paise.
export interface PurchaseOrderLine { partId: string; quantity: number; rate: number; amount: number }
export interface PurchaseOrder {
  id: string; poNumber: string; vendorId: string; unitId: string; status: string; createdBy: string; createdAt: string;
  lines: PurchaseOrderLine[]; total: number; totalPaise: number;
}

// Carries an HTTP status so the app's error handler answers with it and the message (400 bad input, 404, 409, 422).
export class PurchaseOrderError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
    this.name = 'PurchaseOrderError';
  }
}

function text(value: unknown, name: string, max = 64): string {
  if (typeof value !== 'string' || value.trim() === '' || value.trim().length > max) throw new PurchaseOrderError(`${name} is required (1 to ${max} characters)`);
  return value.trim();
}

function parseLine(input: unknown, index: number): { partId: string; quantity: number; ratePaise: number } {
  const line = (input ?? {}) as PurchaseOrderLineInput;
  const partId = text(line.partId, `lines[${index}].partId`);
  if (!Number.isInteger(line.quantity) || (line.quantity as number) <= 0) throw new PurchaseOrderError(`lines[${index}].quantity must be a whole number above 0`);
  if (typeof line.rate !== 'number' || !Number.isFinite(line.rate) || line.rate < 0) throw new PurchaseOrderError(`lines[${index}].rate must be a number, 0 or more`);
  const paise = Math.round(line.rate * 100);
  if (Math.abs(paise - line.rate * 100) > 1e-6) throw new PurchaseOrderError(`lines[${index}].rate can have at most 2 decimal places`);
  return { partId, quantity: line.quantity as number, ratePaise: paise };
}

export function parsePurchaseOrder(input: PurchaseOrderInput) {
  const vendorId = text(input.vendorId, 'vendorId');
  const unitId = text(input.unitId, 'unitId');
  if (!Array.isArray(input.lines) || input.lines.length === 0) throw new PurchaseOrderError('at least one line is required');
  if (input.lines.length > MAX_LINES) throw new PurchaseOrderError(`a PO can have at most ${MAX_LINES} lines`);
  const lines = input.lines.map((l, i) => parseLine(l, i));
  const seen = new Set<string>();
  for (const l of lines) {
    if (seen.has(l.partId)) throw new PurchaseOrderError(`part ${l.partId} is on the PO more than once: combine the lines`);
    seen.add(l.partId);
  }
  return { vendorId, unitId, lines };
}

const toRupees = (paise: number) => Math.round(paise) / 100;

export function createPurchaseOrderService(db: Db, now: () => Date = () => new Date()) {
  const tenantDb = createTenantDb(asExecutor(db), {
    tables: { vendor_purchase_orders: HEADER_COLUMNS, vendor_purchase_order_lines: LINE_COLUMNS, po_number_sequences: SEQUENCE_COLUMNS }
  });
  const vendors = createVendorService(db, now);

  // Next number for the tenant and year. The counter moves only if nobody else moved it in between (compare-and-set), so
  // two saves at once cannot take the same number.
  async function nextNumber(tenantId: string, year: number): Promise<number> {
    const scope = tenantDb(tenantId);
    for (let attempt = 0; attempt < MAX_ALLOCATION_TRIES; attempt++) {
      const rows = await scope.select('po_number_sequences', { year });
      if (rows.length === 0) {
        try {
          await scope.insert('po_number_sequences', { year, last_no: 1 });
          return 1;
        } catch {
          continue;                                       // another save created the row first: read it again
        }
      }
      const current = Number(rows[0].last_no);
      const moved = await scope.update('po_number_sequences', { last_no: current + 1 }, { year, last_no: current });
      if (moved === 1) return current + 1;
    }
    throw new PurchaseOrderError('could not number the purchase order, try again', 409);
  }

  function build(header: Record<string, unknown>, lines: Record<string, unknown>[]): PurchaseOrder {
    const outLines = lines.map((l): PurchaseOrderLine => {
      const quantity = Number(l.quantity);
      const ratePaise = Number(l.rate);
      return { partId: String(l.spare_item_id), quantity, rate: toRupees(ratePaise), amount: toRupees(quantity * ratePaise) };
    });
    const totalPaise = lines.reduce((sum, l) => sum + Number(l.quantity) * Number(l.rate), 0);
    return {
      id: String(header.id),
      poNumber: String(header.po_number),
      vendorId: String(header.vendor_id),
      unitId: String(header.unit_id),
      status: String(header.status),
      createdBy: String(header.created_by),
      createdAt: String(header.created_at),
      lines: outLines,
      total: toRupees(totalPaise),
      totalPaise
    };
  }

  async function find(tenantId: string, id: string): Promise<PurchaseOrder> {
    const scope = tenantDb(tenantId);
    const headers = await scope.select('vendor_purchase_orders', { id });
    if (headers.length === 0) throw new PurchaseOrderError('purchase order not found', 404);
    const lines = await scope.select('vendor_purchase_order_lines', { vpo_id: id });
    return build(headers[0], lines);
  }

  return {
    async create(tenantId: string, actorId: string, input: PurchaseOrderInput): Promise<PurchaseOrder> {
      const po = parsePurchaseOrder(input);
      // WI-035 rule: an inactive vendor cannot be chosen on a new PO. Checked here, so every API path is covered.
      if (await vendors.isInactive(tenantId, po.vendorId)) throw new PurchaseOrderError('vendor is inactive: choose an active vendor', 422);

      const at = now();
      const stamp = at.toISOString();
      const year = at.getUTCFullYear();
      const number = await nextNumber(tenantId, year);
      const id = crypto.randomUUID();
      const header = {
        id, vendor_id: po.vendorId, unit_id: po.unitId, po_number: `PO-${year}-${String(number).padStart(4, '0')}`,
        status: INITIAL_STATUS, created_by: actorId, created_at: stamp, updated_at: stamp
      };
      const scope = tenantDb(tenantId);
      await scope.insert('vendor_purchase_orders', header);
      try {
        for (const l of po.lines) {
          await scope.insert('vendor_purchase_order_lines', {
            id: crypto.randomUUID(), vpo_id: id, spare_item_id: l.partId, quantity: l.quantity, rate: l.ratePaise
          });
        }
      } catch (err) {
        // A PO without its lines must not stay behind: remove what was written, then report the failure.
        await scope.remove('vendor_purchase_order_lines', { vpo_id: id });
        await scope.remove('vendor_purchase_orders', { id });
        throw err;
      }
      return find(tenantId, id);
    },
    get: find,
    async list(tenantId: string): Promise<PurchaseOrder[]> {
      const scope = tenantDb(tenantId);
      const headers = await scope.select('vendor_purchase_orders', {}, { orderBy: 'created_at', desc: true, limit: LIST_LIMIT });
      if (headers.length === 0) return [];
      const lines = await scope.select('vendor_purchase_order_lines', {});
      const byPo = new Map<string, Record<string, unknown>[]>();
      for (const l of lines) {
        const key = String(l.vpo_id);
        byPo.set(key, [...(byPo.get(key) ?? []), l]);
      }
      return headers.map((h) => build(h, byPo.get(String(h.id)) ?? []));
    }
  };
}
