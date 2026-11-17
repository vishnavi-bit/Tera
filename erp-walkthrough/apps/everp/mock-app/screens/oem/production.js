import { pageHead, table, badge, statusTone, esc } from '../../shared/components.js?v=5';
import { button, input, select } from '../../shared/form.js?v=5';

export const meta = { code: 'O18', name: 'Production', side: 'oem', icon: 'production', nav: 'Production', roles: ['oem-production-mgr'] };

// Spec: pick date / unit, update produced count. Production date comes from the seed.
export function render({ data }) {
  const o = data.order;
  const p = o.production;
  return `
    ${pageHead('Production', button('Update produced count', { action: 'update-produced-count', primary: true }))}
    <div class="card row">
      ${input('Date', o.productionDate, { type: 'date', toast: 'Date would filter the production plan.' })}
      ${select('Unit', [data.mu.name], data.mu.name, { toast: 'Unit would filter the production plan.' })}
    </div>
    ${table(['PO', 'Produced / total', 'Production status'], [[
      esc(o.id),
      `<input type="number" value="${p.produced}" style="width:70px" data-toast="Produced count would be saved."> / ${o.qty}`,
      badge(p.status, statusTone(p.status))
    ]])}`;
}
