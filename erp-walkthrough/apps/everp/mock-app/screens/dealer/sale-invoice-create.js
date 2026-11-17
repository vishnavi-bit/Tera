import { pageHead, table, inr, esc } from '../../shared/components.js?v=5';
import { button, input, select, radios } from '../../shared/form.js?v=5';

export const meta = { code: 'D20', name: 'Sale Invoice Create', side: 'dealer', icon: 'file', nav: 'Sales', roles: ['dealer-service', 'dealer-owner'] };

const ITEM_TYPES = ['Vehicle', 'Spare', 'Accessory', 'Motor', 'Battery', 'Controller', 'Charger'];
const DISCOUNT_TYPES = ['%', '₹'];

// Shown when opened from D42 with invoiceType SERVICE. Lines come from the service price list (D26).
export function render({ data }) {
  const inv = data.invoice;
  const p = data.product;
  const v = data.vehicle;

  const lines = table(
    ['Item', 'HSN', 'Rate', 'Discount', 'Discount Amount', 'SGST %/amt', 'CGST %/amt', 'Amount'],
    inv.lines.map((l) => [
      esc(l.item),
      esc(l.hsn),
      inr(l.rate),
      `<input type="number" value="${esc(l.discount)}" data-toast="Discount would be applied to this line."> <select data-toast="Discount type would be applied to this line.">${DISCOUNT_TYPES.map((t) => `<option>${esc(t)}</option>`).join('')}</select>`,
      inr(l.discountAmount),
      inr(l.sgst),
      inr(l.cgst),
      inr(l.amount)
    ])
  );

  const serialFields = [
    input('Chassis No', v.chassis, { required: true }),
    input('Motor No', v.motor, { required: true }),
    ...v.batteries.map((b, i) => input(`Battery No ${i + 1}`, b, { required: true })),
    input('Controller No', v.controller, { required: true }),
    input('Charger No', v.charger, { required: true })
  ].join('');

  return `
    ${pageHead('Sale Invoice Create', button('create', { action: 'create-invoice', primary: true }))}
    <div class="card row">
      ${input('Customer Name', inv.name, { required: true })}
      ${input('Invoice Date', inv.date, { type: 'date', required: true })}
      ${input('Due Date', inv.dueDate, { type: 'date', required: true })}
      ${input('Adjustment', inv.adjustment, { type: 'number' })}
      <label class="field"><span>Terms &amp; conditions</span><textarea data-toast="Terms &amp; conditions would be saved.">${esc(inv.terms)}</textarea></label>
      <label class="field"><span>Attachments</span><input type="file" data-toast="Attachments would be added to the invoice."></label>
    </div>
    <div class="card">
      <h2>Payment Records</h2>
      ${data.payment && data.payment.status !== 'Not recorded'
        ? `<p class="note">Linked: ${esc(data.payment.id)} · ${esc(data.payment.type)} · ${inr(data.payment.amount)} · ${esc(data.payment.transactionId)}</p>`
        : `<p class="note">${inv.payments.length ? '' : 'No payments linked yet.'}</p>`}
      ${button('+ Add Payment', { toast: '+ Add Payment would link an existing customer payment (create it first in D23).' })}
    </div>
    <div class="card">
      <div class="page-actions">${button('+ Add Item', { toast: '+ Add Item would open the Select Product dialog.' })}</div>
      <div class="card" style="margin-top:12px">
        <h2>Select Product</h2>
        <div class="row">
          ${radios('Item type', 'itemType', ITEM_TYPES, 'Vehicle', { required: true })}
          <input placeholder="Search product" data-toast="Search product would find products in stock.">
        </div>
        <div class="card row">
          <span>${esc(p.name)} · ${esc(p.variant)} · ${esc(p.colour)} · ${inr(p.netRate)} · GST ${esc(p.gstPercent)}% · ${inr(p.price)} incl.</span>
          <input type="number" value="1" data-toast="Quantity would change the number of units added.">
          ${button('Add', { toast: 'Add would add this product to the invoice (stock is checked first).' })}
        </div>
      </div>
      <div style="margin-top:12px">${lines}</div>
    </div>
    <div class="card">
      <h2>Add Vehicle Detail</h2>
      <div class="row">${serialFields}</div>
      <div class="page-actions" style="margin-top:12px">
        ${button('+ Add Extra Field', { toast: '+ Add Extra Field would add a custom field (defaults: Converter No, Colour, Product No, Part code).' })}
        ${button('add vehicle serials', { toast: 'add vehicle serials would check the serials against dealer stock.' })}
      </div>
    </div>`;
}
