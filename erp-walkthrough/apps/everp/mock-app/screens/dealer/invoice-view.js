import { pageHead, table, badge, statusTone, inr, esc } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'D21', name: 'Invoice View', side: 'dealer', icon: 'file', nav: 'Sales', roles: ['dealer-sales', 'dealer-owner'] };

export function render({ data }) {
  const i = data.invoice;
  const paid = data.payment.status === 'Not recorded' ? 0 : data.payment.amount;
  const lines = table(['Item', 'HSN', 'Rate', 'SGST', 'CGST', 'Amount'], i.lines.map((l) => [esc(l.item), esc(l.hsn), inr(l.rate), inr(l.sgst), inr(l.cgst), inr(l.amount)]));
  return `
    ${pageHead(`Invoice ${i.id}`, button('print', { action: 'print-invoice', primary: true }))}
    <div class="card kv">
      <div><span>Dealer</span><strong>${esc(data.dealer.name)}</strong></div>
      <div><span>Customer</span><strong>${esc(i.name)}</strong></div>
      <div><span>Invoice date</span><strong>${esc(i.date)}</strong></div>
      <div><span>Due date</span><strong>${esc(i.dueDate)}</strong></div>
    </div>
    ${lines}
    <div class="card kv" style="margin-top:14px">
      <div><span>Total</span><strong>${inr(i.total)}</strong></div>
      <div><span>Paid</span><strong>${inr(paid)}</strong></div>
      <div><span>Balance</span><strong>${inr(i.total - paid)}</strong></div>
      <div><span>Status</span>${badge(i.status, statusTone(i.status))}</div>
    </div>
    <p class="note">The spec says only "print" for this screen. The layout is the walkthrough's own (see gap list). The printed invoice carries English and Marathi warranty terms (D20).</p>`;
}
