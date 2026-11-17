import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { button, input, select } from '../../shared/form.js?v=5';

export const meta = { code: 'O35', name: 'MU Stock', side: 'oem', icon: 'inventory', nav: 'Inventory', roles: ['oem-inventory-mgr'] };

// Spec: buttons date, daily register, in-transit (add, edit, receive), components needed, reduce stock.
// Add In-Transit Shipment fields: Product, Dispatch Date, Colors Breakdown (+ Add Color), Notes.
// Daily Stock Register: model, opening, dispatched, reserved, received, closing, in transit (all seven spec columns).
// Clicking Reserved shows a dealer breakdown in the spec, so the Reserved value is a toast. Values are seed values, not calculated.
export function render({ data }) {
  const reg = data.muStock.register.map((r) => [
    esc(r.model), r.opening, r.dispatched,
    `<button class="btn" data-toast="Reserved would show the dealer breakdown for ${esc(r.model)}.">${r.reserved}</button>`,
    r.received, r.closing, r.inTransit
  ]);
  const products = data.muStock.productNames;
  const colours = data.products.vehicle.colours.map((c) => c.name);
  return `
    ${pageHead('MU Stock', `
      ${button('date', { toast: 'date would show the stock for that date.' })}
      ${button('daily register', { toast: 'daily register would show the daily stock register.' })}
      ${button('components needed', { toast: 'components needed would show the components needed for the stock.' })}
      ${button('reduce stock', { toast: 'reduce stock would reduce the stock for the chosen product.' })}`)}
    <p class="note">MU: ${esc(data.vendorPO.muName)}</p>
    ${table(['Model', 'Opening', 'Dispatched', 'Reserved', 'Received', 'Closing', 'In transit'], reg)}
    <div class="card" style="margin-top:14px">
      <h2>In-transit</h2>
      <div class="page-actions">
        ${button('add', { toast: 'add would add an in-transit shipment.' })}
        ${button('edit', { toast: 'edit would edit an in-transit shipment.' })}
        ${button('receive', { toast: 'receive would receive the in-transit shipment with the received colours.' })}
      </div>
      ${select('Product', products, products[0], { required: true, toast: 'Product would be chosen for the in-transit shipment.' })}
      ${input('Dispatch Date', '', { type: 'date', toast: 'Dispatch Date would be saved.' })}
      ${select('Colors Breakdown', colours, colours[0], { toast: 'Colors Breakdown would be chosen.' })}
      <input type="number" value="" data-toast="The quantity for this colour would be saved." placeholder="Qty">
      ${button('Add Color', { toast: 'Add Color would add another colour line to the breakdown.' })}
      <label class="field"><span>Notes</span><textarea data-toast="Notes would be saved with the in-transit shipment."></textarea></label>
    </div>`;
}
