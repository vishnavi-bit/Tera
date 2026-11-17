import { esc, badge } from '../../shared/components.js?v=1';
import { button } from '../../shared/form.js?v=1';

export const meta = { code: 'R05', name: 'Guest Pass', side: 'resident', icon: 'scan', nav: 'Pass', roles: ['resident-a1204'] };

const block = (html) => html.replace('class="btn', 'class="btn btn-block');

// A made-up pattern, not a real QR code.
function demoQr() {
  const n = 11;
  let cells = '';
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const finder = (x < 3 && y < 3) || (x > n - 4 && y < 3) || (x < 3 && y > n - 4);
      if (finder || (x * 7 + y * 13 + x * y) % 3 === 0) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
  return `<svg class="qr" viewBox="0 0 ${n} ${n}" width="180" height="180" role="img" aria-label="Demo QR pattern">${cells}</svg>`;
}

export function render({ data }) {
  const g = data.guest;
  return `
    <div class="page-head"><h1>Guest pass</h1>${badge('Pre-approved', 'good')}</div>
    <div class="card" style="text-align:center">${demoQr()}<p class="note">Demo pattern. Not a real QR code and it does not grant access.</p></div>
    <div class="card kv">
      <div><span>Guest</span><strong>${esc(g.name)}</strong></div>
      <div><span>Category</span><strong>${esc(g.category)}</strong></div>
      <div><span>Pass</span><strong>${esc(g.passId)}</strong></div>
      <div><span>Valid</span><strong>${esc(g.date)} until ${esc(g.validUntil)}</strong></div>
      <div><span>Visiting</span><strong>${esc(data.resident.flat)} · ${esc(data.resident.name)}</strong></div>
    </div>
    <div class="actions">
      ${block(button('Share pass', { action: 'share-pass', primary: true }))}
      ${block(button('Revoke pass', { toast: 'Revoke pass would cancel the pass so the gate scanner shows it as not valid.' }))}
    </div>`;
}
