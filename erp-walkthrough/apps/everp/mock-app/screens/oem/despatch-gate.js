import { pageHead } from '../../shared/components.js?v=5';

// Not defined in screen_details.md (N07 is a new feature with no fields, buttons or rules).
// The walkthrough shows the Not defined alert in the sequence instead of a screen.
export const meta = { code: 'N07', name: 'Despatch - Chassis Validation Gate', side: 'oem', icon: 'orders', nav: null, roles: ['oem-logistics-mgr'] };

export function render() {
  return pageHead(meta.name);
}
