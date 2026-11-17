import { pageHead, esc } from '../../shared/components.js?v=5';
import { button, input, radios, select } from '../../shared/form.js?v=5';

export const meta = { code: 'D27', name: 'Inventory Issues', side: 'dealer', icon: 'inventory', nav: null, roles: ['dealer-owner'] };

// Spec: button "new issue"; dialog fields Type (Spare / Accessory), Select Spare (Motor / Battery / Controller / Accessories),
// Title, Description, File (preview). The spec defines no submit control and no link to O42.
const SPARES = ['Motor', 'Battery', 'Controller', 'Accessories'];

export function render({ data }) {
  return `
    ${pageHead('Inventory Issues', button('New issue', { toast: 'New issue would open the issue dialog.' }))}
    <div class="card">
      <h2>New issue</h2>
      ${radios('Type', 'issue-type', ['Spare', 'Accessory'], undefined, { toast: 'Type would be chosen for the issue.' })}
      ${select('Select Spare', SPARES, SPARES[0], { toast: 'Spare would be chosen for the issue.' })}
      ${input('Title', '', { toast: 'Title would be saved with the issue.' })}
      <label class="field"><span>Description</span><textarea data-toast="Description would be saved with the issue."></textarea></label>
      <label class="field"><span>File</span><input type="file" accept="image/*,application/pdf" data-toast="File would be attached and previewed."></label>
    </div>
    <p class="note">Dealer ${esc(data.dealer.name)}</p>`;
}
