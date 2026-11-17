import { pageHead, table, badge, statusTone, esc } from '../../shared/components.js?v=5';
import { button, select } from '../../shared/form.js?v=5';

export const meta = { code: 'O25', name: 'Products List', side: 'oem', icon: 'products', nav: 'Products', roles: ['oem-super-admin'] };

// Spec: status filter, add, edit, delete, and 7 product-type tabs (vehicle, spare, accessory, battery, charger, motor, controller).
// Roles: ADM (assumption: Super Admin). No column list is defined; Vehicle, Variant, Colour and Status are used (see gap list).
const TYPES = ['Vehicle', 'Spare', 'Accessory', 'Battery', 'Charger', 'Motor', 'Controller'];

export function render({ data }) {
  const rows = data.productRows
    .filter((r) => r.type === 'Vehicle')
    .map((r) => [
      esc(r.vehicle), esc(r.variant), esc(r.colour),
      badge(r.status, statusTone(r.status)),
      `${button('edit', { toast: `edit would open ${esc(r.vehicle)} for editing.` })} ${button('delete', { toast: `delete would remove ${esc(r.vehicle)} from the products list.` })}`
    ]);
  const tabs = TYPES.map((t, i) => (i === 0
    ? `<span class="tab active">${esc(t)}</span>`
    : `<span class="tab" data-toast="${esc(t)} products would be listed under their own tab.">${esc(t)}</span>`)).join('');
  return `
    ${pageHead('Products List', button('add', { toast: 'add would open the product create form for the chosen product type.' }))}
    <div class="card row">
      ${select('Status', [], undefined, { notDefined: 'The status filter values are not defined in screen_details.md.' })}
    </div>
    <div class="tabs">${tabs}</div>
    ${table(['Vehicle', 'Variant', 'Colour', 'Status', 'Action'], rows)}`;
}
