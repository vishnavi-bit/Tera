import { pageHead, esc } from '../../shared/components.js?v=5';
import { input, select, button } from '../../shared/form.js?v=5';

export const meta = { code: 'O26', name: 'Product Create / Edit: Vehicle', side: 'oem', icon: 'products', nav: 'Vehicle', roles: ['oem-super-admin'] };

const TYPES = ['2 Wheeler', '3 Wheeler', '4 Wheeler'];
const PRICES = [
  ['Price: Distributor', 'distributor'],
  ['Price: Divisional Distributor', 'divisionalDistributor'],
  ['Price: District Dealer', 'districtDealer'],
  ['Price: Area Dealer', 'areaDealer'],
  ['Price: Customer Price', 'customer']
];

export function render({ data }) {
  const v = data.products.vehicle;
  const m = data.products.motor;
  const L = data.lists;
  const motors = m.created ? [m.name] : [];
  return `
    ${pageHead('Product Create / Edit: Vehicle', `
      ${button('add colour', { toast: 'add colour would add another Colour row.' })}
      ${button('add variant', { toast: 'add variant would add another Variant row.' })}
      ${button('add spec', { toast: 'add spec would add another Technical Specs row.' })}
      ${button('create', { action: 'create-vehicle', primary: true })}`)}
    <div class="card row">
      ${input('Vehicle Model', v.productName, { required: true })}
      ${select('Type', TYPES, v.wheels, { required: true })}
      ${select('Motor', ['None', ...motors], m.created ? m.name : 'None')}
      ${select('Controller', ['None', ...L.controllers], v.controller)}
      ${select('Registration', ['Yes', 'No'], v.isRegistrationVehicle, { required: true })}
      ${input('HSN No', v.HSN, { required: true })}
      ${input('CGST (%)', v.cgst, { required: true })}
      ${input('SGST (%)', v.sgst, { required: true })}
      <label class="field"><span>Product Image</span><input type="file" accept="image/*" data-toast="Product Image would be attached (240×240 preferred, up to 5 MB)."></label>
    </div>
    <div class="card">
      ${v.colours
        .map(
          (c) => `<div class="field"><span>Colour: Name + Code (repeat)</span><div class="row">
            <input value="${esc(c.name)}" data-toast="Colour name would be saved.">
            <input type="color" value="${esc(c.code)}" data-toast="Colour code would be saved.">
          </div></div>`
        )
        .join('')}
    </div>
    <div class="card row">
      ${input('Variant (repeat): Name', v.variantName, { required: true })}
      <label><input type="checkbox" data-toast="Without Battery &amp; Charger (WBC) would be saved for this vehicle."> Without Battery &amp; Charger (WBC)</label>
      ${select('Charger', ['None', ...L.chargers], v.charger)}
      ${select('Battery', ['None', ...L.batteries], v.battery)}
      ${input('Battery Qty', v.batteryQuantity, { type: 'number' })}
    </div>
    <div class="card row">
      ${PRICES.map(([label, key]) => input(label, v.prices[key], { required: true })).join('')}
    </div>
    <div class="card">
      <div class="field"><span>Technical Specs (+ Add Field)</span></div>
      ${v.specs
        .map((s) => `<div class="row"><input value="${esc(s.key)}" data-toast="Spec key would be saved."><input value="${esc(s.value)}" data-toast="Spec value would be saved."></div>`)
        .join('')}
    </div>
    <div class="card row">
      <div class="field"><span>Available from: per MU</span>
        ${L.mus.map((mu) => `<label><input type="checkbox" checked data-toast="Available from ${esc(mu)} would be saved."> ${esc(mu)}</label>`).join(' ')}
      </div>
      <div class="field"><span>Purchase limit</span>
        <label><input type="checkbox" data-toast="Purchase limit would be saved."> Purchase limit</label>
        <button class="btn" data-not-defined="The dealer types and the share of stock for Purchase limit are not defined in screen_details.md (O26).">dealer types / share</button>
      </div>
    </div>`;
}
