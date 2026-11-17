import { pageHead, table, esc, badge, statusTone } from '../../shared/components.js?v=5';
import { button, input } from '../../shared/form.js?v=5';

export const meta = { code: 'O42', name: 'Issues', side: 'oem', icon: 'orders', nav: 'Issues', roles: ['oem-inventory-mgr', 'oem-super-admin'] };

// Spec: stage tabs, approve / decline (manager), approve / decline (OEM), settle with money, replace,
// mark replacement dispatched, mark resolved / reject claim. Columns: order, dealer, product, serial / chassis,
// issue, media, stage, reported, action. Stage names are endpoint-based assumptions (see gap list).
const STAGES = ['Manager review', 'OEM review', 'Settlement', 'Replacement dispatched', 'Resolved', 'Rejected'];

export function render({ data }) {
  const i = data.issue;
  const tabs = STAGES.map((s) => `<span class="tab${s === i.stage ? ' active' : ''}" data-toast="${esc(s)} tab would show the issues at this stage.">${esc(s)}</span>`).join('');
  const actions = `
    ${button('Approve (manager)', { action: 'manager-approve', primary: true })}
    ${button('Decline (manager)', { toast: 'Decline (manager) would send the issue back with a reason.' })}
    ${button('Approve (OEM)', { action: 'oem-approve', primary: true })}
    ${button('Decline (OEM)', { toast: 'Decline (OEM) would send the issue back with a reason.' })}`;
  const row = [
    esc(i.order), esc(data.dealer.name), esc(i.product), esc(i.serial), esc(i.description),
    esc(i.media), badge(i.stage, statusTone(i.stage)), esc(i.reported), actions
  ];
  return `
    ${pageHead('Issues')}
    <div class="tabs">${tabs}</div>
    ${table(['Order', 'Dealer', 'Product', 'Serial / chassis', 'Issue', 'Media', 'Stage', 'Reported', 'Action'], [row])}
    <div class="card" style="margin-top:14px">
      <h2>Settle with money</h2>
      <div class="row">
        ${input('Compensation amount (₹)', data.issue.compensation, { type: 'number', required: true, toast: 'Compensation amount would be saved.' })}
        ${input('Transaction ID', data.issue.transactionId, { required: true, toast: 'Transaction ID would be saved.' })}
      </div>
      <div class="page-actions" style="margin-top:12px">${button('Settle with money', { action: 'settle-money', primary: true })}</div>
    </div>
    <div class="card" style="margin-top:14px">
      <h2>Other actions</h2>
      <label class="field"><span>Reason (required on decline or reject)</span><textarea data-toast="Reason would be saved with the decision."></textarea></label>
      <div class="page-actions" style="margin-top:12px">
        ${button('Replace', { toast: 'Replace would record a replacement for the issue.' })}
        ${button('Mark replacement dispatched', { toast: 'Mark replacement dispatched would record that the replacement was sent.' })}
        ${button('Mark resolved', { toast: 'Mark resolved would close the issue as resolved.' })}
        ${button('Reject claim', { toast: 'Reject claim would reject the issue and needs a reason.' })}
      </div>
    </div>`;
}
