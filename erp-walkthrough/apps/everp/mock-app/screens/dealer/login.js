import { pageHead } from '../../shared/components.js?v=5';
import { input, button } from '../../shared/form.js?v=5';

export const meta = { code: 'D01', name: 'Login', side: 'dealer', icon: 'store', nav: 'Login', roles: ['dealer-owner'] };

export function render({ data }) {
  const d = data.newDealer;
  return `
    ${pageHead('Login')}
    <div class="card row">
      ${input('User ID', d.id, {
        required: true,
        placeholder: 'eg. D001',
        toast: 'User ID would be checked against the dealer logins.'
      })}
      ${input('Password', '', { required: true, type: 'password', toast: 'Password would be checked against the dealer login.' })}
      ${button('show / hide', { toast: 'Password would be shown or hidden.' })}
    </div>
    <div class="card row">
      <label><input type="checkbox" data-toast="Remember me would be saved on this device."> remember me</label>
    </div>
    <div class="page-actions">
      ${button('sign in', { action: 'sign-in', primary: true })}
      ${button('forgot password', { toast: 'forgot password would open Forgot Password (D02). That screen says to contact the OEM.' })}
    </div>`;
}
