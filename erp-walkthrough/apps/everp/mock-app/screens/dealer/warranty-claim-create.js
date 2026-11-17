import { pageHead, field, esc } from '../../shared/components.js?v=5';
import { button, input, select, radios } from '../../shared/form.js?v=5';

export const meta = { code: 'D38', name: 'Warranty Claim Create', side: 'dealer', icon: 'shield', nav: 'Warranty', roles: ['dealer-service', 'dealer-owner'] };

const SPARE_TYPES = ['Battery', 'Controller', 'Motor', 'Charger'];
const ISSUES = ['Not Working', 'Run Very slow', 'Other'];

export function render({ data }) {
  const c = data.claim;
  const v = data.vehicle;
  const p = data.product;
  // Only paid vehicle invoices are offered. The walkthrough has one: the sample vehicle.
  const vehicleOption = `${p.name} (${p.variant}) · ${v.chassis} · ${p.colour}`;
  const serials = c.serials.map((s) => `<label><input type="checkbox" checked data-toast="Serial ${esc(s)} would be selected for this claim."> ${esc(s)}</label>`).join('');

  return `
    ${pageHead('Warranty Claim Create', button('claim warranty', { action: 'claim-warranty', primary: true }))}
    <div class="card row">
      ${radios('Raised to', 'raisedTo', ['OEM', 'Dealer (service team)'], c.raisedTo, { required: true })}
      ${radios('Product type', 'productType', ['Vehicle', 'Warranty products'], 'Vehicle', { required: true })}
      ${field('Customer Name', data.customer.name)}
      ${select('Select Vehicle', [vehicleOption], vehicleOption, { required: true })}
      ${field('Chassis', v.chassis)}
      ${field('Variant', p.variant)}
      ${field('Colour', p.colour)}
      ${field('Motor no', v.motor)}
      ${field('Controller no', v.controller)}
      ${field('Charger no', v.charger)}
      ${field('Battery no(s)', v.batteries.join(', '))}
    </div>
    <div class="card row">
      ${select('Select Spare', SPARE_TYPES, c.spare, { required: true })}
      <fieldset class="field"><legend><span>Select serial number(s) *</span></legend><div class="row">${serials}</div></fieldset>
      ${select('Issue', ISSUES, c.issue, { required: true })}
      ${field('Still Warranty', c.stillWarrantyUntil)}
      <label class="field"><span>Remarks *</span><textarea data-toast="Remarks would be saved.">${esc(c.remarks)}</textarea></label>
      <label class="field"><span>Claim images</span><input type="file" accept="image/*" multiple data-toast="Claim images would be attached (up to 10, 5 MB each)."></label>
    </div>
    <div class="card row">
      <label class="field"><span>Search</span><input placeholder="name, part code, type, invoice #" data-toast="Search would find warranty products by name, part code, type or invoice number."></label>
    </div>`;
}
