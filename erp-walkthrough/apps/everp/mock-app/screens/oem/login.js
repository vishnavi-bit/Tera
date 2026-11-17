import { pageHead } from '../../shared/components.js?v=5';
import { input, button } from '../../shared/form.js?v=5';

export const meta = { code: 'O01', name: 'Login / Forgot Password', side: 'oem', icon: 'store', nav: 'Login', roles: ['oem-super-admin'] };

export function render({ data }) {
  return `
    ${pageHead('Login / Forgot Password')}
    <div class="card row">
      ${input('User ID', data.oemLogin.userId, {
        required: true,
        placeholder: 'eg. D001',
        toast: 'User ID would be checked against the OEM logins.'
      })}
      ${input('Password', '', { required: true, type: 'password', toast: 'Password would be checked against the OEM login.' })}
      ${button('show / hide', { toast: 'Password would be shown or hidden.' })}
    </div>
    <div class="card row">
      <label><input type="checkbox" data-toast="Remember me would be saved on this device."> Remember me</label>
    </div>
    <div class="page-actions">
      ${button('sign in', { action: 'sign-in', primary: true })}
      ${button('forgot password', {
        notDefined: 'Forgot Password has no fields or actions in screen_details.md (O01). It appears only in the screen name.'
      })}
    </div>`;
}
