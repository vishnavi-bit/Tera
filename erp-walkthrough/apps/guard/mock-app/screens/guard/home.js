import { esc, badge } from '../../shared/components.js?v=1';
import { icon } from '../../shared/icons.js?v=2';

export const meta = { code: 'S02', name: 'Home / Gate Dashboard', side: 'guard', icon: 'home', nav: 'Home', roles: ['guard-gate1'] };

export function render({ data }) {
  return `
    <section class="hero">
      <small>Active gate</small>
      <h1>${esc(data.gate.name)}</h1>
      <small>${esc(data.guard.name)} · ${esc(data.guard.shift)}</small>
    </section>
    <div class="counts">
      <div class="count"><strong>${esc(data.counts.inside)}</strong><span>Visitors inside</span></div>
      <div class="count"><strong>${esc(data.counts.pending)}</strong><span>Pending approvals</span></div>
    </div>
    <div class="tiles">
      <button class="tile tile-primary" data-goto="S03">${icon('scan', 28)}Scan Pass</button>
      <button class="tile" data-goto="S04">${icon('userplus', 28)}Register Visitor</button>
      <button class="tile" data-goto="S05">${icon('hourglass', 28)}Pending Approvals</button>
      <button class="tile" data-goto="S07">${icon('exit', 28)}Check Out</button>
      <button class="tile" data-goto="S08">${icon('parcel', 28)}Delivery / Parcel</button>
    </div>
    <p class="note">${badge('Demo data', 'warn')} Fictional names and flats. No RFID reader or gate is connected; this app does not open the gate.</p>`;
}
