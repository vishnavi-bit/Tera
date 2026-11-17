import { inr, table, pageHead, esc, badge, statusTone } from '../../shared/components.js?v=5';
import { button, input } from '../../shared/form.js?v=5';

export const meta = { code: 'O20', name: 'Order Detail', side: 'oem', icon: 'orders', nav: 'Orders', roles: ['oem-sales-head'] };

// Spec: approve / reject, create quotation, edit items, assign, dispatch shipment, verify / reject payment,
// info note, expected dispatch date, revert cancel, print. The spec names no tabs (see gap list).
export function render({ data }) {
  const o = data.order;
  const rows = o.lines.map((l) => [
    esc(l.product), esc(l.variant), esc(l.colour),
    `<input type="number" value="${l.qty}" data-toast="Approved qty would be saved.">`,
    `${l.inStock} in stock`, inr(l.price), inr(l.qty * l.price)
  ]);
  return `
    ${pageHead(`Order ${o.id}`, `
      ${button('Create Quotation', { toast: 'Create Quotation would open the quotation form for the seller tier.' })}
      ${button('Edit items', { toast: 'Edit items would change the approved quantities and properties.' })}
      ${button('Assign', { toast: 'Assign would open Assign Item (O21) for this order.' })}
      ${button('Dispatch shipment', { toast: 'Dispatch shipment would open Dispatch Shipment (O22).' })}
      ${button('Verify / reject payment', { toast: 'Verify / reject payment would open Payment Verify (O23).' })}
      ${button('Revert cancel', { toast: 'Revert cancel would restore a cancelled order.' })}
      ${button('Print', { toast: 'Print would print this order.' })}
      ${button('Reject', { action: 'reject-order', primary: false })}
      ${button('Approve', { action: 'approve-order', primary: true })}`)}
    <div class="card kv">
      <div><span>Dealer</span><strong>${esc(data.dealer.name)}</strong></div>
      <div><span>Manufacturing unit</span><strong>${esc(data.dealer.mu)}</strong></div>
      <div><span>Total quantity</span><strong>${o.qty}</strong></div>
      <div><span>Status</span>${badge(o.status, statusTone(o.status))}</div>
    </div>
    ${table(['Product', 'Variant', 'Colour', 'Approved qty', 'Stock at MU', 'Price', 'Line total'], rows)}
    <div class="card row" style="margin-top:14px">
      <label class="field"><span>Add PO info note</span><textarea data-toast="Add PO info note would save an internal note, visible to OEM staff only."></textarea></label>
      ${input('Expected dispatch date', o.expectedDispatch, { type: 'date', toast: 'Expected dispatch date would be saved and the dealer notified.' })}
    </div>`;
}
