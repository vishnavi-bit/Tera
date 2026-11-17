import { pageHead, table, esc, badge } from '../../shared/components.js?v=1';
import { select, button } from '../../shared/form.js?v=1';

export const meta = { code: 'S01', name: 'Dealer places purchase order', side: 'dealer', icon: 'parcel', nav: 'Purchase', roles: ['dealer-owner'] };

const ALLOWED = [16, 20, 32, 40];

export function render({ data }) {
  const o = data.order;
  const ok = ALLOWED.includes(o.units);
  return `
    ${pageHead('Purchase > New order')}
    <p class="note">Step 2 of 3: Cart</p>
    <div class="card">
      ${select('Seller', [o.seller], o.seller, {
        notDefined: 'Whether a higher-tier dealer can be the seller, and whether the 16/20/32/40 rule applies the same way, is not defined (REQ-378 open question).',
      })}
      <div class="row">
        ${select('Product', [o.product], o.product, { toast: 'Product would be picked from the seller catalogue.' })}
        ${select('Variant', [o.variant], o.variant, { toast: 'Variant would be picked for the product.' })}
        ${select('Colour', [o.colour], o.colour, { toast: 'Colour would be picked for the variant.' })}
      </div>
      <div class="row">
        <label class="field"><span>Qty *</span><input type="number" value="${o.units}" data-toast="Quantity would change the cart line."></label>
        ${button('Add', { toast: 'Add would put this line in the cart.' })}
      </div>
      <p>Stock: ${data.stock.available} available at the seller</p>
    </div>
    ${table(
      ['Product', 'Variant', 'Colour', 'Units', 'Stock', 'Line'],
      [[esc(o.product), esc(o.variant), esc(o.colour), String(o.units), `${data.stock.available} available`, badge('In cart', 'neutral')]]
    )}
    <div class="card">
      <p>Total units: <strong>${o.units}</strong> ${
        ok ? badge('OK (16 / 20 / 32 / 40)', 'good') : badge('Refused: total must be 16, 20, 32 or 40', 'bad')
      }</p>
      <div class="page-actions">${button('Place order', { action: 'place-order', primary: true })}</div>
    </div>`;
}
