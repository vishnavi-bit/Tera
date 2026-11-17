import { pageHead, esc } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'D17', name: 'Customer Hub: Personal Details', side: 'dealer', icon: 'customers', nav: 'Customers', roles: ['dealer-sales', 'dealer-owner'] };

const TABS = ['personal details', 'vehicle', 'invoice', 'payment', 'service', 'warranty'];

export function render({ data }) {
  const c = data.customer;
  const b = c.billing;
  const tabs = TABS.map((t) =>
    t === 'personal details' ? `<button class="tab active" data-toast="personal details is already open.">${esc(t)}</button>`
    : t === 'payment' ? `<button class="tab" data-action="open-payment-tab" data-goto="D22">${esc(t)}</button>`
    : t === 'invoice' ? `<button class="tab" data-toast="invoice would open the customer's invoices (D19).">${esc(t)}</button>`
    : `<button class="tab" data-toast="${esc(t)} would show the customer's ${esc(t)} tab.">${esc(t)}</button>`
  ).join('');
  return `
    ${pageHead(`${c.name} (${c.id})`, `
      ${button('edit', { toast: 'edit would open Customer Add / Edit (D16).' })}
      ${button('delete', { toast: 'delete would delete this customer.' })}`)}
    <div class="tabs">${tabs}</div>
    <div class="card kv">
      <div><span>Name</span><strong>${esc(c.name)}</strong></div>
      <div><span>Mobile</span><strong>${esc(c.phone)}</strong></div>
      <div><span>Email</span><strong>${esc(c.email)}</strong></div>
      <div><span>Billing address</span><strong>${esc(`${b.address}, ${b.city}, ${b.state} ${b.pincode}`)}</strong></div>
    </div>
    <p class="note">The spec gives no field list for the Personal details tab. The fields shown are the ones entered on D16, read only (see gap list).</p>`;
}
