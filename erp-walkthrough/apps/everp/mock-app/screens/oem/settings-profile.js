import { pageHead, field } from '../../shared/components.js?v=5';
import { input, button } from '../../shared/form.js?v=5';

export const meta = { code: 'O49', name: 'Settings: Profile', side: 'oem', icon: 'settings', nav: 'Profile', roles: ['oem-super-admin'] };

// Read-only organization fields, in the order the spec lists them.
const READ_ONLY = [
  ['Org', 'org'], ['GST', 'gst'], ['Created', 'created'], ['Country', 'country'], ['State', 'state'],
  ['Location', 'location'], ['Address', 'address'], ['Currency', 'currency'], ['Tax ID', 'taxId'],
  ['Language', 'language'], ['Time zone', 'timeZone']
];

export function render({ data }) {
  const c = data.company;
  return `
    ${pageHead('Settings: Profile', button('save approval email', { action: 'save-approval-email', primary: true }))}
    <div class="card row">
      <label><input type="checkbox" ${c.isGstNeeded ? 'checked' : ''} data-toast="Is GST Needed? would be saved. Only the OEM admin can change it."> Is GST Needed?</label>
      ${input('Approval Admin Email', c.approvalAdminEmail, {
        type: 'email',
        toast: 'Approval Admin Email would be saved. Vendor PO approvals are emailed here.'
      })}
    </div>
    <div class="card row">
      ${READ_ONLY.map(([label, key]) => field(label, c.readOnly[key])).join('')}
      <p class="note">contact DMS Admin</p>
    </div>
    <div class="card row">
      <h2>Change Password</h2>
      ${input('Password', '', { required: true, type: 'password', toast: 'Password would be changed for this login.' })}
      ${input('Confirm Password', '', { required: true, type: 'password', toast: 'Confirm Password would be checked against Password.' })}
      ${button('change password', { toast: 'change password would change the password for this login.' })}
    </div>`;
}
