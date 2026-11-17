// The app's tables, as Drizzle definitions. Migrations stay with the database module (the SQL lives next to each feature:
// src/procurement/*.ts). Columns follow docs/project/db_design.md.
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: integer('updated_at').notNull()
});

export type Setting = typeof settings.$inferSelect;

// Vendor master (REQ-370). Migrations 002 and 004 in src/procurement/vendors.ts.
export const vendors = sqliteTable('vendors', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  name: text('name').notNull(),
  contact: text('contact'),
  phone: text('phone'),
  email: text('email'),
  gstNumber: text('gst_number'),
  address: text('address'),
  notes: text('notes'),
  isActive: integer('is_active').notNull().default(1),
  deletedAt: text('deleted_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull()
});

// Vendor purchase orders (REQ-376, merged into REQ-370). Migration 003 in src/procurement/purchaseOrders.ts.
export const vendorPurchaseOrders = sqliteTable('vendor_purchase_orders', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  vendorId: text('vendor_id').notNull(),
  unitId: text('unit_id').notNull(),
  poNumber: text('po_number').notNull(),
  status: text('status').notNull().default('draft'),
  createdBy: text('created_by').notNull(),
  approvedBy: text('approved_by'),
  approvedAt: text('approved_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull()
});

export const vendorPurchaseOrderLines = sqliteTable('vendor_purchase_order_lines', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  vpoId: text('vpo_id').notNull(),
  spareItemId: text('spare_item_id').notNull(),
  quantity: integer('quantity').notNull(),
  rate: integer('rate').notNull()                       // paise
});

// Kept for history: the first single-line table (WI-032). New POs do not use it.
export const purchaseOrders = sqliteTable('purchase_orders', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  vendorId: text('vendor_id').notNull(),
  partId: text('part_id').notNull(),
  quantity: integer('quantity').notNull(),
  rate: real('rate').notNull(),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull()
});
