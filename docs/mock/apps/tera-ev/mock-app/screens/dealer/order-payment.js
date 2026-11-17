import { pageHead, esc, badge, statusTone, inr } from '../../shared/components.js?v=1';
import { input, button } from '../../shared/form.js?v=1';

export const meta = { code: 'S02', name: 'Dealer pays order advance', side: 'dealer', icon: 'parcel', roles: ['dealer-owner'] };

export function render({ data }) {
  const o = data.order;
  const p = data.payment;
  return `
    ${pageHead(`Purchase > ${esc(o.id)} > Pay advance`)}
    <div class="card">
      <p>Status: ${badge(o.status, statusTone(o.status))}</p>
      <p>Order total: ${inr(o.total)} · Required (30%): ${inr(o.advanceRequired)}</p>
      <p>Payment: ${badge(p.status, statusTone(p.status))}</p>
    </div>
    <div class="card">
      <button class="btn" data-not-defined="Whether receipt upload uses OCR to fill transaction, amount and date in this release is not defined (REQ-379 open question, D31). Manual entry is shown.">Upload receipt</button>
      <p class="note">OCR fills the fields (not defined for this release)</p>
      ${input('Transaction ID', p.txnId, { required: true, placeholder: 'UTR or reference number' })}
      ${input('Amount', String(p.amount), { required: true, type: 'number' })}
      ${input('Date', p.date, { required: true, type: 'date' })}
      <div class="page-actions">${button('Submit payment', { action: 'submit-payment', primary: true })}</div>
    </div>`;
}
