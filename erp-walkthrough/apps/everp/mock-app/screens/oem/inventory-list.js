import { pageHead, table, badge, statusTone, esc } from '../../shared/components.js?v=5';
import { button, select } from '../../shared/form.js?v=5';

export const meta = { code: 'O31', name: 'Inventory List per Product', side: 'oem', icon: 'inventory', nav: 'Inventory', roles: ['oem-inventory-mgr'] };

// Spec: status (available / locked / delivered / draft), unit filter, add stock (leads to O35).
// Roles: ADM, APM, DH, DM (not in people.md; Ruby is used, see gap list). Columns are not defined: Product, Quantity, Status are used.
const STATUSES = ['available', 'locked', 'delivered', 'draft'];

export function render({ data }) {
  const rows = data.stock.items.map((i) => [esc(i.product), i.quantity, badge(i.status, statusTone(i.status))]);
  return `
    ${pageHead('Inventory List', button('add stock', { action: 'add-stock', goto: 'O35', primary: true }))}
    <div class="card row">
      ${select('Status', STATUSES, 'available', { toast: 'Status would filter the stock by its status.' })}
      ${select('Unit', [data.mu.name], data.mu.name, { toast: 'Unit would filter the stock by manufacturing unit.' })}
    </div>
    ${table(['Product', 'Quantity', 'Status'], rows)}`;
}
