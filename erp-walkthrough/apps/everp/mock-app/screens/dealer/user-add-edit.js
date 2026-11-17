import { pageHead } from '../../shared/components.js?v=5';
import { input, select, button } from '../../shared/form.js?v=5';

export const meta = { code: 'D49', name: 'User Add / Edit', side: 'dealer', icon: 'settings', nav: 'Settings', roles: ['dealer-owner'] };

// Add mode only. Edit mode (Status, Dealer role, Change Password) is not shown in this tour.
export function render({ data }) {
  const u = data.staff.newUser;
  return `
    ${pageHead('User Add / Edit', `${button('submit', { action: 'submit-user', primary: true })}`)}
    <div class="card row">
      ${select('User Role', ['Sales Man', 'Service Man'], u.role, {
        required: true,
        toast: 'User Role would be saved. The Dealer role is offered in edit mode only.'
      })}
      ${input('First Name', u.firstName, { required: true, toast: 'First Name would be saved.' })}
      ${input('Last Name', u.lastName, { required: true, toast: 'Last Name would be saved.' })}
      ${input('Email ID', u.email, { required: true, type: 'email', toast: 'Email ID would be saved.' })}
      ${input('Contact', u.contact, { required: true, toast: 'Contact would be saved.' })}
      ${input('Password', '', { required: true, type: 'password', toast: 'Password would be set for this login.' })}
      ${input('Confirm Password', '', { required: true, type: 'password', toast: 'Confirm Password would be checked against Password.' })}
    </div>`;
}
