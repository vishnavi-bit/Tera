import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { input, button } from '../../shared/form.js?v=5';

export const meta = { code: 'O55', name: 'Settings: Security', side: 'oem', icon: 'settings', nav: 'Security', roles: ['oem-super-admin'] };

// Spec: ADM sees the accounts table (account, role, devices, limit, last active) and the default device limit.
// The sign-out effect and the My devices columns are not defined, so they are shown as gaps.
export function render({ data }) {
  const s = data.security;
  const rows = s.accounts.map((a) => [esc(a.account), esc(a.role), esc(String(a.devices)), esc(a.limit), esc(a.lastActive)]);
  return `
    ${pageHead('Settings: Security', `
      ${button('sign out other devices', { toast: 'sign out other devices has no stated effect in screen_details.md, so no device is signed out here.' })}
      ${button('sign out everywhere', { toast: 'sign out everywhere has no stated effect in screen_details.md, so no device is signed out here.' })}`)}
    <div class="card row">
      ${input('Default device limit', s.deviceLimit, { type: 'number', toast: 'Default device limit would be saved.' })}
    </div>
    <div class="card">
      <h2>My devices</h2>
      <p class="note">Device list not defined in screen_details.md. <button class="link" data-not-defined="My devices columns and device data are not defined in screen_details.md (O55).">Not defined</button></p>
    </div>
    <div class="card">
      <h2>Logged-in accounts</h2>
      ${table(['Account', 'Role', 'Devices', 'Limit', 'Last active'], rows)}
    </div>`;
}
