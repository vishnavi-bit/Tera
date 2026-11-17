import { pageHead, field, esc } from '../../shared/components.js?v=5';
import { button, input, select, radios } from '../../shared/form.js?v=5';

export const meta = { code: 'D41', name: 'Service Create (Job Card)', side: 'dealer', icon: 'wrench', nav: 'Service', roles: ['dealer-service', 'dealer-owner'] };

const JOB_TYPES = ['Maintenance', 'Repeated', 'Accident'];
const SERVICE_TYPES = ['Paid Service', 'Free Service'];

export function render({ data }) {
  const s = data.service;
  const v = data.vehicle;
  const requirements = s.requirements.map((r) => input('Customer Requirement', r, { required: true, toast: 'Customer Requirement would be saved.' }));

  return `
    ${pageHead('Service Create (Job Card)', button('create service', { action: 'create-service', primary: true }))}
    <div class="card row">
      ${radios('Product type', 'productType', ['Vehicle', 'Warranty products'], s.productType, { required: true })}
      ${input('Select product', v.chassis, { required: true, placeholder: 'Search vehicle name or chasis no', toast: 'Select product would search vehicles by name or chassis number.' })}
      ${field('Chasis Number', v.chassis)}
      ${field('Type of service', s.number)}
      ${input('Meter Reading', s.meterReading, { required: true })}
      ${select('Job Type', JOB_TYPES, s.jobType, { required: true })}
      ${select('Service Type', SERVICE_TYPES, s.serviceType, { required: true })}
    </div>
    <div class="card">
      <div class="row">${requirements.join('')}</div>
      <div class="page-actions" style="margin-top:12px">${button('+ Add Remarks', { toast: '+ Add Remarks would add another Customer Requirement line.' })}</div>
      <label class="field" style="margin-top:12px"><span>Vehicle Condition</span><input type="file" accept="image/*" multiple data-toast="Vehicle Condition images would be attached (drag and drop)."></label>
      <label class="field" style="margin-top:12px"><span>Customer Notes *</span><textarea data-toast="Customer Notes would be saved.">${esc(s.customerNotes)}</textarea></label>
    </div>`;
}
