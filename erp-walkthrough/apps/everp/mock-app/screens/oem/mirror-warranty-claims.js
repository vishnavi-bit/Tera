import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { select } from '../../shared/form.js?v=5';

export const meta = { code: 'O11', name: 'Dealer → Warranty Claims', side: 'oem', icon: 'warranty', nav: 'Dealers', roles: ['oem-super-admin'] };

// Spec: period filter and "claims by product". Period options and the chart are not defined.
export function render({ data }) {
  const byProduct = data.claimsByProduct.map((p) => [esc(p.product), p.count]);
  const claims = data.warrantyClaims.map((c) => [esc(c.id), esc(c.customer), esc(c.chassis), esc(c.product), esc(c.raisedOn), esc(c.status)]);
  return `
    ${pageHead('Warranty Claims')}
    <p class="note">Dealer: ${esc(data.dealer.name)}</p>
    <div class="card row">
      ${select('Period', [], undefined, { notDefined: 'The period filter options are not defined in screen_details.md.' })}
    </div>
    <h2>Claims by product</h2>
    <p class="note"><button class="btn" data-not-defined="The claims-by-product chart is not defined in screen_details.md. The table below is the walkthrough's own view of the same data.">Chart</button></p>
    ${table(['Product', 'Claims'], byProduct)}
    <h2>Claims</h2>
    ${table(['Claim ID', 'Customer', 'Chassis', 'Product', 'Raised on', 'Status'], claims)}`;
}
