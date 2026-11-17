import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { select, button } from '../../shared/form.js?v=5';

export const meta = { code: 'O54', name: 'Settings: Audit Logs', side: 'oem', icon: 'settings', nav: 'Audit Logs', roles: ['oem-super-admin'] };

// Spec: list with feature, action and date filters and an expandable diff. No column list and no filter values in the spec.
// The three columns are the filter labels (see gap list).
export function render({ data }) {
  const rows = data.audit.rows.map((r) => [esc(r.feature), esc(r.action), esc(r.date)]);
  return `
    ${pageHead('Settings: Audit Logs', button('expand diff', { action: 'expand-diff', primary: true }))}
    <div class="card row">
      ${select('Feature', ['All'], 'All', { toast: 'Feature filter would show only that feature.' })}
      ${select('Action', ['All'], 'All', { toast: 'Action filter would show only that action.' })}
      ${select('Date', ['All'], 'All', { toast: 'Date filter would show only that date.' })}
    </div>
    ${table(['Feature', 'Action', 'Date'], rows)}`;
}
