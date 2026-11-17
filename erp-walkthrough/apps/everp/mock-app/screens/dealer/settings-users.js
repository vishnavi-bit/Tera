import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'D48', name: 'Settings: Users', side: 'dealer', icon: 'settings', nav: 'Settings', roles: ['dealer-owner'] };

// Spec: list screen with search, create and edit. No column list in screen_details.md.
// The columns are the O52 labels (see gap list). The edit column has no label.
export function render({ data }) {
  const s = data.staff;
  const added = s.created
    ? [{ userId: s.newUser.userId, name: `${s.newUser.firstName} ${s.newUser.lastName}`, role: s.newUser.role, contact: s.newUser.contact, email: s.newUser.email, status: s.newUser.status }]
    : [];
  const rows = [...s.existing, ...added].map((u) => [
    esc(u.userId),
    esc(u.name),
    esc(u.role),
    esc(u.contact),
    esc(u.email),
    esc(u.status),
    button('edit', { toast: 'edit would open User Add / Edit (D49) for this user.' })
  ]);

  return `
    ${pageHead('Settings: Users', `
      ${button('search', { toast: 'search would filter the staff user list.' })}
      ${button('create', { action: 'create-user', primary: true })}`)}
    <p class="note">Staff users: ${s.count}</p>
    ${table(['User ID', 'Name', 'Role', 'Contact', 'Email', 'Status', ''], rows)}`;
}
