import { esc, badge } from '../../shared/components.js?v=1';
import { button, input, select } from '../../shared/form.js?v=1';

export const meta = { code: 'S08', name: 'Delivery / Parcel at Gate', side: 'guard', icon: 'parcel', nav: 'Parcels', roles: ['guard-gate1'] };

const block = (html) => html.replace('class="btn', 'class="btn btn-block');

export function render({ data }) {
  const d = data.delivery;
  const head = `<div class="page-head"><h1>Delivery / Parcel</h1>${badge(`${data.parcels.held} held at gate`, data.parcels.held ? 'warn' : 'neutral')}</div>`;

  if (d.status === 'held')
    return `${head}
      <div class="card kv">
        <div><span>Parcel</span><strong>${esc(d.reference)}</strong></div>
        <div><span>Delivery</span><strong>${esc(d.company)}</strong></div>
        <div><span>Recipient flat</span><strong>${esc(d.flat)}</strong></div>
        <div><span>Received</span><strong>${esc(d.received)} · ${esc(data.gate.name)}</strong></div>
        <div><span>Status</span><strong>${badge('Held at gate', 'warn')}</strong></div>
      </div>
      <div class="actions">${block(button('Mark collected', { action: 'mark-collected', primary: true }))}</div>
      <p class="note">The delivery person did not enter the society, so there is no visitor check-out for this parcel.</p>`;

  if (d.status === 'collected')
    return `${head}
      <div class="card kv">
        <div><span>Parcel</span><strong>${esc(d.reference)}</strong></div>
        <div><span>Recipient flat</span><strong>${esc(d.flat)}</strong></div>
        <div><span>Status</span><strong>${badge('Collected', 'good')}</strong></div>
      </div>`;

  return `${head}
    <div class="card">
      <div class="row">
        ${input('Delivery company / person', d.company, { toast: 'Delivery company / person would be saved with the parcel.' })}
        ${input('Recipient flat', d.flat, { toast: 'Recipient flat would be saved with the parcel.' })}
        ${input('Parcel reference', d.reference, { toast: 'Parcel reference would be saved with the parcel.' })}
        ${input('Time received', d.received, { toast: 'Time received would be saved with the parcel.' })}
        ${select('Holding', ['Held at gate', 'Handed over at gate'], 'Held at gate', { toast: 'Holding would be saved with the parcel.' })}
      </div>
      ${block(button('Take parcel photo', { toast: 'Take parcel photo would open the camera. A photo is required only if the society policy says so.' }))}
    </div>
    <div class="actions">${block(button('Record delivery', { action: 'record-delivery', primary: true }))}</div>
    <p class="note">Gate handover is separate from visitor entry. Which delivery types may enter the society is not defined.</p>`;
}
