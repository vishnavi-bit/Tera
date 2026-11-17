import { pageHead, badge, statusTone, esc } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'D09', name: 'Enquiry Detail', side: 'dealer', icon: 'search', nav: 'Enquiry', roles: ['dealer-sales', 'dealer-owner'] };

export function render({ data }) {
  const e = data.enquiry;
  const q = data.quotation;
  return `
    ${pageHead(`Enquiry ${e.id}`, `
      ${button('edit', { toast: 'edit would open Enquiry Add / Edit (D08) for this enquiry.' })}
      ${button('delete', { toast: 'delete would delete this enquiry.' })}
      ${button('convert to customer', { action: 'convert-customer', goto: 'D16', primary: true })}`)}
    <div class="card kv">
      <div><span>Name</span><strong>${esc(`${e.prefix} ${e.firstName} ${e.lastName}`)}</strong></div>
      <div><span>Mobile</span><strong>${esc(e.phone)}</strong></div>
      <div><span>Email</span><strong>${esc(e.email)}</strong></div>
      <div><span>Location</span><strong>${esc(e.location)}</strong></div>
      <div><span>Enquiry type</span>${badge(e.type)}</div>
      <div><span>Subject</span><strong>${esc(e.subject)}</strong></div>
      <div><span>Status</span>${badge(e.status, statusTone(e.status))}</div>
      <div><span>Quotation</span><strong>${esc(q.status === 'Not created' ? 'None yet' : q.id)}</strong></div>
    </div>
    <div class="card row">
      ${button('follow-up', { action: 'open-followup', goto: 'D10' })}
      ${button('quotation', { toast: 'quotation would open the Enquiry Quotations List (D11).' })}
    </div>
    <p class="note">The spec lists no links from this screen to follow-up or quotation. They are added so the tour can reach D10 and D11 (see gap list).</p>`;
}
