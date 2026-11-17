import { inr, pageHead, table, badge, statusTone, esc } from '../../shared/components.js?v=5';
import { button, input } from '../../shared/form.js?v=5';

export const meta = { code: 'O23', name: 'Payment Verify', side: 'oem', icon: 'payments', nav: 'Payments', roles: ['oem-accounts'] };

// Spec: payments list columns, verify, reject (reason), ledger top-up verify.
export function render({ data }) {
  const o = data.order;
  return `
    ${pageHead('Payment Verify')}
    ${table(
      ['Order', 'Dealer', 'Transaction ID', 'Used for order', 'Received', 'Payment date', 'Submitted', 'Note', 'Receipt', 'Status', 'Action'],
      [[
        esc(o.id), esc(data.dealer.name), esc(o.transactionId), inr(o.advanceDue), inr(o.receivedAmount),
        esc(o.paymentDate), esc(o.paymentSubmitted), esc(o.note), esc(o.receiptFile),
        badge(o.paymentStatus, statusTone(o.paymentStatus)),
        button('Verify', { action: 'verify-payment', primary: true })
      ]]
    )}
    <div class="card row" style="margin-top:14px">
      ${input('Reject reason *', '', { placeholder: 'Required when rejecting', toast: 'Reject reason would be sent to the dealer.' })}
      ${button('Reject', { action: 'reject-payment' })}
    </div>
    <div class="card row" style="margin-top:14px">
      <label class="field"><span>Verified</span><input type="checkbox" data-toast="Verified would mark the ledger top-up as verified."></label>
      ${input('Ledger top-up note', '', { toast: 'Ledger top-up note would be saved.' })}
      ${button('Verify ledger top-up', { toast: 'Verify ledger top-up would verify a dealer ledger top-up.' })}
    </div>`;
}
