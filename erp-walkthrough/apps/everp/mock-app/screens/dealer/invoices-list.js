import { pageHead, table, badge, statusTone, inr, esc } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'D19', name: 'Customer Invoices List', side: 'dealer', icon: 'file', nav: 'Sales', roles: ['dealer-sales', 'dealer-owner'] };

export function render({ data }) {
  const i = data.invoice;
  const rows = i.status === 'Not created' ? [] : [[`<button class="link" data-toast="open would show the invoice (D21).">${esc(i.id)}</button>`, esc(i.date), inr(i.total), badge(i.status, statusTone(i.status))]];
  return `
    ${pageHead(`Invoices: ${data.customer.name}`, button('+ new', { action: 'new-invoice', goto: 'D20', primary: true }))}
    ${rows.length ? table(['Invoice', 'Date', 'Total', 'Status'], rows) : '<div class="card"><p class="note">No invoices for this customer yet.</p></div>'}
    <p class="note">The spec gives no column list for this screen (see gap list).</p>`;
}
