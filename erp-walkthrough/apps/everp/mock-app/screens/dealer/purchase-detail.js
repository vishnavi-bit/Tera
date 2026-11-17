import { inr, pageHead, field, badge, statusTone, esc } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'D30', name: 'PO Detail', side: 'dealer', icon: 'orders', nav: null, roles: ['dealer-owner'] };

// Spec: PO detail with actions pay, confirm / accept delivery, reject shipment, report issue and print.
// The Dispatch tab is shown as a section: the spec names no tabs (see gap list).
export function render({ data }) {
  const o = data.order;
  const s = o.shipment;
  const dispatch = s.status === 'Not dispatched'
    ? '<p class="note">Not dispatched yet.</p>'
    : `<div class="card kv">
        <div><span>Transport type</span><strong>${esc(s.transportType)}</strong></div>
        <div><span>Transport company name</span><strong>${esc(s.companyName)}</strong></div>
        <div><span>Company number</span><strong>${esc(s.companyNumber)}</strong></div>
        <div><span>Tracking ID</span><strong>${esc(s.trackingId)}</strong></div>
        <div><span>Driver number</span><strong>${esc(s.driverNumber)}</strong></div>
        <div><span>Vehicle no</span><strong>${esc(s.vehicleNo)}</strong></div>
        <div><span>Transport date</span><strong>${esc(s.transportDate)}</strong></div>
        <div><span>Expected delivery date</span><strong>${esc(s.deliveryDate)}</strong></div>
        <div><span>Payment status</span><strong>${esc(s.paymentStatus)}</strong></div>
        <div><span>Shipment status</span>${badge(s.status, statusTone(s.status))}</div>
      </div>`;
  return `
    ${pageHead(`PO ${o.id}`, `
      ${button('Pay', { toast: 'Pay would open PO Payment (D31) for this order.' })}
      ${button('Confirm / accept delivery', { action: 'accept-delivery', primary: true })}
      ${button('Reject shipment', { toast: 'Reject shipment would ask for a reason and send the shipment back for re-dispatch (D32).' })}
      ${button('Report issue', { action: 'report-issue' })}
      ${button('Print quotation', { toast: 'Print quotation would print the quotation for this order.' })}
      ${button('Print invoice', { toast: 'Print invoice would print the invoice for this order.' })}
      ${button('Print checklist', { toast: 'Print checklist would print the checklist for this order.' })}`)}
    <div class="card kv">
      <div><span>Dealer</span><strong>${esc(data.dealer.name)}</strong></div>
      <div><span>Manufacturing unit</span><strong>${esc(data.mu.name)}</strong></div>
      <div><span>Total quantity</span><strong>${o.qty}</strong></div>
      <div><span>Total (excl. GST)</span><strong>${inr(o.total)}</strong></div>
      <div><span>Status</span>${badge(o.status, statusTone(o.status))}</div>
    </div>
    <h2>Dispatch</h2>
    ${dispatch}`;
}
