import { pageHead, field } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'O06', name: 'Dealer Detail (9 tabs)', side: 'oem', icon: 'store', nav: 'Dealers', roles: ['oem-super-admin'] };

const addr = (a) => `${a.address}, ${a.city} ${a.pincode}, ${a.state}, ${a.country}`;

export function render({ data }) {
  const d = data.newDealer;
  const b = d.bank;
  const profile = [
    ['Dealer ID', d.id],
    ['Owner name', `${d.namePrefix} ${d.ownerFirstName} ${d.ownerLastName}`],
    ['Firm Name', d.firm],
    ['GST No', d.gstNo],
    ['Org Email ID', d.orgEmail],
    ['Org Contact', d.contact],
    ['Joining Date', d.joiningDate],
    ['User Type', d.dealerType],
    ['Select Region', d.region],
    ['Select Zone', d.zone],
    ['Manufacturing Unit', d.mu],
    ['Status', d.status],
    ['State', d.state],
    ['District', d.district],
    ['Area', d.area],
    ['Billing address', addr(d.billing)],
    ['Shipping address', addr(d.shipping)],
    ['Shop location', `${d.shop.latitude}, ${d.shop.longitude}, ${d.shop.address}`],
    ['Bank', `${b.bankName}, ${b.accountType}, ${b.ifsc}`]
  ];

  // O06 names three tabs. The other six tabs have no name in screen_details.md.
  const tabs = `
    <div class="tabs">
      <span class="tab active">Profile</span>
      <span class="tab" data-not-defined="The Connections tab content is not defined in screen_details.md.">Connections</span>
      <span class="tab" data-not-defined="The Ledger top-ups tab content is not defined in screen_details.md.">Ledger top-ups</span>
      ${'<span class="tab" data-not-defined="This tab name and content are not defined in screen_details.md.">Not defined</span>'.repeat(6)}
    </div>`;

  return `
    ${pageHead(d.firm, button('edit', { toast: 'edit would open Add / Edit Dealer (O05) for this dealer.' }))}
    ${tabs}
    <div class="card row">${profile.map(([label, value]) => field(label, value)).join('')}</div>`;
}
