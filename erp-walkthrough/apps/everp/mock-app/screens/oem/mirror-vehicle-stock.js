import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { button, input, select } from '../../shared/form.js?v=5';

export const meta = { code: 'O10', name: 'Dealer → Vehicle Stock + Add Stock', side: 'oem', icon: 'inventory', nav: 'Dealers', roles: ['oem-super-admin'] };

// Spec: type tabs, button "add stock to dealer". Dialog fields: Product type, Product, Quantity.
// The spec gives no effect and no submit control for the dialog, so the walkthrough shows the "Not defined" alert on the step.
const PRODUCT_TYPES = ['Vehicle', 'Spare', 'Accessory', 'Battery', 'Charger', 'Motor', 'Controller'];

export function render({ data }) {
  const v = data.stock.vehicles;
  const tabs = PRODUCT_TYPES.map((t, i) => (i === 0
    ? `<span class="tab active">${esc(t)}</span>`
    : `<span class="tab" data-toast="${esc(t)} stock would be listed under its own tab.">${esc(t)}</span>`)).join('');
  const rows = v.map((x) => [esc(x.model), esc(x.variant), esc(x.colour), esc(x.chassis), esc(x.status)]);
  return `
    ${pageHead('Vehicle Stock', button('add stock to dealer', { toast: 'add stock to dealer would open the Add stock dialog below.' }))}
    <p class="note">Dealer: ${esc(data.dealer.name)}. Available: ${data.stock.available}</p>
    <div class="tabs">${tabs}</div>
    ${table(['Model', 'Variant', 'Colour', 'Chassis', 'Status'], rows)}
    <div class="card" style="margin-top:14px">
      <h2>Add stock to dealer</h2>
      ${select('Product type', PRODUCT_TYPES, 'Vehicle', { required: true, toast: 'Product type would be chosen for the stock to add.' })}
      ${select('Product', [], undefined, { required: true, notDefined: 'The spec gives no options for Product in the add stock dialog.' })}
      ${input('Quantity', '', { type: 'number', required: true, toast: 'Quantity would be saved to the add stock request.' })}
    </div>`;
}
