import { pageHead, inr } from '../../shared/components.js?v=5';
import { button, input } from '../../shared/form.js?v=5';

export const meta = { code: 'D46', name: 'Add Payment (Ledger Top-up)', side: 'dealer', icon: 'payments', nav: 'Payments', roles: ['dealer-owner'] };

export function render({ data }) {
  const t = data.topup;
  return `
    ${pageHead('Add Payment (Ledger Top-up)')}
    <div class="card row">
      ${input('Transaction ID', t.transactionId, { required: true, placeholder: 'Exactly as it appears on your bank record' })}
      ${input('Amount (₹)', t.amount, { type: 'number', required: true })}
      ${input('Payment Date', t.date, { type: 'date', required: true })}
      ${input('Note', t.note, { placeholder: 'Optional' })}
    </div>
    <div class="page-actions">${button('submit for verification', { action: 'submit-topup', primary: true })}</div>
    <p class="note">Amount: ${inr(t.amount)}. The OEM verifies it before it reaches the ledger. The spec says there is no proof upload on this dialog.</p>`;
}
