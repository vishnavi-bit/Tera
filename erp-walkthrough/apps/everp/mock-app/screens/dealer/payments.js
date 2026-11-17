import { pageHead, table, badge, statusTone, inr, esc } from '../../shared/components.js?v=5';
import { button, input, select } from '../../shared/form.js?v=5';

export const meta = { code: 'D45', name: 'Payments (2 tabs)', side: 'dealer', icon: 'payments', nav: 'Payments', roles: ['dealer-owner'] };

// Spec: 2 tabs (not named), search, status, date range, add payment, ledger history. Tab names are the walkthrough's own.
export function render({ data }) {
  const rows = data.payments.map((p) => [esc(p.order), esc(p.transactionId), inr(p.amount), esc(p.date), esc(p.note), badge(p.status, statusTone(p.status))]);
  const t = data.topup;
  if (t.status !== 'Not submitted') rows.unshift(['—', esc(t.transactionId), inr(t.amount), esc(t.date), esc(t.note), badge(t.status === 'Submitted' ? 'Submitted' : t.status, statusTone(t.status))]);
  return `
    ${pageHead('Payments', `
      ${button('ledger history', { toast: 'ledger history would show the credits and debits of the dealer\'s ledger.' })}
      ${button('add payment', { action: 'add-payment', goto: 'D46', primary: true })}`)}
    <div class="tabs">
      <button class="tab active" data-toast="This tab is already open.">payments</button>
      <button class="tab" data-not-defined="The spec says D45 has 2 tabs but does not name them or describe the second tab.">second tab</button>
    </div>
    <div class="card row">
      ${input('Search', '', { placeholder: 'Search', toast: 'Search would filter the payments.' })}
      ${select('Status', ['all'], 'all', { notDefined: 'The status options are not in screen_details.md.' })}
      ${input('Date range', '', { placeholder: 'from – to', toast: 'Date range would filter the payments by date.' })}
    </div>
    ${table(['Order', 'Transaction ID', 'Amount', 'Date', 'Note', 'Status'], rows)}
    <p class="note">The spec gives no column list for this screen (see gap list).</p>`;
}
