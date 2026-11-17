import { pageHead, esc } from '../../shared/components.js?v=5';
import { button, input, select, radios } from '../../shared/form.js?v=5';

export const meta = { code: 'D08', name: 'Enquiry Add / Edit', side: 'dealer', icon: 'search', nav: 'Enquiry', roles: ['dealer-sales', 'dealer-owner'] };

export function render({ data }) {
  const e = data.enquiry;
  return `
    ${pageHead('Enquiry Add / Edit', `
      ${button('create', { action: 'create-enquiry', primary: true })}
      ${button('save', { toast: 'save would save changes to an existing enquiry (edit mode).' })}
      ${button('delete', { toast: 'delete would delete this enquiry (edit mode).' })}
      ${button('convert to customer', { toast: 'convert to customer would open Customer Add / Edit (D16) with this enquiry carried over.' })}`)}
    <div class="card">
      ${radios('Enquiry Type', 'enquireType', ['HOT', 'COLD', 'WARM'], e.type, { required: true })}
      ${radios('Customer Type', 'customerType', ['business', 'individual_customer'], e.customerType, { required: true })}
    </div>
    <div class="card row">
      ${select('Title', ['Mr', 'Mrs', 'Miss', 'Dr', 'Ms'], e.prefix, { required: true })}
      ${input('First Name', e.firstName, { required: true })}
      ${input('Last Name', e.lastName, { required: true })}
      ${input('Mobile Number', e.phone, { type: 'tel', required: true })}
      ${input('WhatsApp', e.whatsapp, { type: 'tel' })}
      ${input('Alternate Phone', e.alternatePhone, { type: 'tel' })}
      ${input('Email', e.email, { type: 'email' })}
      ${input('Location', e.location, { required: true })}
      ${input('Subject', e.subject)}
      <label class="field"><span>Note</span><textarea data-toast="Note would be saved.">${esc(e.note)}</textarea></label>
    </div>
    <div class="card row">
      <label><input type="checkbox" checked data-toast="Make Schedule For Call Back would show the Schedule field."> Make Schedule For Call Back</label>
      ${input('Schedule', e.schedule, { type: 'datetime-local', required: true, toast: 'Schedule would create the next follow-up.' })}
    </div>
    <p class="note">The spec says there is no vehicle-of-interest field: the model is captured only through a quotation (D12).</p>`;
}
