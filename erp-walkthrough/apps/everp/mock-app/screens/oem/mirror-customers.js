import { pageHead, table, field, esc } from '../../shared/components.js?v=5';
import { button, input } from '../../shared/form.js?v=5';

export const meta = { code: 'O07', name: 'Dealer → Customers + Customer Mirror', side: 'oem', icon: 'customers', nav: 'Dealers', roles: ['oem-super-admin'] };

// Spec: read-only mirror of the dealer's customers (R10). Buttons: search, open. Six detail tabs (names from D17).
// F9: PAN and Aadhaar are shown unmasked, as the spec says.
const TABS = ['Personal', 'Vehicle', 'Invoice', 'Payment', 'Service', 'Warranty'];

export function render({ data }) {
  const c = data.customer;
  const rows = data.customers.map((r) => [
    esc(r.id), esc(r.name), esc(r.phone), esc(r.email), esc(r.status),
    r.id === c.id
      ? button('open', { action: 'open-customer' })
      : button('open', { toast: `open would show ${r.name}'s customer mirror.` })
  ]);
  const tabs = TABS.map((t, i) => (i === 0
    ? `<span class="tab active">${esc(t)}</span>`
    : `<span class="tab" data-not-defined="The ${esc(t)} tab content is not defined in screen_details.md (D17 shows the tab shell only).">${esc(t)}</span>`)).join('');
  return `
    ${pageHead('Customers')}
    <p class="note">Dealer: ${esc(data.dealer.name)}</p>
    <div class="card row">${input('search', '', { placeholder: 'Search', toast: 'search would find a customer by name, phone or email.' })}</div>
    ${table(['Customer ID', 'Name', 'Phone', 'Email', 'Status', 'Action'], rows)}
    <h2>${esc(c.name)}</h2>
    <div class="tabs">${tabs}</div>
    <div class="card row">
      ${field('Customer ID', c.id)}
      ${field('Name', c.name)}
      ${field('Phone', c.phone)}
      ${field('Email', c.email)}
      ${field('Billing address', `${c.billing.address}, ${c.billing.city} ${c.billing.pincode}, ${c.billing.state}, ${c.billing.country}`)}
      ${field('PAN', c.pan)}
      ${field('Aadhaar', c.aadhaar)}
    </div>
    <h2>Payment</h2>
    <div class="card row">
      ${field('Payment ID', c.payment.id)}
      ${field('Payment type', c.payment.type)}
      ${field('Payment date', c.payment.date)}
      ${field('Payment mode', c.payment.mode)}
      ${field('Amount', `₹${Number(c.payment.amount).toLocaleString('en-IN')}`)}
      ${field('Transaction ID', c.payment.transactionId)}
    </div>`;
}
