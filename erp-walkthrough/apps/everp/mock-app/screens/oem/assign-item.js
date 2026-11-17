import { pageHead, field, esc } from '../../shared/components.js?v=5';
import { button, select } from '../../shared/form.js?v=5';

export const meta = { code: 'O21', name: 'Assign Item', side: 'oem', icon: 'orders', nav: null, roles: ['oem-sales-head'] };

// Spec: Manufacturing Unit select, read-only quantities and product, notes, assign. No chassis or serial at assignment.
export function render({ data }) {
  const o = data.order;
  const colours = [...new Set(o.lines.map((l) => l.colour))].join(', ');
  return `
    ${pageHead('Assign Item', button('Assign', { action: 'assign', primary: true }))}
    <div class="card row">
      ${select('Manufacturing Unit', [data.mu.name], data.mu.name, { required: true, toast: 'Manufacturing Unit would be chosen for this assignment.' })}
    </div>
    <div class="card kv" style="margin-top:14px">
      <div>${field('Total qty', o.qty)}</div>
      <div>${field('Approved qty', o.qty)}</div>
      <div>${field('Vehicle', o.lines[0].product)}</div>
      <div>${field('Variant', o.lines[0].variant)}</div>
      <div>${field('Colour', colours)}</div>
    </div>
    <div class="card" style="margin-top:14px">
      <label class="field"><span>Notes</span><textarea data-toast="Notes would be saved with the assignment."></textarea></label>
    </div>`;
}
