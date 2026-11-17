import { pageHead, esc } from '../../shared/components.js?v=5';
import { button, input, select, radios } from '../../shared/form.js?v=5';

export const meta = { code: 'D16', name: 'Customer Add / Edit', side: 'dealer', icon: 'customers', nav: 'Customers', roles: ['dealer-sales', 'dealer-owner'] };

const address = (kind, a) => `
  <div class="card">
    <h2>${kind} address</h2>
    <div class="row">
      ${select('Country', ['India', 'Nepal'], a.country, { required: true })}
      ${select('State', [a.state], a.state, { required: true, notDefined: 'The state list (36 states / union territories) is not in screen_details.md, only its source API.' })}
      ${input('City', a.city, { required: true })}
      ${input('Pincode', a.pincode, { required: true })}
      <label class="field"><span>Address *</span><textarea data-toast="Address would be saved.">${esc(a.address)}</textarea></label>
    </div>
    ${kind === 'Shipping' ? button('Copy Billing Address here', { toast: 'Copy Billing Address here would copy the five billing fields into shipping.' }) : ''}
  </div>`;

export function render({ data }) {
  const c = data.customer;
  return `
    ${pageHead('Customer Add / Edit', `
      ${button('create', { action: 'create-customer', primary: true })}
      ${button('save', { toast: 'save would save changes to an existing customer (edit mode).' })}
      ${button('delete', { toast: 'delete would delete this customer (menu).' })}`)}
    <div class="card">${radios('Customer Type', 'customerType', ['individual_customer', 'business'], c.customerType, { required: true })}
      <p class="note">Choosing business would show the GST Number field. Carried over from enquiry ${esc(data.enquiry.id)}.</p></div>
    <div class="card row">
      ${select('Title', ['Mr', 'Miss', 'Mrs', 'Dr', 'Ms'], c.prefix, { required: true })}
      ${input('First Name', c.firstName, { required: true })}
      ${input('Last Name', c.lastName, { required: true })}
      ${input('Customer Email', c.email)}
      ${input('Mobile', c.phone, { required: true })}
      ${input('Work', c.workPhone)}
      ${input('WhatsApp', c.whatsapp)}
    </div>
    ${address('Billing', c.billing)}
    ${address('Shipping', c.billing)}
    <div class="card">
      <h2>Documents (at least one of the three)</h2>
      <div class="row">
        ${input('PAN No', c.documents.pan, { required: true })}
        <label class="field"><span>PAN Upload Proof</span><input type="file" data-toast="Upload Proof would attach a PDF or image."></label>
        ${input('Aadhar No', c.documents.aadhar)}
        <label class="field"><span>Aadhar Upload Proof</span><input type="file" data-toast="Upload Proof would attach a PDF or image."></label>
        ${input('Licence No', c.documents.licence)}
        <label class="field"><span>Licence Upload Proof</span><input type="file" data-toast="Upload Proof would attach a PDF or image."></label>
      </div>
      <p class="note">Spec: "Please provide at least one document: PAN, Aadhar, or Licence".</p>
    </div>`;
}
