import { pageHead } from '../../shared/components.js?v=5';

// Not defined in screen_details.md (N04 is a new feature with no fields, buttons or rules).
// The walkthrough shows the Not defined alert in the sequence instead of a screen.
export const meta = { code: 'N04', name: 'Production Completion & Handover', side: 'oem', icon: 'production', nav: null, roles: ['oem-production-mgr'] };

export function render() {
  return pageHead(meta.name);
}
