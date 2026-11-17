import { badge, statusTone, inr, table, pageHead, esc } from '../../shared/components.js?v=5';
import { button, input, select } from '../../shared/form.js?v=5';

export const meta = { code: 'O17', name: 'Orders List', side: 'oem', icon: 'orders', nav: 'Orders', roles: ['oem-sales-head'] };

// Spec: type tabs, unit / date / status filter, print. The PO number link opens the order (assumption, see gap list).
export function render({ data }) {
  const rows = data.orders.map((o) => [esc(o.id), esc(o.date), esc(data.dealer.name), esc(o.type), o.qty, inr(o.amount), badge(o.status, statusTone(o.status))]);
  // This list is reached only after the dealer has placed the order, so its row is always shown.
  const o = data.order;
  rows.unshift([
    `<button class="link" data-action="open-po">${esc(o.id)}</button>`,
    esc(o.date), esc(data.dealer.name), esc(o.type), o.qty, inr(o.total), badge(o.status, statusTone(o.status))
  ]);
  return `
    ${pageHead('Orders', button('Print', { toast: 'Print would print the orders list.' }))}
    <div class="card row">
      ${select('Unit', [data.mu.name], data.mu.name, { toast: 'Unit would filter the orders.' })}
      ${input('Date', o.date, { type: 'date', toast: 'Date would filter the orders.' })}
      ${select('Status', ['All statuses'], 'All statuses', { toast: 'Status would filter the orders.' })}
    </div>
    ${table(['PO number', 'Date', 'Dealer', 'Type', 'Qty', 'Amount', 'Status'], rows)}`;
}
