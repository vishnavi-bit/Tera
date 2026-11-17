import { pageHead, table, esc } from '../../shared/components.js?v=5';

export const meta = { code: 'O13', name: 'Dealer → Pending Stock', side: 'oem', icon: 'inventory', nav: 'Dealers', roles: ['oem-super-admin'] };

// Spec: report, "approved minus dispatched". The walkthrough shows the sample values from the seed and does not calculate.
export function render({ data }) {
  const rows = data.pendingStock.map((p) => [esc(p.po), p.approved, p.dispatched, p.pending]);
  return `
    ${pageHead('Pending Stock')}
    <p class="note">Dealer: ${esc(data.dealer.name)}</p>
    ${table(['PO number', 'Approved', 'Dispatched', 'Pending to dispatch'], rows)}`;
}
