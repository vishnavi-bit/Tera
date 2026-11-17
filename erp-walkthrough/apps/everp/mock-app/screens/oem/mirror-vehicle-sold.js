import { pageHead, table, inr, esc } from '../../shared/components.js?v=5';

export const meta = { code: 'O09', name: 'Dealer → Vehicle Sold', side: 'oem', icon: 'orders', nav: 'Dealers', roles: ['oem-super-admin'] };

// Spec: read-only list (R10), mirrors D20 and D21. No buttons or fields. Columns are an assumption (see gap list).
export function render({ data }) {
  const rows = data.vehiclesSold.map((v) => [esc(v.invoice), esc(v.customer), esc(v.product), esc(v.variant), esc(v.colour), esc(v.chassis), inr(v.amount), esc(v.date)]);
  return `
    ${pageHead('Vehicle Sold')}
    <p class="note">Dealer: ${esc(data.dealer.name)}</p>
    ${table(['Invoice', 'Customer', 'Product', 'Variant', 'Colour', 'Chassis', 'Amount', 'Date'], rows)}`;
}
