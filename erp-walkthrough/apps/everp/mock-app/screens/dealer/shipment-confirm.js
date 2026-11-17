import { pageHead, esc, badge, statusTone } from '../../shared/components.js?v=5';
import { button, input, select } from '../../shared/form.js?v=5';

export const meta = { code: 'D32', name: 'Shipment Confirm', side: 'dealer', icon: 'orders', nav: null, roles: ['dealer-owner'] };

// Spec: confirm delivery, reject (reason), report issue (product, serial, description, photos).
export function render({ data }) {
  const o = data.order;
  const products = o.lines.map((l) => `${l.product} ${l.variant} ${l.colour}`);
  return `
    ${pageHead(`Shipment ${o.id}`, button('Confirm delivery', { action: 'confirm-delivery', primary: true }))}
    <div class="card kv">
      <div><span>Shipment status</span>${badge(o.shipment.status, statusTone(o.shipment.status))}</div>
    </div>
    <div class="card">
      <h2>Reject shipment</h2>
      <label class="field"><span>Reason *</span><textarea data-toast="Reason would be sent with the rejection."></textarea></label>
      <div class="page-actions" style="margin-top:12px">${button('Reject', { action: 'reject-shipment' })}</div>
    </div>
    <div class="card">
      <h2>Report issue</h2>
      ${select('Product', products, products[0], { toast: 'Product would be chosen for the issue.' })}
      ${input('Serial / Chassis No', '', { toast: 'Serial / Chassis No would be saved with the issue.' })}
      <label class="field"><span>What is the issue? *</span><textarea data-toast="The issue description would be saved."></textarea></label>
      <label class="field"><span>Photos or videos</span><input type="file" multiple accept="image/*,video/*" data-toast="Photos or videos would be attached to the issue."></label>
      <div class="page-actions" style="margin-top:12px">${button('Submit & confirm', { action: 'submit-issue' })}</div>
    </div>`;
}
