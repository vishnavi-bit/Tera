import { pageHead, esc } from '../../shared/components.js?v=5';
import { input, select } from '../../shared/form.js?v=5';

export const meta = { code: 'O03', name: 'Dashboard', side: 'oem', icon: 'dashboard', nav: 'Dashboard', roles: ['oem-super-admin'] };

// KPI names from screen_details.md (O03). Only "no. of dealers" has sample data in this walkthrough.
const KPIS = [
  'no. of dealers', 'vehicles sold', 'vehicle stock', 'pending orders', 'PO by model',
  'vehicle sales', 'warranty', 'top warranty dealers', 'top selling vehicle', 'top dealers by purchases'
];

export function render({ data }) {
  const L = data.lists;
  const tiles = KPIS.map((name) =>
    name === 'no. of dealers'
      ? `<div class="card" style="margin:0"><span class="note">${esc(name)}</span><div><strong>${data.dealers.count}</strong></div></div>`
      : `<button class="card" style="margin:0;text-align:left" data-not-defined="${esc(
          `The value and layout of the KPI '${name}' are not defined in screen_details.md (O03).`
        )}"><span class="note">${esc(name)}</span><div>Not defined</div></button>`
  ).join('');

  return `
    ${pageHead('Dashboard')}
    <div class="card row">
      ${select('Period', ['This Day', 'This Month', 'This Year', 'Custom Date'], 'This Day', {
        toast: 'Period would change the dashboard figures.'
      })}
      ${select('State', ['All States', ...L.states], 'All States', { toast: 'State would filter the dashboard figures.' })}
      ${select('Unit', ['All units', ...L.mus], 'All units', { toast: 'Unit would filter the figures to that manufacturing unit.' })}
      ${input('Edit (slogan)', '', { toast: 'Dashboard slogan would be saved.' })}
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">${tiles}</div>`;
}
