import { esc, badge } from '../../shared/components.js?v=1';
import { button } from '../../shared/form.js?v=1';

export const meta = { code: 'R02', name: 'Approvals', side: 'resident', icon: 'hourglass', nav: 'Approvals', roles: ['resident-a1204'] };

export function render({ data }) {
  const r = data.request;
  const head = `<div class="page-head"><h1>Approvals</h1>${badge(`${data.counts.pending} waiting`, data.counts.pending ? 'warn' : 'neutral')}</div>`;
  if (r.status !== 'pending')
    return `${head}<div class="card"><strong>No visitors waiting</strong>
      <p class="note">When the guard at a gate asks you to approve a visitor, the request shows here.</p></div>`;
  return `${head}
    <div class="card visit">
      <div class="visit-top"><strong>${esc(r.visitor)}</strong>${badge('Pending Approval', 'warn')}</div>
      <small>${esc(r.category)} · ${esc(r.purpose)}</small>
      <small>Asked by ${esc(r.gate)} at ${esc(r.time)}</small>
      ${button('Review', { action: 'open-request', goto: 'R03', primary: true }).replace('class="btn', 'class="btn btn-block')}
    </div>
    <p class="note">You are notified when a guard sends a request. If you do not answer, the guard does not let the visitor in.</p>`;
}
