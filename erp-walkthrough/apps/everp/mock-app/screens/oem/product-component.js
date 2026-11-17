import { pageHead, esc } from '../../shared/components.js?v=5';
import { input, select, button } from '../../shared/form.js?v=5';

export const meta = { code: 'O28', name: 'Product Create / Edit: Battery/Charger/Motor/Controller', side: 'oem', icon: 'products', nav: 'Motor', roles: ['oem-super-admin'] };

export function render({ data }) {
  const p = data.products.motor;
  const vendorName = data.vendors.created ? data.vendors.vendor.name : null;
  const mus = data.lists.mus;
  return `
    ${pageHead('Product Create / Edit: Battery/Charger/Motor/Controller', button('create', { action: 'create-component', primary: true }))}
    <div class="card row">
      ${input('Motor Name', p.name, { required: true })}
      ${input('HSN No', p.HSN, { required: true })}
      ${select('Vendor / Supplier', ['None', ...(vendorName ? [vendorName] : [])], vendorName ?? 'None')}
      ${input('CGST', p.cgst)}
      ${input('SGST', p.sgst)}
      ${input('Dealer Price', p.dealerPrice, { toast: 'Dealer Price would be saved for this product.' })}
      ${input('Customer Price', p.customerPrice, { toast: 'Customer Price would be saved for this product.' })}
      <label class="field"><span>Image</span><input type="file" accept="image/*" data-toast="Image would be attached to this product."></label>
    </div>
    <div class="card">
      <div class="field"><span>Additional specs</span></div>
      ${p.specs
        .map((s) => `<div class="row"><input value="${esc(s.key)}" data-toast="Spec key would be saved."><input value="${esc(s.value)}" data-toast="Spec value would be saved."></div>`)
        .join('')}
    </div>
    <div class="card row">
      <div class="field"><span>Available from per MU</span>
        ${mus.map((mu) => `<label><input type="checkbox" checked data-toast="Available from ${esc(mu)} would be saved."> ${esc(mu)}</label>`).join(' ')}
      </div>
      <label><input type="checkbox" data-toast="Purchase limit would be saved."> Purchase limit</label>
    </div>`;
}
