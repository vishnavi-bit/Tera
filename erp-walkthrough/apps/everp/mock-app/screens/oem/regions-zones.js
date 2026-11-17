import { pageHead, table } from '../../shared/components.js?v=5';
import { input, select, button } from '../../shared/form.js?v=5';

export const meta = { code: 'O51', name: 'Settings: Regions & Zones', side: 'oem', icon: 'settings', nav: 'Regions & zones', roles: ['oem-super-admin'] };

// Region and zone heads are the OEM users created so far.
const heads = (data) => [
  ...data.oemUsers.existing.map((u) => u.name),
  ...(data.oemUsers.created ? [`${data.oemUsers.newUser.firstName} ${data.oemUsers.newUser.lastName}`] : [])
];

export function render({ data }) {
  const r = data.regions.region;
  return `
    ${pageHead('Settings: Regions & Zones', button('create region & zone', { action: 'save-region', primary: true }))}
    <div class="card">
      ${table(['Region ID', 'Name', 'Head', 'Zones', 'Dealers', 'Created on', 'Status'], [])}
      <p class="note">Regions: ${data.regions.count}</p>
    </div>
    <div class="card row">
      ${input('Region Name', r.name, { required: true, toast: 'Region Name would be saved.' })}
      ${select('Region Head', heads(data), r.head, { toast: 'Region Head would be saved.' })}
      ${input('Zone Name', r.zone, { required: true, toast: 'Zone Name would be saved.' })}
      ${select('Zone Head', ['Select Manager', ...heads(data)], r.zoneHead, { toast: 'Zone Head would be saved.' })}
      <div class="page-actions">${button('add zone', { toast: 'add zone would add another Zone Name row.' })}</div>
    </div>`;
}
