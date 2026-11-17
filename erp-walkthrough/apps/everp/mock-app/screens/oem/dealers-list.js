import { badge, pageHead, table, esc } from '../../shared/components.js?v=5';
import { button, select } from '../../shared/form.js?v=5';

export const meta = { code: 'O04', name: 'Dealers List + Map', side: 'oem', icon: 'store', nav: 'Dealers', roles: ['oem-super-admin'] };

const TYPES = ['Distributor', 'Divisional Distributor', 'District Dealer', 'Area Dealer'];

// The new dealer's firm opens its detail (O06). Existing rows only show edit and unlock.
function row(r, { opens = false } = {}) {
  const firm = opens ? `<button class="link" data-goto="O06">${esc(r.firm)}</button>` : esc(r.firm);
  const unlock = r.status === 'Suspended' ? button('unlock', { toast: 'unlock would unlock this dealer account.' }) : '';
  return [
    esc(r.id),
    firm,
    esc(r.type),
    esc(r.state),
    esc(r.district),
    badge(r.status, r.status === 'Active' ? 'good' : 'bad'),
    `${button('edit', { toast: 'edit would open Add / Edit Dealer (O05) for this dealer.' })} ${unlock}`
  ];
}

export function render({ data }) {
  const L = data.lists;
  const d = data.newDealer;
  const rows = data.dealers.list.map((r) => row(r));
  if (d.created) rows.push(row({ id: d.id, firm: d.firm, type: d.dealerType, state: d.state, district: d.district, status: d.status }, { opens: true }));
  const districts = Object.values(L.districts).flat();

  return `
    ${pageHead('Dealers', button('add', { action: 'add-dealer', goto: 'O05', primary: true }))}
    <p class="note">Dealers: ${data.dealers.count}</p>
    <div class="card row">
      <div class="page-actions">
        ${button('active', { toast: 'active would show only active dealers.' })}
        ${button('inactive', { toast: 'inactive would show only inactive dealers.' })}
        ${button('map', { toast: 'map would show the dealers on a map.' })}
      </div>
      ${select('type', ['All', ...TYPES], 'All', { toast: 'type would filter the list by dealer type.' })}
      ${select('state', ['All', ...L.states], 'All', { toast: 'state would filter the list by state.' })}
      ${select('district', ['All', ...districts], 'All', { toast: 'district would filter the list by district.' })}
    </div>
    ${table(['Dealer ID', 'Firm', 'User type', 'State', 'District', 'Status', ''], rows)}`;
}
