import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { button, input, select } from '../../shared/form.js?v=5';

export const meta = { code: 'O40', name: 'Vendor Procurement', side: 'oem', icon: 'truck', nav: 'Vendors', roles: ['oem-procurement-mgr'] };

// Spec: columns Product, Type, Needed, In stock, Net (read only), Order Qty and Rate (number), Amount (read only), MU (select),
// button Create PO (n). Needed comes from a dispatch list that no screen shows, so the sample values are shown as they are.
export function render({ data }) {
  const p = data.vendorPO;
  const rows = p.lines.map((l) => [
    esc(l.product), esc(l.type), l.needed, l.inStock, l.net,
    `<input type="number" value="${l.orderQty}" data-toast="Order Qty would be saved for ${esc(l.product)}.">`,
    `<input type="number" value="${l.rate}" data-toast="Rate would be saved for ${esc(l.product)}.">`,
    l.amount
  ]);
  return `
    ${pageHead('Vendor Procurement', button(`Create PO (${p.lineCount})`, { action: 'create-po', primary: true }))}
    <p class="note">Vendor: ${esc(data.vendors.vendor.name)}</p>
    ${table(['Product', 'Type', 'Needed', 'In stock', 'Net', 'Order Qty', 'Rate', 'Amount'], rows)}
    <div class="card row" style="margin-top:14px">
      ${select('MU', [p.muName], p.muName, { toast: 'MU would be chosen for the vendor PO.' })}
    </div>`;
}
