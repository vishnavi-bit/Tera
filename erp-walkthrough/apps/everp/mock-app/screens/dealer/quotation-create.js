import { pageHead, table, inr, esc } from '../../shared/components.js?v=5';
import { button, input } from '../../shared/form.js?v=5';

export const meta = { code: 'D12', name: 'Enquiry Quotation Create', side: 'dealer', icon: 'search', nav: 'Enquiry', roles: ['dealer-sales', 'dealer-owner'] };

export function render({ data }) {
  const q = data.quotation;
  const lines = table(
    ['Item', 'Variant', 'Colour (dealer stock)', 'Rate', 'Quantity', 'Discount', 'Discount Amount', 'SGST', 'CGST', 'Total'],
    q.lines.map((l) => [esc(l.item), esc(l.variant), esc(l.colour), inr(l.rate), l.qty, l.discount, inr(l.discountAmount), inr(l.sgst), inr(l.cgst), inr(l.total)])
  );
  const total = q.lines.reduce((s, l) => s + l.total, 0) + Number(q.adjustment);
  return `
    ${pageHead('Enquiry Quotation Create', button('create', { action: 'save-quotation', primary: true }))}
    <div class="card row">
      ${input('Customer Name', q.name)}
      <label class="field"><span>Add GST</span><input type="checkbox" checked data-toast="Add GST would add SGST and CGST to each line."></label>
      ${input('Quotation Date', q.date, { type: 'date' })}
      ${input('Due / Expiry Date', q.expiryDate, { type: 'date' })}
      ${input('Adjustment', q.adjustment, { type: 'number' })}
    </div>
    <div class="card">
      <div class="page-actions">${button('Add Products', { toast: 'Add Products would open a dialog to search by name or part code. A vehicle needs a variant and a colour from dealer stock.' })}</div>
      <div style="margin-top:12px">${lines}</div>
      <p class="note">Price shown is the Customer price of the variant (F1). Total: <strong>${inr(total)}</strong></p>
    </div>
    <div class="card row">
      <label class="field"><span>Terms &amp; conditions</span><textarea data-toast="Terms &amp; conditions would be saved.">${esc(q.terms)}</textarea></label>
      <label class="field"><span>Attach File(s) to Estimate</span><input type="file" data-toast="Attach File(s) to Estimate would add files to the quotation."></label>
    </div>`;
}
