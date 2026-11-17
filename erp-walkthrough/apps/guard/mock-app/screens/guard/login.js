import { esc, badge } from '../../shared/components.js?v=1';
import { button, input } from '../../shared/form.js?v=1';

export const meta = { code: 'S01', name: 'Login / Start Shift', side: 'guard', icon: 'home', nav: 'Login', roles: ['guard-gate1'] };

const block = (html) => html.replace('class="btn', 'class="btn btn-block');

export function render({ data }) {
  const started = data.guard.shift !== 'Not started';
  return `
    <div class="page-head"><h1>Start shift</h1>${badge(started ? 'On shift' : 'Shift not started', started ? 'good' : 'neutral')}</div>
    <div class="card kv">
      <div><span>Guard</span><strong>${esc(data.guard.name)}</strong></div>
      <div><span>Assigned gate</span><strong>${esc(data.gate.name)}</strong></div>
      <div><span>Shift</span><strong>${esc(data.guard.shift)}</strong></div>
    </div>
    ${input('Sign-in', '••••', { type: 'password', notDefined: 'How the guard signs in (PIN, card, biometric or another method) is not defined. S01 only says "Guard signs in securely".' })}
    <div class="actions">
      ${block(button('Start shift', { action: 'start-shift', primary: true }))}
      ${block(button('Request a different gate', { notDefined: 'A guard cannot switch gates unless the administrator permits it (S01), but how the administrator permits it is not defined.' }))}
    </div>
    <p class="note">${badge('Demo data', 'warn')} Fictional guard and gate.</p>`;
}
