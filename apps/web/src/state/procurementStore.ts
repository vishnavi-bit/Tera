// Procurement (REQ-370, merged with REQ-376): the vendor master, the vendor purchase orders, and their form rules. The lists
// live in the app store; the rules are plain functions so the screens and the tests use the same ones. Field names match the
// API (src/procurement/*.ts in apps/api). Rates are typed in rupees; the API stores paise.
import { createAppStore } from './createStore';
import { apiFetch } from '../api/apiFetch';

// ---- Vendor master (REQ-370) ----

export interface Vendor {
  id: string; name: string; contact: string | null; phone: string | null; email: string | null; gst: string | null;
  address: string | null; notes: string | null; active: boolean; createdAt: string; updatedAt: string;
}

export interface VendorForm { name: string; active: boolean; contact: string; phone: string; email: string; gst: string; address: string; notes: string }
export type VendorFormErrors = Partial<Record<'name' | 'email' | 'gst', string>>;

export const EMPTY_VENDOR: VendorForm = { name: '', active: true, contact: '', phone: '', email: '', gst: '', address: '', notes: '' };
export const VENDOR_ENDPOINT = '/api/procurement/vendors';
export const useVendors = createAppStore({ vendors: [] as Vendor[] });

export function validateVendorForm(form: VendorForm): VendorFormErrors {
  const errors: VendorFormErrors = {};
  const name = form.name.trim();
  if (name === '') errors.name = 'Enter the vendor name';
  else if (name.length > 120) errors.name = 'Name can be at most 120 characters';
  const email = form.email.trim();
  if (email !== '' && !/^[^\s@]+@[^\s@]+$/.test(email)) errors.email = 'Enter an email like name@company.com';
  // GST is typed by hand and not checked for format: a vendor whose GST is not yet known can still be saved.
  if (form.gst.trim().length > 15) errors.gst = 'GST can be at most 15 characters';
  return errors;
}

export function toVendorPayload(form: VendorForm) {
  return {
    name: form.name.trim(), active: form.active, contact: form.contact.trim(), phone: form.phone.trim(),
    email: form.email.trim(), gst: form.gst.trim(), address: form.address.trim(), notes: form.notes.trim()
  };
}

export function vendorToForm(v: Vendor): VendorForm {
  return { name: v.name, active: v.active, contact: v.contact ?? '', phone: v.phone ?? '', email: v.email ?? '', gst: v.gst ?? '', address: v.address ?? '', notes: v.notes ?? '' };
}

// Vendors a PO may use: the active ones only.
export function activeVendors(vendors: Vendor[]): Vendor[] {
  return vendors.filter((v) => v.active);
}

export const SIGN_IN_NEEDED = 'Sign in is needed to see purchase orders.';
export const VENDOR_LOAD_FAILED = 'Vendors could not be loaded. Check that the API is running.';

export async function loadVendors(): Promise<Vendor[]> {
  const res = await apiFetch(VENDOR_ENDPOINT);
  if (res.status === 401) throw new Error(SIGN_IN_NEEDED);
  if (!res.ok) throw new Error(VENDOR_LOAD_FAILED);
  const list = ((await res.json()).vendors ?? []) as Vendor[];
  useVendors.setState({ vendors: list });
  return list;
}

export async function loadVendor(id: string): Promise<Vendor> {
  const res = await apiFetch(`${VENDOR_ENDPOINT}/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error ?? VENDOR_LOAD_FAILED);
  return (await res.json()) as Vendor;
}

// Creates a vendor, or edits one when id is given. Rejects with the server's message when the save is refused.
export async function saveVendor(form: VendorForm, id?: string): Promise<Vendor> {
  const res = await apiFetch(id ? `${VENDOR_ENDPOINT}/${encodeURIComponent(id)}` : VENDOR_ENDPOINT, {
    method: id ? 'PATCH' : 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(toVendorPayload(form))
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body.error === 'string' ? body.error : 'The vendor was not saved.');
  return body as Vendor;
}

export async function deactivateVendor(id: string): Promise<Vendor> {
  const res = await apiFetch(`${VENDOR_ENDPOINT}/${encodeURIComponent(id)}/deactivate`, { method: 'POST' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body.error === 'string' ? body.error : 'The vendor was not deactivated.');
  return body as Vendor;
}

// ---- Vendor purchase orders (REQ-376, merged into REQ-370) ----

export interface PurchaseOrderLine { partId: string; quantity: number; rate: number; amount: number }
export interface PurchaseOrder {
  id: string; poNumber: string; vendorId: string; unitId: string; status: string; createdBy: string; createdAt: string;
  lines: PurchaseOrderLine[]; total: number; totalPaise: number;
}

// The PO form takes one line for now. The shortage view (needed against stock) waits on Bill of materials (REQ-375).
export interface PoForm { vendorId: string; unitId: string; partId: string; quantity: string; rate: string }
export type PoFormErrors = Partial<Record<keyof PoForm, string>>;

export const usePurchaseOrders = createAppStore({ orders: [] as PurchaseOrder[] });

export const PO_ENDPOINT = '/api/procurement/vendor-purchase-orders';
export const LOAD_FAILED = 'Purchase orders could not be loaded. Check that the API is running.';

// Loads the tenant's POs into the store. Rejects with a short message: SIGN_IN_NEEDED when the API asks for a signed-in user.
export async function loadPurchaseOrders(): Promise<PurchaseOrder[]> {
  const res = await apiFetch(PO_ENDPOINT);
  if (res.status === 401) throw new Error(SIGN_IN_NEEDED);
  if (!res.ok) throw new Error(LOAD_FAILED);
  const list = ((await res.json()).purchaseOrders ?? []) as PurchaseOrder[];
  usePurchaseOrders.setState({ orders: list });
  return list;
}

export interface PoSummary { total: number; open: number; value: number; vendors: number; byStatus: Record<string, number> }

// Dashboard figures from the PO list. Open means status draft. Value is the sum of the PO totals (paise, shown in rupees).
export function summarizePurchaseOrders(orders: PurchaseOrder[]): PoSummary {
  const byStatus: Record<string, number> = {};
  let paise = 0;
  const vendors = new Set<string>();
  for (const po of orders) {
    byStatus[po.status] = (byStatus[po.status] ?? 0) + 1;
    paise += po.totalPaise;
    vendors.add(po.vendorId);
  }
  return {
    total: orders.length,
    open: byStatus['draft'] ?? 0,
    value: Math.round(paise) / 100,
    vendors: vendors.size,
    byStatus
  };
}

export function validatePoForm(form: PoForm): PoFormErrors {
  const errors: PoFormErrors = {};
  if (form.vendorId.trim() === '') errors.vendorId = 'Choose the vendor';
  if (form.unitId.trim() === '') errors.unitId = 'Enter the receiving unit';
  if (form.partId.trim() === '') errors.partId = 'Enter the part';
  const qty = Number(form.quantity);
  if (form.quantity.trim() === '' || !Number.isInteger(qty) || qty <= 0) errors.quantity = 'Quantity must be a whole number above 0';
  const rate = Number(form.rate);
  if (form.rate.trim() === '' || !Number.isFinite(rate) || rate < 0) errors.rate = 'Rate must be a number, 0 or more';
  else if (Math.abs(Math.round(rate * 100) - rate * 100) > 1e-6) errors.rate = 'Rate can have at most 2 decimal places';
  return errors;
}

export function toPoPayload(form: PoForm) {
  return {
    vendorId: form.vendorId.trim(),
    unitId: form.unitId.trim(),
    lines: [{ partId: form.partId.trim(), quantity: Number(form.quantity), rate: Number(form.rate) }]
  };
}
