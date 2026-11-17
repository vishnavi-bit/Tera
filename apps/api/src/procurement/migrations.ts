// All procurement migrations in the order they run (forward-only; each one is applied once per database).
// Routes and tests migrate with this list so the schema is the same wherever it is set up.
import { PURCHASE_ORDER_MIGRATION, VENDOR_PURCHASE_ORDER_MIGRATION } from './purchaseOrders';
import { VENDOR_DESIGN_COLUMNS_MIGRATION, VENDOR_MIGRATION } from './vendors';

export const PROCUREMENT_MIGRATIONS = [PURCHASE_ORDER_MIGRATION, VENDOR_MIGRATION, VENDOR_PURCHASE_ORDER_MIGRATION, VENDOR_DESIGN_COLUMNS_MIGRATION];
