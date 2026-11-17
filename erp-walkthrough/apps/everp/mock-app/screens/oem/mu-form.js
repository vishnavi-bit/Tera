import { pageHead, esc } from '../../shared/components.js?v=5';
import { input, select, button } from '../../shared/form.js?v=5';

export const meta = { code: 'O33', name: 'MU Create / Edit', side: 'oem', icon: 'production', nav: 'Manufacturing unit', roles: ['oem-super-admin'] };

export function render({ data }) {
  const u = data.manufacturingUnits.unit;
  const L = data.lists;
  return `
    ${pageHead('MU Create / Edit', `${button('create', { toast: 'create would save this as a new manufacturing unit.' })} ${button('save', { action: 'save-mu', primary: true })}`)}
    <div class="card row">
      ${input('Unit Name', u.unitName, { required: true })}
      ${select('State', L.states, u.state, { required: true })}
      ${select('Production Unit Head', ['No unit head'], u.productionHead)}
      <label class="field"><span>Address *</span><textarea data-toast="Address would be saved.">${esc(u.address)}</textarea></label>
      ${input('GST No', u.gstNo, { required: true })}
      ${input('Account No', u.accountNumber, { required: true })}
      ${input('IFSC Code', u.ifscCode)}
      ${input('A/c Holder Name', u.accountHolderName)}
      ${input('Bank Branch', u.bankBranch)}
      ${input('Phone No', u.phoneNo, { required: true })}
      ${input('City', u.city, { required: true })}
      ${input('Email', u.email, { required: true, type: 'email' })}
      ${input('Pincode', u.pincode, { required: true })}
      ${input('Latitude', u.latitude, { type: 'number' })}
      ${input('Longitude', u.longitude, { type: 'number' })}
    </div>
    <div class="page-actions">
      ${button('use current location', { toast: 'use current location would fill Latitude and Longitude from the browser.' })}
    </div>
    <div class="card">
      ${button('Capacity and working calendar', {
        notDefined: 'Capacity and working calendar are a separate screen detail. screen_details.md gives only the endpoints for them.'
      })}
    </div>`;
}
