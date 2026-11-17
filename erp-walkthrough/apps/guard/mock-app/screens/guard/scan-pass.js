import { esc, badge } from '../../shared/components.js?v=1';
import { icon } from '../../shared/icons.js?v=2';
import { button } from '../../shared/form.js?v=1';

export const meta = { code: 'S03', name: 'Scan Visitor Pass', side: 'guard', icon: 'scan', nav: 'Scan', roles: ['guard-gate1'] };

export function render({ data }) {
  if (data.scan.result === 'valid') {
    const p = data.pass;
    return `
      <div class="result result-good">${icon('check', 40)}<strong>VALID</strong><span>Pass found and in date</span></div>
      <div class="card kv">
        <div><span>Visitor</span><strong>${esc(p.visitor)}</strong></div>
        <div><span>Category</span><strong>${esc(p.category)}</strong></div>
        <div><span>Visiting</span><strong>${esc(p.flat)} · ${esc(p.resident)}</strong></div>
        <div><span>Pass</span><strong>${esc(p.id)}</strong></div>
        <div><span>Validity</span><strong>${esc(p.validity)}</strong></div>
        <div><span>Pre-approval</span><strong>${badge(p.status, 'good')}</strong></div>
        <div><span>Gate</span><strong>${esc(data.gate.name)}</strong></div>
      </div>
      <p class="note">Demo pass. It does not grant real access.</p>
      <div class="actions">${button('Continue to entry decision', { action: 'continue-entry', goto: 'S06', primary: true }).replace('class="btn', 'class="btn btn-block')}</div>`;
  }
  return `
    <div class="viewfinder">
      <div>${icon('camera', 44)}<p>Point the camera at the visitor's QR pass</p></div>
    </div>
    <div class="actions">
      ${button('Scan demo pass', { action: 'scan-demo-pass', primary: true }).replace('class="btn', 'class="btn btn-block')}
      <button class="btn btn-block" data-spec-code="S04">Search or register visitor</button>
    </div>
    <p class="note">The camera is simulated. A real build would read the QR code and check it against an authorised record.</p>`;
}
