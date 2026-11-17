import { pageHead, table, inr, esc } from '../../shared/components.js?v=5';
import { button, input } from '../../shared/form.js?v=5';

export const meta = { code: 'D26', name: 'Service Price List', side: 'dealer', icon: 'wrench', nav: 'Inventory', roles: ['dealer-service', 'dealer-owner'] };

export function render({ data }) {
  const rows = data.priceList.map((p) => [esc(p.name), inr(p.price), esc(p.createdBy), esc(p.createdOn),
    `${button('edit', { toast: 'edit would change this service name or price.' })} ${button('delete', { toast: 'delete would remove this service from the price list.' })}`]);
  const n = data.newPrice;
  if (data.counts.prices > data.priceList.length) {
    rows.push([esc(n.name), inr(n.price), esc(n.createdBy), esc(n.createdOn),
      `${button('edit', { toast: 'edit would change this service name or price.' })} ${button('delete', { toast: 'delete would remove this service from the price list.' })}`]);
  }
  return `
    ${pageHead('Service Price List', button('new', { toast: 'new would open the dialog below.', primary: true }))}
    ${table(['Service Name', 'Price', 'Created by', 'Created on', ''], rows)}
    <div class="card" style="margin-top:14px">
      <h2>New service price</h2>
      <div class="row">
        ${input('Service Name', n.name, { required: true })}
        ${input('Price', n.price, { type: 'number', required: true })}
      </div>
      <div class="page-actions" style="margin-top:12px">${button('save', { action: 'save-price', primary: true })}</div>
      <p class="note">Created by and created on are read only and filled by the system.</p>
    </div>`;
}
