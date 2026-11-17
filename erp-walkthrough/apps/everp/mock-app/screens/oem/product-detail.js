import { pageHead, table, inr, esc } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'O29', name: 'Product Detail + Dashboard', side: 'oem', icon: 'products', nav: 'Products', roles: ['oem-super-admin'] };

// Spec: week / month / year and purchased vs sold. The report content (per-model rollup, stock by MU, price matrix) is not defined.
// Roles: ADM (assumption: Super Admin). Stock by MU shows the seed values only.
export function render({ data }) {
  const p = data.purchasedVsSold;
  const stock = data.stock.items.reduce((sum, i) => sum + i.quantity, 0);
  const rows = [[esc(data.mu.name), stock, esc(data.products.vehicle.productName)]];
  return `
    ${pageHead(data.products.vehicle.productName, `
      ${button('week', { toast: 'week would show the report for the last week.' })}
      ${button('month', { toast: 'month would show the report for the last month.' })}
      ${button('year', { toast: 'year would show the report for the last year.' })}
      ${button('purchased vs sold', { toast: 'purchased vs sold would show the purchased and sold counts side by side.' })}`)}
    <div class="card kv">
      <div><span>Purchased</span><strong>${p.purchased}</strong></div>
      <div><span>Sold</span><strong>${p.sold}</strong></div>
    </div>
    <h2>Stock by ${esc('Manufacturing Unit')}</h2>
    ${table(['Manufacturing Unit', 'Quantity', 'Product'], rows)}`;
}
