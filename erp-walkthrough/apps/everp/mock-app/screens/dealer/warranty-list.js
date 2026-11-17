import { pageHead, table, badge, esc } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'D37', name: 'Warranty List', side: 'dealer', icon: 'shield', nav: 'Warranty', roles: ['dealer-service', 'dealer-owner'] };

const NOT_DEFINED_DIALOG = 'The select customer by chassis dialog (opened by + on the Warranty List) has no field table in screen_details.md. The walkthrough goes straight to Warranty Claim Create for the customer.';

export function render({ data }) {
  const c = data.claim;
  const rows = c.raised ? [[esc(c.id), esc(data.customer.name), badge(c.status, 'warn')]] : [];

  return `
    ${pageHead('Warranty List', button('+', { notDefined: NOT_DEFINED_DIALOG }))}
    <div class="card row">
      <input placeholder="search" data-toast="search would filter the warranty claims.">
    </div>
    ${table(['Claim ID', 'Customer', 'Status'], rows)}`;
}
