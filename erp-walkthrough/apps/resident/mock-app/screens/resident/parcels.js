import { esc, badge } from '../../shared/components.js?v=1';

export const meta = { code: 'R07', name: 'Parcels at the Gate', side: 'resident', icon: 'parcel', nav: 'Parcels', roles: ['resident-a1204'] };

export function render({ data }) {
  const p = data.parcel;
  return `
    <div class="page-head"><h1>Parcels</h1>${badge(`${data.counts.parcels} at the gate`, data.counts.parcels ? 'warn' : 'neutral')}</div>
    <div class="card kv">
      <div><span>Parcel</span><strong>${esc(p.reference)}</strong></div>
      <div><span>From</span><strong>${esc(p.company)}</strong></div>
      <div><span>Received</span><strong>${esc(p.received)} · ${esc(p.gate)}</strong></div>
      <div><span>Status</span><strong>${badge('Held at gate', 'warn')}</strong></div>
    </div>
    <p class="note">The delivery person left the parcel at the gate and did not enter the society. Collect it from ${esc(p.gate)}; the guard records the handover.</p>`;
}
