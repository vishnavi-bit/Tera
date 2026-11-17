import { pageHead, esc } from '../../shared/components.js?v=5';
import { button, input, select } from '../../shared/form.js?v=5';

export const meta = { code: 'D42', name: 'Job Card + Complete Service', side: 'dealer', icon: 'wrench', nav: 'Service', roles: ['dealer-service', 'dealer-owner'] };

// Options are taken from D41 (assumption, see gap list).
const JOB_TYPES = ['Maintenance', 'Repeated', 'Accident'];
const SERVICE_TYPES = ['Paid Service', 'Free Service'];

export function render({ data }) {
  const s = data.service;
  const j = data.jobCard;
  const rectification = j.rectification.map((r) => input('Requested Rectification', r, { toast: 'Requested Rectification would be saved.' }));
  const additional = j.additionalWork
    .map(
      (w) => `<div class="row">
        ${input('Additional Work', w.text, { toast: 'Additional Work would be saved.' })}
        <label class="field"><span>Done</span><input type="checkbox"${w.done ? ' checked' : ''} data-toast="Done would mark this line as done."></label>
      </div>`
    )
    .join('');

  return `
    ${pageHead('Job Card + Complete Service', button('complete service', { action: 'complete-service', primary: true }))}
    <div class="card row">
      ${input('Mileage up to', j.mileage, { type: 'number', toast: 'Mileage up to would be saved.' })}
      ${select('Job Type', JOB_TYPES, s.jobType, { toast: 'Job Type would be saved.' })}
      <label class="field"><span>RSA / On Site</span><input type="checkbox"${j.rsa ? ' checked' : ''} data-toast="RSA / On Site would be set for this job."></label>
      ${select('Service Type', SERVICE_TYPES, s.serviceType, { toast: 'Service Type would be saved.' })}
    </div>
    <div class="card">
      <label class="field"><span>Customer Notes</span><textarea data-toast="Customer Notes would be saved.">${esc(s.customerNotes)}</textarea></label>
      <div class="row" style="margin-top:12px">${rectification.join('')}</div>
    </div>
    <div class="card">
      ${additional}
      <div class="page-actions" style="margin-top:12px">${button('+ Add More', { toast: '+ Add More would add another Additional Work line.' })}</div>
    </div>
    <div class="page-actions">
      ${button('download pdf', { toast: 'download pdf would save the job card as a PDF.' })}
      ${button('share', { toast: 'share would share the job card.' })}
      ${button('print', { toast: 'print would print the job card.' })}
    </div>`;
}
