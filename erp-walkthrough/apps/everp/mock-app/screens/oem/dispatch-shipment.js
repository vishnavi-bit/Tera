import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { button, input, radios, select } from '../../shared/form.js?v=5';

export const meta = { code: 'O22', name: 'Dispatch Shipment', side: 'oem', icon: 'orders', nav: null, roles: ['oem-logistics-mgr'] };

// Spec: dispatch from MU, quantities per line, transport details, dispatch (n units), dispatch all remaining.
// Courier fields are not shown because the transport options here are By Truck and By Parcel.
export function render({ data }) {
  const o = data.order;
  const s = o.shipment;
  const rows = o.lines.map((l) => [
    esc(l.product), esc(l.variant), esc(l.colour),
    l.qty, s.shipped,
    l.qty - s.shipped,
    `<input type="number" value="${l.qty - s.shipped}" data-toast="Ship now would set the quantity for this line.">`
  ]);
  return `
    ${pageHead('Dispatch Shipment', `
      ${button('Dispatch all remaining', { toast: 'Dispatch all remaining would fill every line with its remaining quantity.' })}
      ${button(`Dispatch (${o.qty} units)`, { action: 'dispatch', primary: true })}`)}
    <div class="card row">
      ${select('Dispatch from Manufacturing Unit', [data.mu.name], data.mu.name, { toast: 'Manufacturing Unit would be chosen for this dispatch.' })}
    </div>
    ${table(['Product', 'Variant', 'Colour', 'Approved', 'Shipped', 'Remaining', 'Ship now'], rows)}
    <div class="card" style="margin-top:14px">
      ${radios('Transport Type', 'transport-type', ['By Truck', 'By Parcel'], s.transportType, { toast: 'Transport type would be changed.' })}
      <div class="row" style="margin-top:12px">
        ${input('Transport Company Name', s.companyName, { toast: 'Transport Company Name would be saved.' })}
        ${input('Company Number', s.companyNumber, { toast: 'Company Number would be saved.' })}
        ${input('Tracking ID', s.trackingId, { toast: 'Tracking ID would be saved.' })}
        ${input('Driver Number', s.driverNumber, { toast: 'Driver Number would be saved.' })}
        ${input('Vehicle No', s.vehicleNo, { toast: 'Vehicle No would be saved.' })}
        ${input('Transport Date', s.transportDate, { type: 'date', toast: 'Transport Date would be saved.' })}
        ${input('Expected Dispatch / Delivery Date', s.deliveryDate, { type: 'date', toast: 'Expected Dispatch / Delivery Date would be saved.' })}
        ${select('Payment Status', ['Paid', 'Unpaid'], s.paymentStatus, { toast: 'Payment Status would be saved.' })}
      </div>
    </div>`;
}
