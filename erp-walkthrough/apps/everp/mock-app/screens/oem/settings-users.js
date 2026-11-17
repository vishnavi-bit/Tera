import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'O52', name: 'Settings: Users', side: 'oem', icon: 'settings', nav: 'Users', roles: ['oem-super-admin'] };

const notDefinedCell = (label) =>
  `<button class="link" data-not-defined="${esc(`${label} is not defined in screen_details.md (O52).`)}">Not defined</button>`;

export function render({ data }) {
  const nu = data.oemUsers.newUser;
  const users = [
    ...data.oemUsers.existing,
    ...(data.oemUsers.created ? [{ ...nu, name: `${nu.firstName} ${nu.lastName}` }] : [])
  ];
  const rows = users.map((u) => [
    esc(u.userId),
    esc(u.name),
    u.role ? esc(u.role) : notDefinedCell('Role'),
    notDefinedCell('Role category'),
    esc(u.contact),
    esc(u.email),
    String(u.failedLogins ?? 0),
    esc(u.status),
    `${button('edit', { toast: 'edit would open OEM User Add / Edit (O53) for this user.' })} ${button('unlock account', {
      toast: 'unlock account would unlock this user.'
    })}`
  ]);

  return `
    ${pageHead('Settings: Users', `${button('search', { toast: 'search would filter the user list.' })} ${button('create', { action: 'create-user', goto: 'O53', primary: true })}`)}
    ${table(['User ID', 'Name', 'Role', 'Role category', 'Contact', 'Email', 'Failed login attempts', 'Status', ''], rows)}`;
}
