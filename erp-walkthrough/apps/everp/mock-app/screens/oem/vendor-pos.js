import { pageHead, table, inr, esc } from '../../shared/components.js?v=5';
import { button, select } from '../../shared/form.js?v=5';

export const meta = { code: 'O41', name: 'Vendor POs', side: 'oem', icon: 'truck', nav: 'Vendors', roles: ['oem-super-admin'] };

// Spec: buttons create (choose vendor, leads to O40), filter, view. Approval is by the OEM approval admin, via email.
// Columns: Type, Amount and MU, taken from the O40 labels (assumption). The row shows once the PO is created.
export function render({ data }) {
  const p = data.vendorPO;
  const rows = p.status === 'Not raised'
    ? []
    : [[esc(p.types), inr(p.amount), esc(p.muName), button('view', { toast: `view would show vendor PO ${esc(p.number)}.` })]];
  return `
    ${pageHead('Vendor POs', `
      ${button('create', { toast: 'create would take you to the vendor procurement view (O40) for the chosen vendor.' })}
      ${button('filter', { toast: 'filter would show the vendor POs that match the filter.' })}`)}
    <div class="card row">
      ${select('Choose vendor', [p.vendorName], p.vendorName, { required: true, toast: 'Choose vendor would open the vendor procurement view (O40).' })}
    </div>
    ${table(['Type', 'Amount', 'MU', 'Action'], rows)}`;
}
