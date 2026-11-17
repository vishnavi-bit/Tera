import { pageHead, field } from '../../shared/components.js?v=5';
import { input, button } from '../../shared/form.js?v=5';

export const meta = { code: 'D47', name: 'Settings: Profile', side: 'dealer', icon: 'settings', nav: 'Settings', roles: ['dealer-owner'] };

// F3: the dealer edits only password, shop location, photo and business documents. Everything else is read-only.
// Shop location is shown once (the spec lists it in two tables).
export function render({ data }) {
  const d = data.dealer;
  return `
    ${pageHead('Profile')}
    <div class="card row">
      ${field('Firm Name', d.firm)}
      <p class="note">Organisation, address, bank and login details are read-only. Contact OEM Admin.</p>
    </div>
    <div class="card">
      <h2>Change password</h2>
      <div class="row">
        ${input('Password', '', { required: true, type: 'password', toast: 'Password would be changed for this login.' })}
        ${input('Confirm password', '', { required: true, type: 'password', toast: 'Confirm password would be checked against Password.' })}
      </div>
      <div class="page-actions" style="margin-top:12px">${button('change password', { toast: 'change password would update this login.' })}</div>
    </div>
    <div class="card">
      <h2>Shop location</h2>
      <div class="row">
        ${input('Latitude', d.shop.latitude, { type: 'number', toast: 'Latitude would be saved as the shop location.' })}
        ${input('Longitude', d.shop.longitude, { type: 'number', toast: 'Longitude would be saved as the shop location.' })}
        ${input('Address', d.shop.address, { toast: 'Address would be saved as the shop location.' })}
      </div>
      <div class="page-actions" style="margin-top:12px">
        ${button('Use my current location', { toast: 'Use my current location would read the browser location into Latitude and Longitude.' })}
        ${button('shop location save', { toast: 'shop location save would store the shop location.' })}
      </div>
    </div>
    <div class="card row">
      <h2>Documents</h2>
      ${input('GST Certificate', '', { type: 'file', toast: 'GST Certificate would be attached to the dealer.' })}
      ${input('PAN Card', '', { type: 'file', toast: 'PAN Card would be attached to the dealer.' })}
      ${input('Aadhaar', '', { type: 'file', toast: 'Aadhaar would be attached to the dealer.' })}
      ${input('Dealership Agreement', '', { type: 'file', toast: 'Dealership Agreement would be attached to the dealer.' })}
      <div class="page-actions">${button('upload documents', { toast: 'upload documents would attach the business documents above.' })}</div>
    </div>
    <div class="page-actions">
      ${button('profile photo', { toast: 'profile photo would upload a new profile picture.' })}
    </div>`;
}
