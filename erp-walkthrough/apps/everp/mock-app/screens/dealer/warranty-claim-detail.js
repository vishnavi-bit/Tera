import { pageHead, esc } from '../../shared/components.js?v=5';
import { button, input } from '../../shared/form.js?v=5';

export const meta = { code: 'D39', name: 'Warranty Claim Detail', side: 'dealer', icon: 'shield', nav: 'Warranty', roles: ['dealer-service', 'dealer-owner'] };

const NOT_DEFINED_DETAIL = 'The claim detail fields are not defined in screen_details.md. Only the actions below are shown.';

export function render({ data }) {
  const c = data.claim;
  const t = c.transit;
  const s = c.serviceCharge;

  return `
    ${pageHead(`Warranty Claim ${c.id}`, button('print receipt', { toast: 'print receipt would print the claim receipt.' }))}
    <h2 data-not-defined="${esc(NOT_DEFINED_DETAIL)}">Claim details</h2>
    <div class="card">
      <h2>Mark in transit</h2>
      <div class="row">
        ${input('company', t.company, { required: true })}
        ${input('contactNumber', t.contactNumber, { required: true })}
        ${input('trackingId', t.trackingId, { required: true })}
      </div>
      <div class="page-actions" style="margin-top:12px">${button('mark in transit', { action: 'mark-in-transit', primary: true })}</div>
    </div>
    <div class="card">
      <h2>Pay service charge</h2>
      <div class="row">
        ${input('amount', s.amount, { type: 'number', required: true })}
        ${input('transactionId', s.transactionId, { required: true })}
        <label class="field"><span>proof file</span><input type="file" accept="image/*,application/pdf" data-toast="proof file would be attached."></label>
      </div>
      <div class="page-actions" style="margin-top:12px">${button('pay service charge', { action: 'pay-service-charge', primary: true })}</div>
    </div>
    <div class="card">
      <h2>Confirm received</h2>
      <div class="page-actions">${button('confirm receipt', { action: 'confirm-receipt', primary: true })}</div>
    </div>
    <div class="card">
      <h2>Report post-receipt issue</h2>
      <div class="row">
        <label class="field"><span>description *</span><textarea data-toast="description would be saved with the post-receipt issue."></textarea></label>
        <label class="field"><span>media</span><input type="file" accept="image/*,video/*" data-toast="media would be attached to the post-receipt issue."></label>
      </div>
      <div class="page-actions" style="margin-top:12px">${button('report post-receipt issue', { toast: 'report post-receipt issue would send the issue to the OEM.' })}</div>
    </div>`;
}
