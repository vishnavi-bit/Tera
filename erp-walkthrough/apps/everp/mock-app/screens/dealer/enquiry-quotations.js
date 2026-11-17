import { pageHead, table, badge, inr, esc } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'D11', name: 'Enquiry Quotations List', side: 'dealer', icon: 'search', nav: 'Enquiry', roles: ['dealer-sales', 'dealer-owner'] };

export function render({ data }) {
  const q = data.quotation;
  const total = q.lines.reduce((s, l) => s + l.total, 0) + Number(q.adjustment);
  const rows = q.status === 'Not created' ? [] : [[`<button class="link" data-toast="open would show the quotation (D12 shape, read only).">${esc(q.id)}</button>`, esc(q.date), esc(q.expiryDate), inr(total), badge('Created', 'good')]];
  return `
    ${pageHead(`Quotations for ${data.enquiry.id}`, button('create', { action: 'create-quotation', goto: 'D12', primary: true }))}
    ${rows.length ? table(['Quotation', 'Date', 'Expiry', 'Total', 'Status'], rows) : '<div class="card"><p class="note">No quotations for this enquiry yet.</p></div>'}
    <p class="note">The spec gives no column list for this screen (see gap list).</p>`;
}
