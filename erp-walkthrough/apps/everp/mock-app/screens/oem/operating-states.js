import { pageHead } from '../../shared/components.js?v=5';
import { select, button } from '../../shared/form.js?v=5';

export const meta = { code: 'O50', name: 'Settings: Operating States', side: 'oem', icon: 'settings', nav: 'Operating states', roles: ['oem-super-admin'] };

export function render({ data }) {
  return `
    ${pageHead('Settings: Operating States')}
    <div class="card row">
      ${data.operatingStates
        .map((s) => select('State', data.lists.states, s, { required: true, toast: 'State would be saved to the operating states.' }))
        .join('')}
      <div class="page-actions">
        ${button('add state', { toast: 'add state would add another State row.' })}
        ${button('update states', { action: 'update-states', primary: true })}
      </div>
    </div>`;
}
