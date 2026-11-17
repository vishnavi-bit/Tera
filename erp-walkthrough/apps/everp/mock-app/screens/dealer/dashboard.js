import { pageHead, esc } from '../../shared/components.js?v=5';

export const meta = { code: 'D04', name: 'Dashboard', side: 'dealer', icon: 'dashboard', nav: 'Dashboard', roles: ['dealer-owner'] };

// Aggregates from screen_details.md (D04). Their values and drill targets are not defined.
const TILES = ['invoices', 'POs', 'service', 'warranty', 'follow-ups'];

export function render({ data }) {
  const d = data.newDealer;
  const tiles = TILES.map(
    (t) => `<button class="card" style="margin:0;text-align:left" data-not-defined="${esc(
      `The value and drill link for '${t}' are not defined in screen_details.md (D04).`
    )}"><span class="note">${esc(t)}</span><div>Not defined</div></button>`
  ).join('');

  return `
    ${pageHead('Dashboard')}
    <p class="note">${esc(d.firm)}</p>
    <div class="card row">
      <label class="field"><span>Period</span><select data-not-defined="The period filter options are not defined in screen_details.md (D04)."></select></label>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">${tiles}</div>`;
}
