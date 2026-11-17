import { pageHead, table, badge, statusTone, esc, inr } from '../../shared/components.js?v=5';
import { button, input, select } from '../../shared/form.js?v=5';

export const meta = { code: 'O19', name: 'Dispatch Plan', side: 'oem', icon: 'orders', nav: 'Orders', roles: ['oem-logistics-mgr'] };

// Spec: filters (unit, dates), select paid POs, combine paid POs into batch, revert, print.
export function render({ data }) {
  const o = data.order;
  const rows = o.paymentStatus === 'Verified'
    ? [[`<input type="checkbox" data-toast="Select this paid PO for the batch."> `, esc(o.id), esc(data.dealer.name), o.qty, inr(o.total), badge(o.paymentStatus, statusTone(o.paymentStatus))]]
    : [];
  return `
    ${pageHead('Dispatch Plan', `
      ${button('Combine paid POs into batch', { action: 'combine-batch', primary: true })}
      ${button('Revert', { toast: 'Revert would take the selected POs out of the dispatch batch.' })}
      ${button('Print', { toast: 'Print would print the dispatch batch.' })}`)}
    <div class="card row">
      ${select('Unit', [data.mu.name], data.mu.name, { toast: 'Unit would filter the dispatch plan.' })}
      ${input('From date', o.date, { type: 'date', toast: 'From date would filter the dispatch plan.' })}
      ${input('To date', o.expectedDispatch, { type: 'date', toast: 'To date would filter the dispatch plan.' })}
    </div>
    ${table(['Select', 'PO number', 'Dealer', 'Qty', 'Amount', 'Payment status'], rows)}`;
}
