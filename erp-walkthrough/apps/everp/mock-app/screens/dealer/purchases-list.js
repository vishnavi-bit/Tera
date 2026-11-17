import { badge, statusTone, inr, table, pageHead, esc } from '../../shared/components.js?v=5';
import { button, input, select } from '../../shared/form.js?v=5';

export const meta = { code: 'D28', name: 'Purchases List', side: 'dealer', icon: 'orders', nav: 'Purchases', roles: ['dealer-owner'] };

// Spec: filter (12 statuses), search, new. The order placed in the walkthrough is listed once it has left the cart.
export function render({ data }) {
  const rows = data.orders.map((o) => [
    esc(o.id), esc(o.date), esc(o.type), o.qty, inr(o.amount), badge(o.status, statusTone(o.status))
  ]);
  const o = data.order;
  if (o.status !== 'Not placed') {
    rows.unshift([esc(o.id), esc(o.date), esc(o.type), o.qty, inr(o.total), badge(o.status, statusTone(o.status))]);
  }
  return `
    ${pageHead('Purchases', button('New', { action: 'new-purchase', goto: 'D29', primary: true }))}
    <div class="card row">
      ${select('Filter', ['All'], 'All', { toast: 'Filter would show only the purchase orders in the chosen status.' })}
      ${input('Search', '', { placeholder: 'Search', toast: 'Search would find a purchase order by its number.' })}
    </div>
    ${table(['PO number', 'Date', 'Type', 'Qty', 'Amount', 'Status'], rows)}`;
}
