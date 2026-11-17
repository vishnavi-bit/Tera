// Vendor master (REQ-370, merged with the vendor purchase order requirement): the tenant-scoped data path for creating,
// reading, editing and deactivating vendors. Deactivation sets is_active to 0; nothing is deleted, so purchase orders that
// already reference a vendor keep working. Columns follow docs/project/db_design.md (vendors).
import crypto from 'crypto';
import { Db, asExecutor } from '../db/client';
import { createTenantDb } from '../tenancy/tenantDb';

// First version of the table (WI-035). Already applied in existing databases, so it is not edited.
export const VENDOR_MIGRATION = {
  id: '002-vendors',
  sql: `CREATE TABLE vendors (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    contact TEXT,
    phone TEXT,
    email TEXT,
    gst TEXT,
    address TEXT,
    notes TEXT,
    active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX vendors_tenant_name ON vendors (tenant_id, name)`
};

// Brings the table in line with the design doc: gst -> gst_number, active -> is_active, soft-delete column, one name per tenant.
export const VENDOR_DESIGN_COLUMNS_MIGRATION = {
  id: '004-vendors-design-columns',
  sql: `ALTER TABLE vendors RENAME COLUMN gst TO gst_number;
  ALTER TABLE vendors RENAME COLUMN active TO is_active;
  ALTER TABLE vendors ADD COLUMN deleted_at TEXT;
  CREATE UNIQUE INDEX vendors_tenant_name_uq ON vendors (tenant_id, name)`
};

// The role for vendor administration (docs/source/screen_details.md: Super Admin). Create, edit and deactivate need it.
export const OEM_ADMIN_ROLE = 'super-admin';

const COLUMNS = ['id', 'name', 'contact', 'phone', 'email', 'gst_number', 'address', 'notes', 'is_active', 'created_at', 'updated_at'];
const LIST_LIMIT = 500;
const TEXT_FIELDS = { contact: 120, phone: 32, email: 254, gst: 15, address: 500, notes: 2000 } as const;

export interface Vendor {
  id: string;
  name: string;
  contact: string | null;
  phone: string | null;
  email: string | null;
  gst: string | null;
  address: string | null;
  notes: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Carries an HTTP status so the app's error handler answers with it and the message.
export class VendorError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
    this.name = 'VendorError';
  }
}

type Fields = Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>;

function optionalText(value: unknown, name: string, max: number): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') throw new VendorError(`${name} must be text`);
  const t = value.trim();
  if (t.length > max) throw new VendorError(`${name} can be at most ${max} characters`);
  return t === '' ? null : t;
}

// Loose on purpose: an email is only checked for shape when given, and the GST number is not checked for format, so a
// vendor whose GST is not yet known can still be saved (GSTIN auto-fill is an open question, N01).
function checkEmail(email: string | null): string | null {
  if (email !== null && !/^[^\s@]+@[^\s@]+$/.test(email)) throw new VendorError('email is not a valid address');
  return email;
}

function parseName(value: unknown): string {
  if (typeof value !== 'string' || value.trim() === '' || value.trim().length > 120) throw new VendorError('name is required (1 to 120 characters)');
  return value.trim();
}

function parseActive(value: unknown): boolean {
  if (typeof value !== 'boolean') throw new VendorError('active must be true or false');
  return value;
}

// Full parse for create: name is required, active defaults to true.
export function parseVendorCreate(input: Record<string, unknown>): Fields {
  return {
    name: parseName(input.name),
    contact: optionalText(input.contact, 'contact', TEXT_FIELDS.contact),
    phone: optionalText(input.phone, 'phone', TEXT_FIELDS.phone),
    email: checkEmail(optionalText(input.email, 'email', TEXT_FIELDS.email)),
    gst: optionalText(input.gst, 'gst', TEXT_FIELDS.gst),
    address: optionalText(input.address, 'address', TEXT_FIELDS.address),
    notes: optionalText(input.notes, 'notes', TEXT_FIELDS.notes),
    active: input.active === undefined ? true : parseActive(input.active)
  };
}

