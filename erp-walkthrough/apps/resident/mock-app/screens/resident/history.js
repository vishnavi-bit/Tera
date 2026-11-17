import { esc, badge, statusTone } from '../../shared/components.js?v=1';
import { input } from '../../shared/form.js?v=1';

export const meta = { code: 'R06', name: 'Visitor History', side: 'resident', icon: 'activity', nav: 'History', roles: ['resident-a1204'] };

const LABEL = { approved: 'Approved', rejected: 'Rejected', pending: 'Pending Approval' };

const row = (h) => `
  <div class="card visit">
    <div class="visit-top"><strong>${esc(h.visitor)}</strong>${badge(h.status, statusTone(h.status))}</div>
    <small>${esc(h.category)} · ${esc(h.gate)}</small>
    <small>${esc(h.time)}</small>
  </div>`;

export function render({ data }) {
  const r = data.request;
  const list = [...data.history];
  if (r.status !== 'pending')
    list.unshift({ visitor: r.visitor, category: r.category, gate: r.gate, status: LABEL[r.status], time: `Today ${r.decidedAt} · decided in the app` });
  if (data.guest.created)
    list.unshift({ visitor: data.guest.name, category: data.guest.category, gate: 'Pre-approved pass', status: 'Pre-approved', time: `${data.guest.date} until ${data.guest.validUntil}` });
  return `
    <div class="page-head"><h1>Visitor history</h1></div>
    ${input('Search', '', { placeholder: 'Visitor or date', toast: 'Search would filter your visitors by name or date.' })}
    <div style="height:12px"></div>
    ${list.map(row).join('')}
    <p class="note">Shows visits to your flat only. How far back, and which fields a resident may see, is not defined.</p>`;
}
