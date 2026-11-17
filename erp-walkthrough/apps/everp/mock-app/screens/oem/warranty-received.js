import { pageHead, table, badge, esc } from '../../shared/components.js?v=5';

export const meta = { code: 'O43', name: 'Warranty (Received)', side: 'oem', icon: 'shield', nav: 'Warranty', roles: ['oem-super-admin'] };

// Only the claims raised to the OEM are in this queue. The status filter options are not defined.
export function render({ data }) {
  const c = data.claim;
  const rows = [[`<button class="link" data-action="open-claim">${esc(c.id)}</button>`, esc(data.dealer.name), esc(c.raisedTo), badge(c.status, 'warn')]];

  return `
    ${pageHead('Warranty (Received)')}
    <div class="card row">
      <label class="field"><span>status</span><select data-not-defined="The status filter options are not defined in screen_details.md."><option>All</option></select></label>
    </div>
    ${table(['Claim ID', 'Dealer', 'Raised to', 'Status'], rows)}`;
}
