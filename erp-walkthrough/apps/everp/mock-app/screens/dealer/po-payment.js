import { inr, pageHead, field, esc } from '../../shared/components.js?v=5';
import { button, input } from '../../shared/form.js?v=5';

export const meta = { code: 'D31', name: 'PO Payment', side: 'dealer', nav: null, roles: ['dealer-owner'] };

// Spec: upload receipt (OCR), manual entry, apply ledger, submit. Values read from the receipt are locked.
export function render({ data }) {
  const o = data.order;
  return `
    ${pageHead('PO Payment', `
      ${button('Upload receipt', { toast: 'Upload receipt would send the receipt to OCR, which reads the transaction ID, amount and date.' })}
      ${button('Enter details manually', { toast: 'Enter details manually would let you type the transaction ID and amount.' })}`)}
    <div class="card kv">
      <div><span>Order</span><strong>${esc(o.id)}</strong></div>
      <div><span>Order total</span><strong>${inr(o.total)}</strong></div>
      <div><span>Advance required (${o.advancePercent}%)</span><strong>${inr(o.advanceDue)}</strong></div>
      <div><span>Paid so far</span><strong>${inr(o.paid)}</strong></div>
    </div>
    <div class="card">
      <h2>Receipt</h2>
      <div class="receipt">${esc(o.receiptFile)} (uploaded)</div>
      <div class="row" style="margin-top:12px">
        ${field('Transaction ID', o.transactionId)}
        ${field('Amount', inr(o.receivedAmount))}
        ${field('Payment date', o.paymentDate)}
      </div>
      <div class="row" style="margin-top:12px">
        ${input('Amount paid (₹)', o.receivedAmount, { type: 'number', required: true, toast: 'Amount paid would be saved.' })}
        ${input('Use for this order (₹)', o.advanceDue, { type: 'number', required: true, toast: 'Amount used for this order would be saved.' })}
        ${input('Note (optional)', o.note, { toast: 'Note would be saved with the payment.' })}
      </div>
    </div>
    <div class="card">
      <h2>Ledger</h2>
      <div class="row">
        ${input('Amount to apply (₹)', o.ledgerAmount, { type: 'number', toast: 'Amount to apply would be checked against the ledger balance.' })}
        ${input('Note', '', { toast: 'Note would be saved with the ledger use.' })}
      </div>
      <div class="page-actions" style="margin-top:12px">${button('Apply ledger', { toast: 'Apply ledger would use the dealer ledger balance on this order.' })}</div>
    </div>
    <div class="page-actions" style="margin-top:14px">${button('Submit', { action: 'submit-payment', primary: true })}</div>`;
}
