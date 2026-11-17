import { pageHead, field, esc } from '../../shared/components.js?v=5';
import { button, input } from '../../shared/form.js?v=5';

export const meta = { code: 'D18', name: 'Customer Products', side: 'dealer', icon: 'customers', nav: 'Customers', roles: ['dealer-service', 'dealer-owner'] };

const TABS = ['vehicle', 'motor', 'battery', 'charger', 'controller', 'spare & accessory'];

export function render({ data }) {
  const v = data.vehicle;
  const tabs = TABS.map((t) =>
    t === 'vehicle'
      ? `<button class="tab active" data-action="open-vehicle-tab">${esc(t)}</button>`
      : `<button class="tab" data-toast="${esc(t)} would show the customer's ${esc(t)} products.">${esc(t)}</button>`
  ).join('');

  return `
    ${pageHead(data.customer.name)}
    <div class="tabs">${tabs}</div>
    <div class="card row">
      <input placeholder="chassis number" data-toast="search chassis would find the product by chassis number.">
      ${button('search chassis', { toast: 'search chassis would find the product by chassis number.' })}
    </div>
    <div class="card row">
      ${field('Chassis', v.chassis)}
      ${input('Registration Number', v.regNumber, { required: true, toast: 'Registration Number would be saved.' })}
      ${button('update registration no.', { toast: 'update registration no. would save the registration number.' })}
    </div>`;
}
