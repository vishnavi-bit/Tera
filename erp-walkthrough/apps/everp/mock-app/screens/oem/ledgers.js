import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { input, button } from '../../shared/form.js?v=5';

export const meta = { code: 'O46', name: 'Ledgers', side: 'oem', icon: 'book', nav: 'Ledgers', roles: ['oem-super-admin'] };

export function render({ data }) {
  const l = data.ledgers.ledger;
  return `
    ${pageHead('Ledgers', `
      ${button('new ledger', { action: 'new-ledger', primary: true })}
      ${button('search', { toast: 'search would find a ledger by name.' })}`)}
    <p class="note">Ledgers: ${data.ledgers.count}</p>
    ${table(['Name', 'Members', 'Balance', 'Tally'], [])}
    <div class="card row">
      ${input('Name', l.name, { required: true, toast: 'Name would be saved as the ledger name.' })}
      <label class="field"><span>Note</span><textarea data-toast="Note would be saved.">${esc(l.note)}</textarea></label>
    </div>`;
}
