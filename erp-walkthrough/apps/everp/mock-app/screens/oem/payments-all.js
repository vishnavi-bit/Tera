import { pageHead, table, badge, statusTone, inr, esc } from '../../shared/components.js?v=5';
import { button, input, select } from '../../shared/form.js?v=5';

export const meta = { code: 'O45', name: 'Payments (All Dealers)', side: 'oem', icon: 'payments', nav: 'Payments', roles: ['oem-accounts'] };

export function render({ data }) {
  const rows = data.payments.map((p) => [esc(p.order), esc(data.dealer.name), esc(p.transactionId), inr(p.amount), esc(p.date), esc(p.date), esc(p.note), 'receipt', badge(p.status, statusTone(p.status)), '']);
  const t = data.topup;
  if (t.status !== 'Not submitted') {
    rows.unshift(['—', esc(data.dealer.name), esc(t.transactionId), inr(t.amount), esc(t.date), esc(t.date), esc(t.note), 'receipt', badge(t.status, statusTone(t.status)),
      t.status === 'Submitted' ? button('verify', { toast: 'Verify would verify this payment.' }) : '']);
  }
  return `
    ${pageHead('Payments (All Dealers)')}
    <div class="card row">
      ${input('Search', '', { placeholder: 'Search', toast: 'Search would filter the payments.' })}
      ${select('Status', ['all'], 'all', { notDefined: 'The status options are not in screen_details.md.' })}
      ${input('Date range', '', { placeholder: 'from – to', toast: 'Date range would filter the payments by date.' })}
    </div>
    ${table(['Order', 'Dealer', 'Transaction ID', 'Used for order', 'Received', 'Payment date', 'Note', 'Receipt', 'Status', 'Action'], rows)}
    <div class="card row" style="margin-top:14px">
      ${input('Reject reason *', '', { placeholder: 'Required when rejecting', toast: 'Reject reason would be sent to the dealer, who resubmits.' })}
      ${button('reject', { toast: 'reject would send the payment back to the dealer for resubmission.' })}
    </div>
    <div class="card row">
      <h2>Ledger top-up</h2>
      <label class="field"><span>Verified</span><input type="checkbox" checked data-toast="Verified would mark the top-up as verified."></label>
      ${input('Note', '', { toast: 'Note would be saved with the verification.' })}
      ${button('verify ledger top-up', { action: 'verify-topup', primary: true })}
    </div>
    <p class="note">Spec columns also include "submitted"; it is shown with the payment date because the spec gives no separate value (see gap list). "view receipt" is the receipt column.</p>`;
}
