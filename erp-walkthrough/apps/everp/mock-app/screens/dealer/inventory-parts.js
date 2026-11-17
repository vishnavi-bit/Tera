import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { input } from '../../shared/form.js?v=5';

export const meta = { code: 'D25', name: 'Inventory: Parts', side: 'dealer', icon: 'inventory', nav: 'Inventory', roles: ['dealer-sales', 'dealer-owner'] };

const TABS = ['spare-parts', 'accessory', 'battery', 'charger', 'motor', 'controller'];

export function render({ data }) {
  const tabs = TABS.map((t) => `<button class="tab${t === 'spare-parts' ? ' active' : ''}" data-toast="${esc(t)} would show the dealer's ${esc(t)} stock.">${esc(t)}</button>`).join('');
  return `
    ${pageHead('Inventory: Parts')}
    <div class="tabs">${tabs}</div>
    <div class="card row">${input('Search', '', { placeholder: 'Search', toast: 'Search would filter the parts.' })}</div>
    ${table(['Name', 'Part code', 'Quantity'], data.stock.parts.map((p) => [esc(p.name), esc(p.code), p.qty]))}
    <p class="note">The spec gives no column list for this screen (see gap list).</p>`;
}
