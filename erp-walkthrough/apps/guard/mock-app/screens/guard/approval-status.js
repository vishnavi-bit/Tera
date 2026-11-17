import { esc, badge } from '../../shared/components.js?v=1';
import { button } from '../../shared/form.js?v=1';

export const meta = { code: 'S05', name: 'Permission & Approval Status', side: 'guard', icon: 'hourglass', nav: 'Approvals', roles: ['guard-gate1'] };

const block = (html) => html.replace('class="btn', 'class="btn btn-block');
const LABEL = { draft: 'Not sent', pending: 'Pending Approval', approved: 'Approved', rejected: 'Rejected' };
const TONE = { draft: 'neutral', pending: 'warn', approved: 'good', rejected: 'bad' };

export function render({ data }) {
  const v = data.visit;
  const st = v.status;
  const head = `<div class="page-head"><h1>Approval status</h1>${badge(LABEL[st], TONE[st])}</div>`;
  const details = `
    <div class="card kv">
      <div><span>Visitor</span><strong>${esc(v.visitor)}</strong></div>
      <div><span>Category</span><strong>${esc(v.category)}</strong></div>
      <div><span>Visiting</span><strong>${esc(v.flat)} · ${esc(v.resident)}</strong></div>
      <div><span>Purpose</span><strong>${esc(v.purpose)}</strong></div>
      <div><span>Pass / pre-approval</span><strong>None (unlisted visitor)</strong></div>
      <div><span>Resident availability</span><strong>Not supplied (demo)</strong></div>
      <div><span>Decision</span><strong>${badge(LABEL[st], TONE[st])}</strong></div>
      ${st === 'approved' || st === 'rejected' ? `<div><span>Decision source</span><strong>${esc(v.source)}</strong></div>` : ''}
      <div><span>Gate</span><strong>${esc(data.gate.name)}</strong></div>
    </div>`;

  if (v.callOpen)
    return `${head}${details}
      <div class="card">
        <strong>Calling ${esc(v.resident)} (${esc(v.flat)})</strong>
        <p class="note">Ask the resident for an explicit decision. A phone call alone is not approval: record what the resident said.</p>
        <div class="actions">
          ${block(button('Resident approved', { action: 'record-approved', primary: true }))}
          ${block(button('Resident rejected', { toast: 'Resident rejected would record the rejection with source "Phone call" and the guard name.' }))}
        </div>
      </div>`;

  if (st === 'draft')
    return `${head}${details}
      <div class="actions">
        ${block(button('Send approval request', { action: 'send-request', primary: true }))}
        ${block(button('Call resident', { toast: 'Call resident would dial the resident. A call alone is not approval.' }))}
      </div>
      <p class="note">The request goes to the resident through the Resident App. No entry until the resident approves.</p>`;

  if (st === 'pending')
    return `${head}${details}
      <div class="card"><strong>Waiting for ${esc(v.resident)}</strong>
        <p class="note">The resident gets a notification in the Resident App. If there is no answer, the default is no entry.</p></div>
      <div class="actions">
        ${v.phoneFlow ? block(button('Refresh status', { toast: 'Refresh status would check for the resident\'s decision. Still pending in the Resident App.' })) : block(button('Refresh status', { action: 'refresh-status', primary: true }))}
        ${v.phoneFlow ? block(button('Call resident', { action: 'call-resident' })) : block(button('Call resident', { toast: 'Call resident would dial the resident. A call alone is not approval.' }))}
      </div>`;

  return `${head}${details}
    <div class="actions">${block(button('Continue to entry decision', { action: 'continue-entry', goto: 'S06', primary: true }))}</div>
    ${st === 'rejected' ? '<p class="note">A rejected visitor cannot be checked in.</p>' : ''}`;
}
