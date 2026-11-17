import { pageHead, table, inr, esc } from '../../shared/components.js?v=5';

export const meta = { code: 'D33', name: 'Payment Ledger', side: 'dealer', icon: 'payments', nav: 'Payments', roles: ['dealer-owner'] };

// Spec: view only. The dealer sees only the ledger(s) it is attached to (R3).
export function render({ data }) {
  const l = data.ledger;
  return `
    ${pageHead('Payment Ledger')}
    ${table(['Ledger', 'Connected dealers', 'Balance'], [[esc(l.name), esc(l.members.join(', ')), inr(l.balance)]])}
    <p class="note">The spec says only "view only", and that a dealer sees the balance of the ledger(s) it is attached to (R3). The columns are the walkthrough's own (see gap list).</p>`;
}
