import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { input, select } from '../../shared/form.js?v=5';

export const meta = { code: 'D13', name: 'Service Follow-ups List', side: 'dealer', icon: 'wrench', nav: 'Service', roles: ['dealer-service', 'dealer-owner'] };

export function render({ data }) {
  const rows = data.serviceFollowUps.map((f, i) => [
    i === 0 ? `<button class="link" data-action="open-followup">${esc(f.id)}</button>` : esc(f.id),
    esc(f.customer), esc(f.phone), esc(f.chassis), esc(f.reason), esc(f.due)
  ]);
  return `
    ${pageHead('Service Follow-ups')}
    <div class="card row">
      ${select('Filter', ['all'], 'all', { notDefined: 'The filter options for this screen are not in screen_details.md.' })}
      ${input('Search', '', { placeholder: 'name / phone / email', toast: 'Search would find a follow-up by customer name, phone or email.' })}
    </div>
    ${table(['Follow-up', 'Customer', 'Mobile', 'Chassis', 'Reason', 'Due'], rows)}
    <p class="note">The spec gives no column list for this screen (see gap list).</p>`;
}
