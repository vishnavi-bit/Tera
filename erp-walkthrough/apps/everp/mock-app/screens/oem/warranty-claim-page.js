import { pageHead, field, esc, inr } from '../../shared/components.js?v=5';
import { button, input, select, radios } from '../../shared/form.js?v=5';

export const meta = { code: 'O44', name: 'Warranty Claim Page', side: 'oem', icon: 'shield', nav: 'Warranty', roles: ['oem-super-admin'] };

const NOT_DEFINED = (section) => `The ${section} section has no field table in screen_details.md, so its fields are not defined.`;
const HEADING = (title, notDefined) => `<h2${notDefined ? ` data-not-defined="${esc(NOT_DEFINED(title))}"` : ''}>${esc(title)}</h2>`;

export function render({ data }) {
  const c = data.claim;
  const p = data.product;
  const sc = c.serviceCharge;
  const r = c.returnDetails;
  const rep = c.replacement;

  return `
    ${pageHead(`Warranty Claim Page`)}
    <div class="card">
      ${HEADING('Dealer & summary')}
      <div class="row">
        ${field('Dealer ID', data.dealer.id)}
        ${field('Dealer', data.dealer.name)}
        ${field('Model / variant', `${p.name} (${p.variant})`)}
        ${field('Claim received', c.receivedOn)}
        ${field('Warranty until', c.stillWarrantyUntil)}
      </div>
    </div>
    <div class="card">${HEADING('OEM review.', true)}</div>
    <div class="card">${HEADING('Customer & claim.', true)}</div>
    <div class="card">
      ${HEADING('Claimed item')}
      <div class="row">
        ${field('spare', c.spare)}
        ${field('brand', c.brand)}
        ${field('item no.', c.serials.join(', '))}
      </div>
    </div>
    <div class="card">${HEADING('Issue & coverage.', true)}</div>
    <div class="card">${HEADING('Dealer claim photos.', true)}</div>
    <div class="card">
      ${HEADING('Replacement details')}
      <div class="row">
        ${field('warranty type', rep.warrantyType)}
        ${field('product name / no.', rep.productName)}
        ${field('replacement ID (OEM / dealer)', rep.replacementId)}
        ${field('inventory source', rep.inventorySource)}
        ${field('claimed date', rep.claimedDate)}
      </div>
    </div>
    <div class="card">${HEADING('Dealer issue report (post-receipt).', true)}</div>

    <div class="card">
      <h2>Verify / Reject</h2>
      <div class="row">
        <label class="field"><span>reason</span><input placeholder="Required when rejecting" data-toast="reason would be saved with the rejection."></label>
      </div>
      <div class="page-actions" style="margin-top:12px">${button('verify / reject', { action: 'verify', primary: true })}</div>
    </div>
    <div class="card">
      <h2>Inspection</h2>
      <div class="row">
        <label class="field"><span>inspection report</span><input type="file" accept="image/*,application/pdf" data-toast="inspection report would be attached."></label>
        <label class="field"><span>notes</span><textarea data-toast="inspection notes would be saved."></textarea></label>
      </div>
      <div class="page-actions" style="margin-top:12px">${button('inspection report', { action: 'inspection' })}</div>
    </div>
    <div class="card">
      <h2>Ask cost from dealer</h2>
      <div class="row">
        ${input('amount (₹)', sc.amount, { type: 'number', required: true })}
        <label class="field"><span>notes for dealer</span><textarea data-toast="notes for dealer would be sent with the cost request."></textarea></label>
      </div>
      <div class="page-actions" style="margin-top:12px">${button('request / edit / waive service charge', { action: 'request-cost', primary: true })}</div>
    </div>
    <div class="card">
      <h2>Service charge controls</h2>
      <div class="row">
        ${field('dealer transaction ID', sc.transactionId)}
        ${field('amount', inr(sc.amount))}
        <label class="field"><span>reason</span><input placeholder="Required when rejecting" data-toast="reason would be saved with the payment rejection."></label>
      </div>
      <div class="page-actions" style="margin-top:12px">
        ${button('edit amount', { toast: 'edit amount would change the service charge.' })}
        ${button('waive charge', { toast: 'waive charge would waive the service charge.' })}
        ${button('reject payment', { toast: 'reject payment would reject the dealer payment (reason required).' })}
        ${button('verify / reject dealer payment', { action: 'verify-payment', primary: true })}
      </div>
    </div>
    <div class="card">
      <h2>Service or replacement</h2>
      <div class="row">
        ${radios('service', 'serviceOrReplacement', ['Service', 'Replacement'], 'Service', { required: true, toast: 'Replacement would need OEM stock (stock is not checked in this walkthrough).' })}
        <label class="field"><span>remark</span><textarea data-toast="remark would be saved."></textarea></label>
        <label class="field"><span>item_id</span><input data-toast="item_id would select the replacement stock line."></label>
        <label class="field"><span>replacement serial / product #</span><input data-toast="replacement serial / product # would be saved."></label>
        <label class="field"><span>serviceOn</span><input type="date" value="${esc(c.serviceOn ?? '')}" data-toast="serviceOn would be saved."></label>
      </div>
      <div class="page-actions" style="margin-top:12px">${button('service or replacement', { action: 'service', primary: true })}</div>
    </div>
    <div class="card">
      <h2>Return / complete</h2>
      <div class="row">
        ${input('company', r.company, { required: true })}
        ${input('contact number', r.contactNumber, { required: true })}
        ${select('transport', ['Road', 'Water', 'Air Wave', 'Train'], r.transport)}
        ${select('payment', ['Paid', 'Unpaid'], r.payment)}
        ${input('tracking No', r.trackingNo, { required: true })}
        ${input('date', r.date, { type: 'date' })}
        <label class="field"><span>attachments</span><input type="file" data-toast="attachments would be added to the return (up to 5 MB)."></label>
      </div>
      <div class="page-actions" style="margin-top:12px">${button('return details', { action: 'return', primary: true })}</div>
    </div>`;
}
