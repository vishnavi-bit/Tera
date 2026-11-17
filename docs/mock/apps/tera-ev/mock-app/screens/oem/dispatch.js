import { pageHead, table, esc, badge, statusTone } from '../../shared/components.js?v=1';
import { input, button } from '../../shared/form.js?v=1';

export const meta = { code: 'S05', name: 'Chassis validation and dispatch shipment', side: 'oem', icon: 'parcel', roles: ['oem-logistics'] };

export function render({ data }) {
  const a = data.assign;
  const d = data.dispatch;
  return `
    ${pageHead(`Dispatch > ${esc(data.order.id)} > Validate & dispatch`)}
    ${table(
      ['Line', 'Units', 'Chassis', 'Motor', 'Status'],
      [[`${esc(a.model)} ${esc(a.colour)}`, String(data.stock.reserved), esc(d.chassisCheck), esc(d.motorCheck), badge(d.status, statusTone(d.status))]]
    )}
    <p class="note">A unit with a mismatch is blocked and cannot be shipped.</p>
    <div class="card">
      ${input('Transport', d.transport, { toast: 'Transport details would be recorded with the dispatch.' })}
      <div class="page-actions">${button('Dispatch ready units', { action: 'dispatch', primary: true })}</div>
    </div>`;
}
