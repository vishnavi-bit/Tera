import { inr, table, pageHead, esc, field } from '../../shared/components.js?v=5';
import { button, input, radios } from '../../shared/form.js?v=5';

export const meta = { code: 'D29', name: 'Purchase Create (Cart)', side: 'dealer', nav: null, roles: ['dealer-owner'] };

// Spec: Purchase From, payee banner, search, variant and colour chips, Add to Cart, quantity controls, Clear, Review & Place Order.
export function render({ data }) {
  const o = data.order;
  // Variant and colour choices come from the cart's own lines (the product card chips in the spec).
  const variants = [...new Set(o.lines.map((l) => l.variant))];
  const colours = [...new Set(o.lines.map((l) => l.colour))];
  const rows = o.lines.map((l) => [
    esc(l.product),
    `<span class="badge badge-neutral" data-toast="Variant ${esc(l.variant)} would be chosen for this line.">${esc(l.variant)}</span>`,
    `<span class="badge badge-neutral" data-toast="Colour ${esc(l.colour)} would be chosen for this line.">${esc(l.colour)}</span>`,
    `${l.inStock} in stock`,
    inr(l.price),
    `${button('−', { toast: 'Quantity would be reduced by one.' })} <strong>${l.qty}</strong> ${button('+', { toast: 'Quantity would be increased by one.' })}`,
    button('✕', { toast: 'This line would be removed from the cart.' }),
    inr(l.qty * l.price)
  ]);
  return `
    ${pageHead('New purchase')}
    <div class="card">
      ${radios('Purchase from', 'purchase-from', [`Manufacturing Unit - ${data.mu.name}`], `Manufacturing Unit - ${data.mu.name}`, { toast: 'The seller would be changed.' })}
      <div class="row" style="margin-top:12px">
        ${field('Manufacturing unit', data.mu.name)}
        ${field('Payee account', data.mu.account)}
        ${field('IFSC', data.mu.ifsc)}
      </div>
    </div>
    <div class="card">
      <div class="row">
        ${input('Search', '', { placeholder: 'Search product', toast: 'Search would find a product in the catalogue.' })}
      </div>
      <div class="row" style="margin-top:12px">
        ${radios('Variant', 'variant', variants, variants[0], { toast: 'Variant would be selected for the item to add.' })}
        ${radios('Colour', 'colour', colours, colours[0], { toast: 'Colour would be selected for the item to add.' })}
      </div>
      <div class="page-actions" style="margin-top:12px">${button('Add to Cart', { action: 'add-to-cart', primary: true })}</div>
    </div>
    <h2>Cart</h2>
    ${table(['Product', 'Variant', 'Colour', 'Availability', 'Dealer price', 'Qty', '', 'Line total'], rows)}
    <div class="card row" style="margin-top:14px">
      <div><span class="note">Product count</span><br><strong>${o.lines.length}</strong></div>
      <div><span class="note">Total quantity</span><br><strong>${o.qty}</strong></div>
      <div><span class="note">Grand total (excl. GST)</span><br><strong>${inr(o.total)}</strong></div>
      <div style="margin-left:auto" class="page-actions">
        ${button('Clear', { toast: 'Clear would empty the cart.' })}
        ${button('Review & Place Order', { action: 'place-order', primary: true })}
      </div>
    </div>`;
}
