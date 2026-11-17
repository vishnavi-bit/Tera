import { pageHead, table, inr, esc } from '../../shared/components.js?v=5';
import { input, select } from '../../shared/form.js?v=5';

export const meta = { code: 'O48', name: 'Vehicle Sold', side: 'oem', icon: 'orders', nav: 'Reports', roles: ['oem-super-admin'] };

// Spec: report with search and period (today / month / year / custom). Role not keyed.
// Shows only the rows of Sri Lakshmi EVs (assumption: no other dealers are invented).
const PERIODS = ['today', 'month', 'year', 'custom'];

export function render({ data }) {
  const rows = data.vehiclesSold.map((v) => [esc(v.invoice), esc(data.dealer.name), esc(v.customer), esc(v.product), esc(v.variant), esc(v.chassis), inr(v.amount), esc(v.date)]);
  return `
    ${pageHead('Vehicle Sold')}
    <div class="card row">
      ${input('Search', '', { placeholder: 'Search', toast: 'search would find a vehicle sold by invoice, customer or chassis.' })}
      ${select('Period', PERIODS, 'month', { toast: 'Period would show the vehicles sold for that period.' })}
    </div>
    ${table(['Invoice', 'Dealer', 'Customer', 'Product', 'Variant', 'Chassis', 'Amount', 'Date'], rows)}`;
}
