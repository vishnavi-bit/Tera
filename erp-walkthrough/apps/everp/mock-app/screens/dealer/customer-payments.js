import { pageHead, table, inr, esc } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'D22', name: 'Customer Payments List', side: 'dealer', icon: 'payments', nav: 'Sales', roles: ['dealer-sales', 'dealer-owner'] };

export function render({ data }) {
  const p = data.payment;
  const rows = p.status === 'Not recorded' ? [] : [[`<button class="link" data-toast="open receipt would show the payment receipt.">${esc(p.id)}</button>`, esc(p.type), esc(p.date), esc(p.mode), inr(p.amount), esc(p.transactionId)]];
  return `
    ${pageHead(`Payments: ${data.customer.name}`, button('+ new', { action: 'new-payment', goto: 'D23', primary: true }))}
    ${rows.length ? table(['Payment', 'Type', 'Date', 'Mode', 'Amount', 'Transaction ID'], rows) : '<div class="card"><p class="note">No payments for this customer yet.</p></div>'}
    <p class="note">The spec gives no column list for this screen (see gap list).</p>`;
}