// Partial parse for edit: only the fields that are present change. An empty edit is refused.
export function parseVendorPatch(input: Record<string, unknown>): Partial<Fields> {
  const patch: Partial<Fields> = {};
  if (input.name !== undefined) patch.name = parseName(input.name);
  if (input.contact !== undefined) patch.contact = optionalText(input.contact, 'contact', TEXT_FIELDS.contact);
  if (input.phone !== undefined) patch.phone = optionalText(input.phone, 'phone', TEXT_FIELDS.phone);
  if (input.email !== undefined) patch.email = checkEmail(optionalText(input.email, 'email', TEXT_FIELDS.email));
  if (input.gst !== undefined) patch.gst = optionalText(input.gst, 'gst', TEXT_FIELDS.gst);
  if (input.address !== undefined) patch.address = optionalText(input.address, 'address', TEXT_FIELDS.address);
  if (input.notes !== undefined) patch.notes = optionalText(input.notes, 'notes', TEXT_FIELDS.notes);
  if (input.active !== undefined) patch.active = parseActive(input.active);
  if (Object.keys(patch).length === 0) throw new VendorError('nothing to change: send at least one vendor field');
  return patch;
}

function toVendor(row: Record<string, unknown>): Vendor {
  const str = (v: unknown) => (v === null || v === undefined ? null : String(v));
  return {
    id: String(row.id),
    name: String(row.name),
    contact: str(row.contact),
    phone: str(row.phone),
    email: str(row.email),
    gst: str(row.gst_number),
    address: str(row.address),
    notes: str(row.notes),
    active: Number(row.is_active) === 1,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

// Stored form of a patch: API names become column names, booleans become 1/0.
function toColumns(patch: Partial<Fields>): Record<string, string | number | null> {
  const out: Record<string, string | number | null> = {};
  for (const [key, value] of Object.entries(patch)) {
    if (key === 'active') out.is_active = value ? 1 : 0;
    else if (key === 'gst') out.gst_number = value as string | null;
    else out[key] = value as string | null;
  }
  return out;
}

export function createVendorService(db: Db, now: () => Date = () => new Date()) {
  const tenantDb = createTenantDb(asExecutor(db), { tables: { vendors: COLUMNS } });

  async function find(tenantId: string, id: string): Promise<Vendor> {
    const rows = await tenantDb(tenantId).select('vendors', { id });
    if (rows.length === 0) throw new VendorError('vendor not found', 404);
    return toVendor(rows[0]);
  }

  async function update(tenantId: string, id: string, input: Record<string, unknown>): Promise<Vendor> {
    const patch = parseVendorPatch(input);
    await find(tenantId, id);
    await tenantDb(tenantId).update('vendors', { ...toColumns(patch), updated_at: now().toISOString() }, { id });
    return find(tenantId, id);
  }

  return {
    async create(tenantId: string, input: Record<string, unknown>): Promise<Vendor> {
      const fields = parseVendorCreate(input);
      const stamp = now().toISOString();
      const row = { id: crypto.randomUUID(), ...toColumns(fields), created_at: stamp, updated_at: stamp };
      await tenantDb(tenantId).insert('vendors', row);
      return find(tenantId, row.id);
    },
    get: find,
    async list(tenantId: string, options: { activeOnly?: boolean } = {}): Promise<Vendor[]> {
      const where: Record<string, number> = options.activeOnly ? { is_active: 1 } : {};
      const rows = await tenantDb(tenantId).select('vendors', where, { orderBy: 'name', limit: LIST_LIMIT });
      return rows.map(toVendor);
    },
    update,
    deactivate(tenantId: string, id: string): Promise<Vendor> {
      return update(tenantId, id, { active: false });
    },
    // True only when the vendor exists for this tenant and is inactive. An unknown id is not refused here.
    async isInactive(tenantId: string, id: string): Promise<boolean> {
      const rows = await tenantDb(tenantId).select('vendors', { id });
      return rows.length > 0 && Number(rows[0].is_active) === 0;
    }
  };
}
