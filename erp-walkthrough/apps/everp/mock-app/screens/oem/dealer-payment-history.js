import { pageHead, table, inr, esc } from '../../shared/components.js?v=5';

export const meta = { code: 'O14', name: 'Dealer → Payment History', side: 'oem', icon: 'payments', nav: 'Payments', roles: ['oem-accounts'] };

// Spec: read only. Shows the PO credit balance and totals.
export function render({ data }) {
  const rows = data.history.map((h) => [esc(h.type), esc(h.date), esc(h.reference), inr(h.amount), inr(h.balanceAfter)]);
  if (data.topup.status === 'Verified') rows.push([esc(data.topupHistory.type), esc(data.topup.date), esc(data.topupHistory.reference), inr(data.topup.amount), inr(data.topupHistory.balanceAfter)]);
  if (data.order.advanceStatus !== 'Awaiting advance') rows.push([esc(data.advanceHistory.type), esc(data.topup.date), esc(data.advanceHistory.reference), inr(data.order.advanceDue), inr(data.advanceHistory.balanceAfter)]);
  return `
    ${pageHead(`Payment History: ${data.dealer.name}`)}
    <div class="card kv">
      <div><span>PO credit balance</span><strong>${inr(data.ledger.balance)}</strong></div>
      <div><span>Ledger</span><strong>${esc(data.ledger.name)}</strong></div>
    </div>
    ${table(['Type', 'Date', 'Reference', 'Amount', 'Balance after'], rows)}
    <p class="note">The spec says "PO credit balance, totals" and gives no column list. Totals are not defined (see gap list).</p>`;
}
