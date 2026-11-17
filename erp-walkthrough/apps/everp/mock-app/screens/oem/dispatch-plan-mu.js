import { pageHead, esc } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'O36', name: 'MU Dispatch Plan (ETA)', side: 'oem', icon: 'orders', nav: 'Manufacturing Unit', roles: ['oem-logistics-mgr'] };

// Spec: month calendar with dispatch, build and component-short markers, and month navigation.
// The calendar grid, markers and month come from the seed. No dates or markers are calculated.
// Roles: ADM, DH, DM in the spec; Dhivyesh is used as an assumption (see gap list).
export function render({ data }) {
  const p = data.dispatchPlan;
  const head = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const cells = p.weeks.map((week) => `
    <tr>${week.map((d) => `
      <td style="min-width:44px;height:44px;text-align:center">
        ${d.day === null ? '' : `<span>${esc(d.day)}</span>`}
        ${d.marker ? `<div class="note">${esc(d.marker)}</div>` : ''}
      </td>`).join('')}
    </tr>`).join('');
  return `
    ${pageHead('MU Dispatch Plan', button('month navigation', { toast: 'month navigation would move the calendar to another month.' }))}
    <p class="note">${esc(p.month)}</p>
    <div class="scroll">
      <table class="grid">
        <thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
        <tbody>${cells}</tbody>
      </table>
    </div>`;
}
