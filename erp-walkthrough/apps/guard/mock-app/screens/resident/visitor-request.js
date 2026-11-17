import { esc, badge } from '../../shared/components.js?v=1';
import { button, input } from '../../shared/form.js?v=1';

export const meta = { code: 'R03', name: 'Visitor Request', side: 'resident', icon: 'people', nav: 'Request', roles: ['resident-a1204'] };

const block = (html) => html.replace('class="btn', 'class="btn btn-block');

export function render({ data }) {
  const r = { ...data.visit, gate: data.gate.name, time: data.visit.requestedAt };
  return `
    <div class="page-head"><h1>Visitor at the gate</h1>${badge('Pending Approval', 'warn')}</div>
    <div class="card kv">
      <div><span>Visitor</span><strong>${esc(r.visitor)}</strong></div>
      <div><span>Category</span><strong>${esc(r.category)}</strong></div>
      <div><span>Purpose</span><strong>${esc(r.purpose)}</strong></div>
      <div><span>Gate</span><strong>${esc(r.gate)}</strong></div>
      <div><span>Asked at</span><strong>${esc(r.time)}</strong></div>
      <div><span>Photo</span><strong>Demo photo</strong></div>
    </div>
    ${input('Reason (optional)', '', { notDefined: 'Whether the resident can give a reason, or leave a note for the guard, is not defined.' })}
    <div class="actions">
      ${block(button('Approve', data.visit.residentDecision === 'approved' ? { action: 'approve-visitor', primary: true } : { toast: 'Approve would tell the guard the visitor is approved. This tour rejects.' }))}
      ${block(button('Reject', data.visit.residentDecision === 'rejected' ? { action: 'reject-visitor' } : { toast: 'Reject would tell the guard the visitor is rejected. This tour approves.' })).replace('class="btn btn-block', 'class="btn btn-block btn-danger')}
    </div>
    <p class="note">Your answer goes to the guard at ${esc(r.gate)}. A phone call alone is not approval, so give your answer here.</p>`;
}
