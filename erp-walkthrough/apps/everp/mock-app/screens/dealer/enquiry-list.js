import { pageHead, table, badge, esc } from '../../shared/components.js?v=5';
import { button, select } from '../../shared/form.js?v=5';

export const meta = { code: 'D07', name: 'Sales Follow-ups (Enquiry List)', side: 'dealer', icon: 'search', nav: 'Enquiry', roles: ['dealer-sales', 'dealer-owner'] };

// Spec: filter (all / today / week / month / date), new. The enquiry created in the walkthrough is listed once it exists.
export function render({ data }) {
  const rows = data.enquiries.map((e) => [esc(e.id), esc(e.name), badge(e.type), esc(e.phone), esc(e.location), esc(e.nextFollowUp), esc(e.status)]);
  const e = data.enquiry;
  if (e.status !== 'Not created') {
    rows.unshift([esc(e.id), esc(`${e.firstName} ${e.lastName}`), badge(e.type), esc(e.phone), esc(e.location), esc(e.schedule.slice(0, 10)), esc(e.status)]);
  }
  return `
    ${pageHead('Sales Follow-ups', button('new', { action: 'new-enquiry', goto: 'D08', primary: true }))}
    <div class="card row">
      ${select('Filter', ['all', 'today', 'week', 'month', 'date'], 'all', { toast: 'Filter would show the enquiries for all dates, today, this week, this month or a chosen date.' })}
    </div>
    ${table(['Enquiry', 'Name', 'Type', 'Mobile', 'Location', 'Next follow-up', 'Status'], rows)}
    <p class="note">The spec gives no column list for this screen (see gap list).</p>`;
}
