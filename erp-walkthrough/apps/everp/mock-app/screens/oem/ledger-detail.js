import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { input, select, button } from '../../shared/form.js?v=5';

export const meta = { code: 'O47', name: 'Ledger Detail', side: 'oem', icon: 'book', nav: 'Ledger detail', roles: ['oem-super-admin'] };

export function render({ data }) {
  const l = data.ledgers.ledger;
  const c = data.ledgers.addCredit;
  return `
    ${pageHead(l.name, `
      ${button('edit', { toast: 'edit would save the ledger name and note.' })}
      ${button('add credit', { action: 'add-credit', primary: true })}
      ${button('add debit', { toast: 'add debit would take an amount out of this ledger.' })}
      ${button('connect / remove dealer', { toast: 'connect / remove dealer would change the dealers connected to this ledger.' })}`)}
    <div class="card row">
      <h2>Edit</h2>
      ${input('Name', l.name, { required: true, toast: 'Name would be saved for this ledger.' })}
      <label class="field"><span>Note</span><textarea data-toast="Note would be saved for this ledger.">${esc(l.note)}</textarea></label>
    </div>
    <div class="card row">
      <h2>Add credit</h2>
      ${input('Amount', c.amount, { required: true, type: 'number', toast: 'Amount would be added to this ledger as a credit.' })}
      <label class="field"><span>Note</span><textarea data-toast="Note would be saved with the credit.">${esc(c.note)}</textarea></label>
      <label class="field"><span>Supporting document</span><input type="file" accept=".pdf,image/*,.doc,.docx" data-toast="Supporting document would be attached (PDF, image or doc, up to 25 MB)."></label>
      <p class="note">Every connected dealer can spend what you add.</p>
    </div>
    <div class="card row">
      <h2>Add debit</h2>
      ${input('Amount', '', { type: 'number', toast: 'Amount would be taken out of this ledger as a debit.' })}
      <label class="field"><span>Note</span><textarea data-toast="Note would be saved with the debit."></textarea></label>
      <label class="field"><span>Document</span><input type="file" accept=".pdf,image/*,.doc,.docx" data-toast="Document would be attached to the debit."></label>
    </div>
    <div class="card row">
      <h2>Connect / remove dealer</h2>
      ${select('Dealer', [], '', { required: true, toast: 'Dealer would be connected to or removed from this ledger.' })}
    </div>
    <div class="card">
      <h2>Open purchase orders</h2>
      ${table(['Order', 'Dealer', 'Status', 'Ledger used'], [])}
      <p class="note">No open purchase orders.</p>
    </div>
    <div class="card">
      <h2>Connected dealers</h2>
      <p class="note">No dealers connected.</p>
    </div>
    <div class="card">
      <h2>History</h2>
      ${table(
        ['Type', 'Date', 'Dealer', 'User', 'Reference', '± Amount', 'Balance after'],
        data.ledgers.history.map((h) => [esc(h.type), esc(h.date), esc(h.dealer), esc(h.user), esc(h.reference), esc(h.amount), esc(h.balanceAfter)])
      )}
    </div>`;
}
