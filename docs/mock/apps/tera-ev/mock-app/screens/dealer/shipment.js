import { pageHead, esc, badge, statusTone } from '../../shared/components.js?v=1';
import { input, button } from '../../shared/form.js?v=1';

export const meta = { code: 'S06', name: 'Dealer confirms delivery or reports issue', side: 'dealer', icon: 'check', nav: 'Deliveries', roles: ['dealer-owner'] };

export function render({ data }) {
  const o = data.order;
  const s = data.shipment;
  return `
    ${pageHead(`Purchase > ${esc(o.id)} > Shipment`)}
    <div class="card">
      <p>${s.dispatched ? `Shipment dispatched ${esc(s.date)}, ${s.units} units` : 'Not dispatched yet'}</p>
      <p>Lines: ${esc(s.lines)}</p>
      <p>Order status: ${badge(o.status, statusTone(o.status))}</p>
      <div class="page-actions">${button('Confirm receipt', { action: 'confirm-receipt', primary: true })}</div>
    </div>
    <div class="card">
      ${input('Reason for rejection', '', { placeholder: 'Reason', toast: 'Rejection reason would be saved with the shipment.' })}
      <div class="page-actions">
        ${button('Reject shipment', { toast: 'Reject shipment would return the shipment with the reason.' })}
        ${button('Report issue', { toast: 'Report issue would open an issue record for this shipment.' })}
      </div>
    </div>`;
}
