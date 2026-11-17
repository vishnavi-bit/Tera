import { pageHead } from '../../shared/components.js?v=5';
import { input, button } from '../../shared/form.js?v=5';

export const meta = { code: 'D03', name: 'Shop Location Prompt', side: 'dealer', icon: 'store', nav: 'Shop location', roles: ['dealer-owner'] };

export function render({ data }) {
  const s = data.newDealer.shop;
  return `
    ${pageHead('Shop location')}
    <div class="card">
      <div class="page-actions" style="margin-bottom:12px">
        ${button('Use my current location', { toast: 'Use my current location would fill Latitude and Longitude from the browser.' })}
      </div>
      <div class="row">
        ${input('Latitude', s.latitude, { type: 'number', toast: 'Latitude would be saved as the shop location.' })}
        ${input('Longitude', s.longitude, { type: 'number', toast: 'Longitude would be saved as the shop location.' })}
        ${input('Address', s.address, { toast: 'Address would be saved as the shop location.' })}
      </div>
    </div>
    <div class="page-actions">
      ${button('save current location', { action: 'save-location', primary: true })}
      ${button('not now', { action: 'skip-location' })}
    </div>`;
}
