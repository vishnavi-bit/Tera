import { pageHead, table, badge, esc } from '../../shared/components.js?v=5';
import { button, input } from '../../shared/form.js?v=5';

export const meta = { code: 'D10', name: 'Enquiry Follow-up Log', side: 'dealer', icon: 'search', nav: 'Enquiry', roles: ['dealer-sales', 'dealer-owner'] };

export function render({ data }) {
  const f = data.followUp;
  const rows = data.followUps.map((r) => [esc(r.subject), esc(r.note), esc(r.calledBy), esc(r.schedule), badge(r.status)]);
  if (data.counts.followUps > data.followUps.length) {
    rows.unshift([esc(f.subject), esc(f.note), esc(f.calledBy), esc(f.schedule.replace('T', ' ')), badge('Open')]);
  }
  return `
    ${pageHead(`Follow-ups for ${data.enquiry.id}`, `
      ${button('close follow up', { toast: 'Close Follow Up would close the open follow-up.' })}
      ${button('reopen follow up', { toast: 'Reopen Follow Up would reopen a closed follow-up.' })}`)}
    ${table(['Subject', 'Description', 'Called by', 'Schedule', 'Status'], rows)}
    <div class="card" style="margin-top:14px">
      <h2>Add follow-up</h2>
      <div class="row">
        ${input('Subject', f.subject)}
        <label class="field"><span>Description</span><textarea data-toast="Description would be saved.">${esc(f.note)}</textarea></label>
        ${input('Called by', f.calledBy)}
      </div>
      <div class="row" style="margin-top:12px">
        <label><input type="checkbox" checked data-toast="Make Schedule For Call Back would show the Schedule field."> Make Schedule For Call Back</label>
        ${input('Schedule', f.schedule, { type: 'datetime-local', required: true })}
      </div>
      <div class="page-actions" style="margin-top:12px">
        ${button('add', { action: 'add-followup', primary: true })}
        ${button('edit', { toast: 'edit would change an existing follow-up.' })}
      </div>
      <p class="note">The spec marks Subject, Description and Called by with "?" (requirement unknown), so none shows a required marker.</p>
    </div>`;
}
