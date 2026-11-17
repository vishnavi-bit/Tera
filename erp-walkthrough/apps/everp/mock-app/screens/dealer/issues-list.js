import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { button, input, select } from '../../shared/form.js?v=5';

export const meta = { code: 'D36', name: 'Issues List', side: 'dealer', icon: 'orders', nav: null, roles: ['dealer-owner'] };

// Spec: stage filter, search, open PO. Dealer sees stage and outcome only (F8): no review notes are shown.
// Columns: the O42 list columns (assumption, see gap list), with the outcome added for F8.
export function render({ data }) {
  const i = data.issue;
  const row = [
    esc(i.order), esc(data.dealer.name), esc(i.product), esc(i.serial), esc(i.description),
    esc(i.media), esc(i.stage), esc(i.outcome), esc(i.reported),
    button('Open PO', { toast: 'Open PO would open the purchase order (D30).' })
  ];
  return `
    ${pageHead('Issues List')}
    <div class="card row">
      ${select('Stage', [i.stage], i.stage, { toast: 'Stage filter would show only issues at the chosen stage.' })}
      ${input('Search', '', { placeholder: 'Search', toast: 'Search would find an issue by PO, product or serial.' })}
    </div>
    ${table(['Order', 'Dealer', 'Product', 'Serial / chassis', 'Issue', 'Media', 'Stage', 'Outcome', 'Reported', 'Action'], [row])}`;
}
