import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { button, input } from '../../shared/form.js?v=5';

export const meta = { code: 'D14', name: 'Service Follow-up Detail', side: 'dealer', icon: 'wrench', nav: 'Service', roles: ['dealer-service', 'dealer-owner'] };

export function render({ data }) {
  const f = data.followUp;
  const c = data.customer;
  const rows = data.followUps.map((r) => [esc(r.subject), esc(r.note), esc(r.schedule)]);
  if (data.counts.followUps > data.followUps.length) rows.unshift([esc(f.subject), esc(f.note), esc(f.schedule.replace('T', ' '))]);
  return `
    ${pageHead(`Service follow-up: ${c.name}`, button('add follow-up', { toast: 'add follow-up would open the dialog below.' }))}
    <div class="card kv">
      <div><span>Customer</span><strong>${esc(c.name)}</strong></div>
      <div><span>Mobile</span><strong>${esc(c.phone)}</strong></div>
      <div><span>Chassis</span><strong>${esc(data.vehicle.chassis)}</strong></div>
      <div><span>Reason</span><strong>${esc(data.serviceFollowUps[0].reason)}</strong></div>
    </div>
    ${table(['Subject', 'Note', 'Next follow-up'], rows)}
    <div class="card" style="margin-top:14px">
      <h2>Add follow-up</h2>
      <div class="row">
        ${input('Subject', f.subject, { placeholder: 'Enter subject' })}
        <label class="field"><span>Note</span><textarea placeholder="Enter note" data-toast="Note would be saved.">${esc(f.note)}</textarea></label>
        ${input('Next Follow-Up', f.schedule, { type: 'datetime-local' })}
      </div>
      <div class="page-actions" style="margin-top:12px">${button('add', { action: 'add-followup', primary: true })}</div>
      <p class="note">The spec marks all three fields "?" (requirement unknown), so none shows a required marker.</p>
    </div>`;
}
