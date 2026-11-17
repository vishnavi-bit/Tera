import { pageHead, esc, badge, statusTone, inr } from '../../shared/components.js?v=1';
import { input, button } from '../../shared/form.js?v=1';

export const meta = {
  code: 'S03',
  name: 'OEM approves order and verifies payment',
  side: 'oem',
  icon: 'check',
  nav: 'Approvals',
  roles: ['oem-sales', 'oem-accounts'],
};

export function render({ data }) {
  const o = data.order;
  const p = data.payment;
  return `
    ${pageHead(`Orders > ${esc(o.id)}`)}
    <div class="card">
      <p>Status: ${badge(o.status, statusTone(o.status))}</p>
      <p>Advance: ${inr(o.advanceRequired)} (30%)</p>
      <p>Payment: Txn ${esc(p.txnId || '-')} - ${badge(p.status, statusTone(p.status))}</p>
    </div>
    <div class="card">
      <h2>Order</h2>
      <div class="page-actions">
        ${button('Approve', { action: 'approve-order', primary: true })}
        ${button('Reject order', { toast: 'Reject order would reject PO-1042 and ask for remarks.' })}
      </div>
      ${input('Remarks on rejection', '', { placeholder: 'Remarks' })}
    </div>
    <div class="card">
      <h2>Payment</h2>
      <div class="page-actions">
        ${button('Verify payment', { action: 'verify-payment', primary: true })}
        ${button('Reject payment', { toast: 'Reject payment would ask for a reason and return the payment to the dealer.' })}
      </div>
      <p>Surplus credited to dealer ledger: ${inr(data.ledger.surplus)}</p>
    </div>`;
}
