import { pageHead, table, badge, statusTone, esc } from '../../shared/components.js?v=5';
import { button, input, select } from '../../shared/form.js?v=5';

export const meta = { code: 'O30', name: 'Inventory (OEM Stock)', side: 'oem', icon: 'inventory', nav: 'Inventory', roles: ['oem-inventory-mgr'] };

// Spec: 9 tabs (only stock history and reserved stock are named), unit / stock filter, search.
// The seven unnamed tabs show "Not defined". Reserved stock by dealer is OEM-only (F6). R6: Charan sees all units.
export function render({ data }) {
  const rows = data.stock.items.map((i) => [esc(i.product), i.quantity, badge(i.status, statusTone(i.status))]);
  const named = ['Stock history', 'Reserved stock'];
  const tabs = [
    ...named.map((t, i) => (i === 0
      ? `<span class="tab active">${esc(t)}</span>`
      : `<span class="tab" data-toast="${esc(t)} would show the reserved stock by dealer (OEM only).">${esc(t)}</span>`)),
    ...Array.from({ length: 7 }, () => '<span class="tab" data-not-defined="This tab name and content are not defined in screen_details.md.">Not defined</span>')
  ].join('');
  return `
    ${pageHead('Inventory')}
    <div class="card row">
      ${select('Unit', [data.mu.name], data.mu.name, { toast: 'Unit would filter the stock by manufacturing unit.' })}
      ${select('Stock', [], undefined, { notDefined: 'The stock filter values are not defined in screen_details.md.' })}
      ${input('Search', '', { placeholder: 'Search', toast: 'Search would find a product in the stock.' })}
    </div>
    <div class="tabs">${tabs}</div>
    ${table(['Product', 'Quantity', 'Status'], rows)}`;
}
