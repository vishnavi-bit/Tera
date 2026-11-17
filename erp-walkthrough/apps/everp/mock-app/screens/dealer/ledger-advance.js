import { pageHead, inr, esc } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'D34', name: 'Ledger Advance', side: 'dealer', icon: 'payments', nav: 'Payments', roles: ['dealer-owner'] };

export function render({ data }) {
  const o = data.order;
  const l = data.ledger;
  const paid = o.advanceStatus !== 'Awaiting advance';
  return `
    ${pageHead('Ledger Advance', button('pay from ledger', { action: 'pay-from-ledger', primary: true }))}
    <div class="card">
      <h2>Approved orders awaiting advance</h2>
      <label class="row"><input type="checkbox" checked data-toast="Selecting an order would add its advance to the amount paid from the ledger."> ${esc(o.id)} · total ${inr(o.total)} · advance (${esc(o.advancePercent)}%) ${inr(o.advanceDue)}</label>
    </div>
    <div class="card kv">
      <div><span>Ledger balance</span><strong>${inr(l.balance)}</strong></div>
      <div><span>Selected advance</span><strong>${inr(o.advanceDue)}</strong></div>
      <div><span>Balance after</span><strong>${inr(paid ? l.balance : l.afterAdvance)}</strong></div>
    </div>
    <p class="note">The spec shows ledger balance, selected advance and balance after. It does not say whether the OEM verifies a ledger payment (see gap list).</p>`;
}
