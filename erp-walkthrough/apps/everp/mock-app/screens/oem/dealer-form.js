import { pageHead, esc } from '../../shared/components.js?v=5';
import { input, select, radios, button } from '../../shared/form.js?v=5';

export const meta = { code: 'O05', name: 'Add / Edit Dealer', side: 'oem', icon: 'store', nav: 'Dealers', roles: ['oem-super-admin'] };

// Billing and shipping use the same fields (screen_details.md, O05). Country options are not defined.
const addressFields = (a, L) => `
  ${select('Country', [a.country], a.country, { required: true, notDefined: 'The Country options are not defined in screen_details.md.' })}
  ${select('State', L.states, a.state, { required: true })}
  ${input('Address', a.address, { required: true })}
  ${input('City', a.city, { required: true })}
  ${input('Pincode', a.pincode, { required: true })}`;

export function render({ data }) {
  const d = data.newDealer;
  const L = data.lists;
  const b = d.bank;

  return `
    ${pageHead('create new dealer', button('save', { action: 'save-dealer', primary: true }))}
    <div class="card row">
      ${radios('User Type', 'dealerType', ['Distributor', 'Divisional Distributor', 'District Dealer', 'Area Dealer'], d.dealerType, {
        required: true,
        toast: 'User Type would set the price tier and the seller for this dealer.'
      })}
    </div>
    <div class="card row">
      ${select('Owner Name: title', ['Mr.', 'Miss.', 'Mrs.'], d.namePrefix, { required: true })}
      <div class="field"><span>Owner first / last name *</span><div class="row">
        <input value="${esc(d.ownerFirstName)}" data-toast="Owner first name would be saved.">
        <input value="${esc(d.ownerLastName)}" data-toast="Owner last name would be saved.">
      </div></div>
      ${input('Firm Name', d.firm, { required: true })}
      ${input('GST No', d.gstNo, { required: true })}
      ${input('Org Email ID', d.orgEmail, { required: true, type: 'email' })}
      ${input('Org Contact', d.contact, { required: true })}
      ${input('Joining Date', d.joiningDate, { required: true, type: 'date' })}
    </div>
    <div class="card row">
      ${select('State', L.states, d.state, { toast: 'State would set the district list.' })}
      ${select('District', L.districts[d.state] ?? [], d.district, { toast: 'District would be saved.' })}
      ${input('Area', d.area)}
      ${select('Select Region', L.regions, d.region, { required: true })}
      ${select('Select Zone', L.zones, d.zone, { required: true })}
      ${select('Manufacturing Unit', ['None', ...L.mus], d.mu, {
        toast: 'Manufacturing Unit would set the seller and letterhead for this dealer.'
      })}
      ${input('Password', '', { required: true, type: 'password', toast: 'Password would be set for the new dealer login.' })}
      <label class="field"><span>Organization Logo</span><input type="file" accept="image/*" data-toast="Logo would be attached (240×240 px, up to 1 MB).">
        <span class="note">240×240 px, up to 1 MB</span></label>
    </div>
    <div class="card"><h2>Billing</h2><div class="row">${addressFields(d.billing, L)}</div></div>
    <div class="card"><h2>Shipping</h2>
      <div class="page-actions" style="margin-bottom:12px">${button('Copy Billing', {
        toast: 'Copy Billing would copy the billing address into the shipping address.'
      })}</div>
      <div class="row">${addressFields(d.shipping, L)}</div>
    </div>
    <div class="card"><h2>Shop Location</h2><div class="row">
      ${input('Latitude', d.shop.latitude, { type: 'number' })}
      ${input('Longitude', d.shop.longitude, { type: 'number' })}
      ${input('Address', d.shop.address)}
    </div></div>
    <div class="card"><h2>Bank</h2><div class="row">
      ${radios('Account Type', 'accountType', ['Current', 'Saving'], b.accountType, {
        required: true,
        toast: 'Account Type would be saved to the dealer bank details.'
      })}
      ${input('Beneficiary Name', b.beneficiaryName, { required: true })}
      ${input('Bank Name', b.bankName, { required: true })}
      ${input('Account Number', b.accountNumber, { required: true })}
      ${input('Re-enter Account Number', b.confirmAccount, { required: true })}
      ${input('IFSC', b.ifsc, { required: true })}
    </div></div>`;
}
