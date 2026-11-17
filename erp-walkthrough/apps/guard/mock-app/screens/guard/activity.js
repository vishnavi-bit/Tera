import { esc, badge } from '../../shared/components.js?v=1';
import { button } from '../../shared/form.js?v=1';

export const meta = { code: 'S09', name: 'Recent Activity / Help', side: 'guard', icon: 'activity', nav: 'Activity', roles: ['guard-gate1'] };

export function render({ data }) {
  return `
    <div class="page-head"><h1>Recent activity</h1>${badge(data.gate.name, 'neutral')}</div>
    ${data.activity
      .map(
        (e) => `<div class="card visit">
          <div class="visit-top"><strong>${esc(e.what)}</strong><small>${esc(e.time)}</small></div>
          <small>${esc(e.detail)}</small>
        </div>`
      )
      .join('')}
    <h2>Help</h2>
    ${button('Call supervisor', { notDefined: 'S09 asks for a help or escalation route but does not say who the guard reaches or how.' }).replace('class="btn', 'class="btn btn-block')}
    <p class="note">Shows entry, exit, approval and parcel events for this gate (demo data).</p>`;
}
