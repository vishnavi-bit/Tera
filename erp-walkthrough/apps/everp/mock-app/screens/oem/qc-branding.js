import { pageHead } from '../../shared/components.js?v=5';

// Not defined in screen_details.md (N06 is a new feature with no fields, buttons or rules).
// The walkthrough shows the Not defined alert in the sequence instead of a screen.
export const meta = { code: 'N06', name: 'QC Branding / Packaging Requisition', side: 'oem', icon: 'inventory', nav: null, roles: ['oem-production-mgr'] };

export function render() {
  return pageHead(meta.name);
}
