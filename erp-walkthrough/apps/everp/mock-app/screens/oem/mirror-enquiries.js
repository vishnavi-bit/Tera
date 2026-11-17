import { pageHead, table, esc } from '../../shared/components.js?v=5';

export const meta = { code: 'O08', name: 'Dealer → Enquiries', side: 'oem', icon: 'customers', nav: 'Dealers', roles: ['oem-super-admin'] };

// Spec: read-only list (R10). No buttons or fields. Columns are an assumption (see gap list).
export function render({ data }) {
  const rows = data.enquiries.map((e) => [esc(e.id), esc(e.name), esc(e.type), esc(e.phone), esc(e.location), esc(e.nextFollowUp), esc(e.status)]);
  return `
    ${pageHead('Enquiries')}
    <p class="note">Dealer: ${esc(data.dealer.name)}</p>
    ${table(['Enquiry ID', 'Name', 'Type', 'Phone', 'Location', 'Next follow-up', 'Status'], rows)}`;
}
