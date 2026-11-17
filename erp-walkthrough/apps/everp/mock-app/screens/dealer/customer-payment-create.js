import { pageHead, inr, esc } from '../../shared/components.js?v=5';
import { button, input, select } from '../../shared/form.js?v=5';

export const meta = { code: 'D23', name: 'Customer Payment Create', side: 'dealer', icon: 'payments', nav: 'Sales', roles: ['dealer-sales', 'dealer-owner'] };

export function render({ data }) {
  const p = data.payment;
  const charges = Math.round((p.amount * p.bankCharges) / 100);
  return `
    ${pageHead('Customer Payment Create', button('create', { action: 'create-payment', primary: true }))}
    <div class="card row">
      ${select('Payment Type', ['Advance', 'Invoice', 'Refund'], p.type, { required: true, toast: 'Payment Type: Invoice would show "+ Link invoice". Refund would need a refund link.' })}
      ${input('Customer Name', data.customer.name, { required: true })}
      ${input('Payment Date', p.date, { type: 'date', required: true })}
      ${select('Payment Mode', ['Cash', 'Card', 'Upi', 'Cheque', 'Net Banking'], p.mode, { required: true })}
      ${input('Amount', p.amount, { type: 'number', required: true })}
      ${input('Bank Charges (%)', p.bankCharges, { type: 'number', required: true })}
      ${input('Transaction ID', p.transactionId, { required: true })}
      <label class="field"><span>Notes</span><textarea data-toast="Notes are internal use and not visible to the customer (F5).">${esc(p.notes)}</textarea></label>
      <label class="field"><span>Attachments</span><input type="file" data-toast="Attachments would be added to the payment."></label>
    </div>
    <div class="card kv">
      <div><span>Received</span><strong>${inr(p.amount)}</strong></div>
      <div><span>Bank charges</span><strong>${inr(charges)}</strong></div>
      <div><span>Total</span><strong>${inr(p.amount + charges)}</strong></div>
    </div>
    <p class="note">Transaction ID is required even for cash. Notes are internal (F5): not shown to the customer, not printed.</p>`;
}
