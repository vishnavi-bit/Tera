import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'D15', name: 'Customers List', side: 'dealer', icon: 'customers', nav: 'Customers', roles: ['dealer-service', 'dealer-owner'] };

export function render({ data }) {
  const selected = data.customer.id;
  const rows = data.customers.map((c) => [
    esc(c.id),
    c.id === selected ? `<button class="link" data-action="open-customer">${esc(c.name)}</button>` : esc(c.name),
    esc(c.phone),
    esc(c.email)
  ]);
  const search = 'search (name / phone / email)';

  return `
    ${pageHead('Customers List', button('create', { toast: 'create would open Customer Add / Edit (D16) for a new customer.' }))}
    <div class="card row">
      <input placeholder="${esc(search)}" data-toast="search would filter the customers by name, phone or email.">
      ${button('search', { toast: 'search would filter the customers by name, phone or email.' })}
    </div>
    ${table(['Customer ID', 'Name', 'Mobile', 'Email'], rows)}`;
}
