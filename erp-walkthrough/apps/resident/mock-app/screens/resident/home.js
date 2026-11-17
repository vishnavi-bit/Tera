import { esc, badge } from '../../shared/components.js?v=1';
import { icon } from '../../shared/icons.js?v=2';

export const meta = { code: 'R01', name: 'Home', side: 'resident', icon: 'home', nav: 'Home', roles: ['resident-a1204'] };

export function render({ data }) {
  return `
    <section class="hero">
      <small>Flat</small>
      <h1>${esc(data.resident.flat)}</h1>
      <small>${esc(data.resident.name)}</small>
    </section>
    <div class="counts">
      <div class="count"><strong>${esc(data.counts.pending)}</strong><span>Waiting for your approval</span></div>
      <div class="count"><strong>${esc(data.counts.parcels)}</strong><span>Parcels at the gate</span></div>
    </div>
    <div class="tiles">
      <button class="tile tile-primary" data-goto="R02">${icon('hourglass', 28)}Approvals</button>
      <button class="tile" data-goto="R04">${icon('userplus', 28)}Pre-approve a guest</button>
      <button class="tile" data-goto="R06">${icon('activity', 28)}Visitor history</button>
      <button class="tile" data-goto="R07">${icon('parcel', 28)}Parcels</button>
    </div>
    <p class="note">${badge('Demo data', 'warn')} Fictional resident, flat and visitors. This is a proposal drawn from the Guard App documents, not a signed-off specification.</p>`;
}
