import { pageHead, table, inr, badge, statusTone, esc } from '../../shared/components.js?v=5';
import { select } from '../../shared/form.js?v=5';

export const meta = { code: 'O12', name: 'Dealer → Purchase Orders', side: 'oem', icon: 'orders', nav: 'Dealers', roles: ['oem-super-admin'] };

// Spec: status / type filter. The filter options and the columns are not defined (columns: D28 shape, assumed).
export function render({ data }) {
  const rows = data.purchaseOrders.map((p) => [esc(p.id), esc(p.date), esc(p.type), p.qty, inr(p.amount), badge(p.status, statusTone(p.status))]);
  return `
    ${pageHead('Purchase Orders')}
    <p class="note">Dealer: ${esc(data.dealer.name)}</p>
    <div class="card row">
      ${select('Status', [], undefined, { notDefined: 'The status filter options are not defined in screen_details.md.' })}
      ${select('Type', [], undefined, { notDefined: 'The type filter options are not defined in screen_details.md.' })}
    </div>
    ${table(['PO number', 'Date', 'Type', 'Qty', 'Amount', 'Status'], rows)}`;
}
