import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { input, select, button } from '../../shared/form.js?v=5';

export const meta = { code: 'O39', name: 'Vendors', side: 'oem', icon: 'truck', nav: 'Vendors', roles: ['oem-super-admin'] };

export function render({ data }) {
  const v = data.vendors.vendor;
  const L = data.lists;
  return `
    ${pageHead('Vendors', `
      ${button('add', { action: 'add-vendor', primary: true })}
      ${button('procurement', { action: 'procurement' })}`)}
    <p class="note">Vendors: ${data.vendors.count}</p>
    ${table(['Name', 'Contact Person', 'Phone', 'Email', 'GST No', 'City', 'State', 'Active', ''], [])}
    <div class="card row">
      ${input('Name', v.name, { required: true, toast: 'Name would be saved for this vendor.' })}
      ${input('Contact Person', v.contactPerson, { toast: 'Contact Person would be saved.' })}
      ${input('Phone', v.phone, { toast: 'Phone would be saved.' })}
      ${input('Email', v.email, { type: 'email', toast: 'Email would be saved.' })}
      ${input('GST No', v.gstNo, { toast: 'GST No would be saved.' })}
      ${input('Address', v.address, { toast: 'Address would be saved.' })}
      ${input('City', v.city, { toast: 'City would be saved.' })}
      ${select('State', L.states, v.state, { toast: 'State would be saved.' })}
      ${input('Pincode', v.pincode, { toast: 'Pincode would be saved.' })}
      <label><input type="checkbox" ${v.isActive ? 'checked' : ''} data-toast="Active would be saved for this vendor."> Active</label>
      <label class="field"><span>Notes</span><textarea data-toast="Notes would be saved.">${esc(v.notes)}</textarea></label>
    </div>`;
}
