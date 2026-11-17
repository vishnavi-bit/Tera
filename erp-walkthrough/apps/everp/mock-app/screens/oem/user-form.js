import { pageHead, table } from '../../shared/components.js?v=5';
import { input, select, button } from '../../shared/form.js?v=5';

export const meta = { code: 'O53', name: 'OEM User Add / Edit', side: 'oem', icon: 'settings', nav: 'Add user', roles: ['oem-super-admin'] };

export function render({ data }) {
  const u = data.oemUsers.newUser;
  const L = data.lists;
  return `
    ${pageHead('OEM User Add / Edit', `
      ${button('create', { toast: 'create would save the new OEM user.' })}
      ${button('submit', { action: 'submit-user', primary: true })}
      ${button('change password', { toast: 'change password would set a new password for this user.' })}
      ${button('sign out devices', { toast: 'sign out devices would sign this user out of every device.' })}
      ${button('assign dealers', { toast: 'assign dealers would open the dealer checklist for this user.' })}`)}
    <div class="card row">
      ${select('User Role', [], '', {
        required: true,
        notDefined: 'The 15 OEM roles are referenced as section 2.1 in screen_details.md (O53), which is not in the file.'
      })}
      ${select('Manufacturing Unit', ['All units (global)', ...L.mus], u.manufacturingUnit, {
        toast: 'Manufacturing Unit would limit this user to that unit.'
      })}
      ${input('First Name', u.firstName, { required: true, toast: 'First Name would be saved.' })}
      ${input('Last Name', u.lastName, { required: true, toast: 'Last Name would be saved.' })}
      ${input('Email ID', u.email, { required: true, type: 'email', toast: 'Email ID would be saved.' })}
      ${input('Contact', u.contact, { required: true, toast: 'Contact would be saved.' })}
      ${input('Password', '', { required: true, type: 'password', toast: 'Password would be set for this login.' })}
      ${input('Confirm Password', '', { required: true, type: 'password', toast: 'Confirm Password would be checked against Password.' })}
    </div>
    <div class="card row">
      ${select('Status (edit)', ['Active', 'InActive'], u.status, { required: true, toast: 'Status would be saved for this user (edit).' })}
      <div class="field"><span>Assigned Dealers (sales roles, edit)</span>
        <p class="note" data-toast="Assigned Dealers would be saved. A sales user sees only the dealers ticked here, and none ticked means no dealers.">No dealers yet.</p>
      </div>
      ${input('Device limit (edit)', '', {
        type: 'number',
        toast: 'Device limit would be saved. Blank means the OEM default; 0 means unlimited.'
      })}
      <div class="field"><span>Devices &amp; sessions (edit)</span>
        ${table(['Device', 'IP', 'Last active', 'Signed in', ''], [])}
      </div>
    </div>`;
}
