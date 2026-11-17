import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'O32', name: 'Manufacturing Units List', side: 'oem', icon: 'production', nav: 'Manufacturing unit', roles: ['oem-super-admin'] };

export function render({ data }) {
  const u = data.manufacturingUnits.unit;
  // No columns are defined for O32 in screen_details.md. Rows use the O33 field labels.
  const rows = data.manufacturingUnits.created
    ? [[esc(u.unitName), esc(u.state), esc(u.city), esc(u.phoneNo), esc(u.email), button('view', { toast: 'view would open MU View (O34) for this unit.' })]]
    : [];
  return `
    ${pageHead('Manufacturing Units', button('new', { action: 'new-mu', goto: 'O33', primary: true }))}
    <p class="note">Manufacturing units: ${data.manufacturingUnits.count}</p>
    ${table(['Unit Name', 'State', 'City', 'Phone No', 'Email', ''], rows)}`;
}
