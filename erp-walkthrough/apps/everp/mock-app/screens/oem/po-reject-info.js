import { pageHead, esc } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'O24', name: 'PO Reject / Info Note / Expected Date', side: 'oem', icon: 'orders', nav: null, roles: ['oem-super-admin'] };

// Spec: an inline part of O20 (dialog / inline). Shown here as its own screen (assumption, see gap list).
// The info note and expected dispatch date labels come from the O20 field table. Approve is not used in this tour.
export function render({ data }) {
  const o = data.order;
  return `
    ${pageHead('PO Reject / Info Note / Expected Date', button('Approve', { toast: 'Approve would approve the PO on Order Detail (O20).' }))}
    <p class="note">${esc(o.id)}</p>
    <div class="card">
      <label class="field"><span>Add PO info note</span><textarea data-toast="Add PO info note would save an internal note, visible to OEM staff only.">${esc(o.infoNote)}</textarea></label>
      <div class="page-actions" style="margin-top:12px">${button('save note', { action: 'save-note' })}</div>
    </div>
    <div class="card">
      <label class="field"><span>Expected dispatch date</span><input type="date" value="${esc(o.expectedDispatch)}" data-toast="Expected dispatch date would be saved and the dealer notified."></label>
      <div class="page-actions" style="margin-top:12px">${button('save date', { action: 'save-date' })}</div>
    </div>
    <div class="card">
      <h2>Reason for Rejection</h2>
      <label class="field"><span>Remarks *</span><textarea data-toast="Remarks would be saved with the rejection."></textarea></label>
      <div class="page-actions" style="margin-top:12px">
        ${button('Reject', { action: 'reject', primary: true })}
        ${button('Revert cancelled PO', { action: 'revert' })}
      </div>
    </div>`;
}
