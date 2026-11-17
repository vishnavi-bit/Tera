import { pageHead, table, badge, statusTone, esc } from '../../shared/components.js?v=5';
import { button, input, select } from '../../shared/form.js?v=5';

export const meta = { code: 'D24', name: 'Inventory: Vehicle Models', side: 'dealer', icon: 'inventory', nav: 'Inventory', roles: ['dealer-sales', 'dealer-owner'] };

export function render({ data }) {
  const rows = data.stock.vehicles.map((v) => [esc(v.model), esc(v.variant), esc(v.colour), esc(v.chassis), badge(v.status, v.status === 'Available' ? 'good' : 'neutral')]);
  return `
    ${pageHead('Inventory: Vehicle Models', button('parts', { action: 'open-parts', goto: 'D25' }))}
    <div class="card row">
      ${select('Show', ['available', 'sold'], 'available', { toast: 'Available / sold would filter the list.' })}
      ${input('Search', '', { placeholder: 'Search', toast: 'Search would filter the vehicles.' })}
    </div>
    ${table(['Model', 'Variant', 'Colour', 'Chassis', 'Status'], rows)}
    <p class="note">Spec: available / sold filter and search. Opening a row goes to /inventory/vehicle/:id (no screen of its own in the spec). The spec gives no column list, and the "parts" link is added so the tour can reach D25 (see gap list).</p>`;
}
