import { pageHead, field, badge, esc } from '../../shared/components.js?v=5';
import { button, input } from '../../shared/form.js?v=5';

export const meta = { code: 'O34', name: 'MU View', side: 'oem', icon: 'inventory', nav: 'Manufacturing Unit', roles: ['oem-super-admin'] };

// Spec: buttons edit, MU stock, dispatch plan, load plan, containers, production, connect a dealer. Field: Search any dealer (dealerId, required).
// The details shown are the O33 field labels (assumption). Load plan and containers are deferred (O37, O38): toasts only.
export function render({ data }) {
  const u = data.manufacturingUnits.unit;
  const c = data.dealerConnect;
  return `
    ${pageHead(u.unitName, `
      ${button('edit', { toast: 'edit would open MU Create / Edit (O33) for this unit.' })}
      ${button('MU stock', { action: 'mu-stock', goto: 'O35' })}
      ${button('dispatch plan', { action: 'dispatch-plan', goto: 'O36' })}
      ${button('load plan', { toast: 'load plan is deferred (O37) and is not shown in this walkthrough.' })}
      ${button('containers', { toast: 'containers are deferred (O38) and are not shown in this walkthrough.' })}
      ${button('production', { toast: 'production would open the production view for this unit. The spec does not say where it goes.' })}`)}
    <div class="card row">
      ${field('Unit Name', u.unitName)}
      ${field('State', u.state)}
      ${field('Production Unit Head', u.productionHead)}
      ${field('Address', u.address)}
      ${field('GST No', u.gstNo)}
      ${field('Account No', u.accountNumber)}
      ${field('IFSC Code', u.ifscCode)}
      ${field('A/c Holder Name', u.accountHolderName)}
      ${field('Bank Branch', u.bankBranch)}
      ${field('Phone No', u.phoneNo)}
      ${field('City', u.city)}
      ${field('Email', u.email)}
      ${field('Pincode', u.pincode)}
      ${field('Latitude / Longitude', `${u.latitude} / ${u.longitude}`)}
    </div>
    <div class="card row" style="margin-top:14px">
      ${input('Search any dealer', c.search, { required: true, toast: 'Search any dealer would move the dealer to this unit.' })}
      ${badge(c.alreadyConnected ? 'already connected' : 'not connected', c.alreadyConnected ? 'good' : 'neutral')}
      ${button('connect a dealer', { action: 'connect-dealer', primary: true })}
    </div>`;
}
