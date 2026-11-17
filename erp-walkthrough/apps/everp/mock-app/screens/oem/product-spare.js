import { pageHead, esc } from '../../shared/components.js?v=5';
import { input, select, button } from '../../shared/form.js?v=5';

export const meta = { code: 'O27', name: 'Product Create / Edit: Spare, Accessory', side: 'oem', icon: 'products', nav: 'Spare', roles: ['oem-super-admin'] };

export function render({ data }) {
  const s = data.products.spare;
  const vehicle = data.products.vehicle.productName;
  const vendorName = data.vendors.created ? data.vendors.vendor.name : null;
  const mus = data.lists.mus;
  return `
    ${pageHead('Product Create / Edit: Spare, Accessory', button('create', { action: 'create-spare', primary: true }))}
    <div class="card row">
      ${select('Vehicle', [vehicle], vehicle, { required: true })}
      ${input('Spare Name / Accessory Name', s.spareName, { required: true })}
      <label><input type="checkbox" data-toast="Is Panel / Painted Part? would be saved for this spare."> Is Panel / Painted Part? (spare)</label>
      ${input('Parts Code', s.partCode)}
      ${select('Vendor / Supplier (spare)', ['None', ...(vendorName ? [vendorName] : [])], vendorName ?? 'None', {
        toast: 'Vendor / Supplier would be saved for this spare.'
      })}
      ${input('Category, Brand (accessory)', '', {
        notDefined: 'Category and Brand (accessory) have a "text / select" type but no option list in screen_details.md (O27).'
      })}
      ${input('HSN Code', s.HSN, { required: true })}
      ${input('CGST', s.cgst)}
      ${input('SGST', s.sgst)}
      ${input('Dealer Price', s.dealerPrice, { toast: 'Dealer Price would be saved for this spare.' })}
      ${input('Customer Price', s.customerPrice, { toast: 'Customer Price would be saved for this spare.' })}
      <label class="field"><span>Image</span><input type="file" accept="image/*" data-toast="Image would be attached to this spare."></label>
    </div>
    <div class="card">
      <div class="field"><span>Additional specs</span></div>
      ${s.specs
        .map((x) => `<div class="row"><input value="${esc(x.key)}" data-toast="Spec key would be saved."><input value="${esc(x.value)}" data-toast="Spec value would be saved."></div>`)
        .join('')}
    </div>
    <div class="card row">
      <div class="field"><span>Available from per MU</span>
        ${mus.map((mu) => `<label><input type="checkbox" checked data-toast="Available from ${esc(mu)} would be saved."> ${esc(mu)}</label>`).join(' ')}
      </div>
      <label><input type="checkbox" data-toast="Purchase limit would be saved."> Purchase limit</label>
    </div>`;
}
