import { pageHead, table, badge, statusTone, esc } from '../../shared/components.js?v=5';
import { button, select } from '../../shared/form.js?v=5';

export const meta = { code: 'D40', name: 'Service List', side: 'dealer', icon: 'wrench', nav: 'Service', roles: ['dealer-service', 'dealer-owner'] };

export function render({ data }) {
  const rows = data.services.map((s) => [esc(s.number), esc(s.customer), esc(s.chassis), esc(s.jobType), badge(s.status, statusTone(s.status))]);
  const s = data.service;
  if (s.status !== 'Not created') rows.unshift([esc(s.number), esc(data.customer.name), esc(data.vehicle.chassis), esc(s.jobType), badge(s.status, statusTone(s.status))]);
  return `
    ${pageHead('Service List', button('create', { action: 'create-service', goto: 'D41', primary: true }))}
    <div class="card row">
      ${select('Status', ['all'], 'all', { notDefined: 'The status filter options for this screen are not in screen_details.md.' })}
    </div>
    ${table(['Service', 'Customer', 'Chassis', 'Job type', 'Status'], rows)}
    <p class="note">Spec: status filter, open, create. The spec gives no column list (see gap list).</p>`;
}
