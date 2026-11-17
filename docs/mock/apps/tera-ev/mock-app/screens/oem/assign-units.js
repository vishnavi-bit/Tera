import { pageHead, esc } from '../../shared/components.js?v=1';
import { select, input, button } from '../../shared/form.js?v=1';

export const meta = { code: 'S04', name: 'Assign units to dealer order', side: 'oem', icon: 'parcel', nav: 'Dispatch', roles: ['oem-logistics'] };

export function render({ data }) {
  const a = data.assign;
  const paid = data.payment.status === 'Verified';
  return `
    ${pageHead(`Orders > ${esc(data.order.id)} > Assign`)}
    <div class="card">
      <div class="row">
        ${select('Unit', [a.unit], a.unit, { toast: 'Unit would be picked for the assignment.' })}
        ${select('Model', [a.model], a.model, { toast: 'Model would be picked for the assignment.' })}
        ${select('Variant', [a.variant], a.variant, { toast: 'Variant would be picked for the assignment.' })}
        ${select('Colour', [a.colour], a.colour, { toast: 'Colour would be picked for the assignment.' })}
      </div>
      ${input('Chassis numbers', '', { placeholder: 'Chassis number(s)', toast: 'Chassis numbers would be checked against the record.' })}
      <label class="field"><span>Qty *</span><input type="number" value="${a.qty}" data-toast="Quantity would change the assignment."></label>
      <p>Reserved: ${data.stock.reserved} units (order 30% paid: ${paid ? 'yes' : 'no'})</p>
      <p class="note">Only QC-passed units can be assigned: ${a.qcPassed} of ${a.qty} passed QC.</p>
      <div class="page-actions">${button('Assign', { action: 'assign-units', primary: true })}</div>
    </div>`;
}
