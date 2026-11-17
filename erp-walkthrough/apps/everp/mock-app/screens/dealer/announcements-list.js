import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'D05', name: 'Announcements List', side: 'dealer', icon: 'orders', nav: 'Announcements', roles: ['dealer-owner'] };

// Spec: read-only mirror of the OEM announcements targeted to this MU (R5: all MUs or its own MU). Button: view.
// Columns are not defined: Title, Target Dealers and Attachment are assumptions.
export function render({ data }) {
  const a = data.announcement;
  const visible = data.announcements.count > 0 && (a.target === 'All Manufacturing Units' || a.muName === data.dealer.mu);
  const rows = visible
    ? [[esc(a.title), esc(a.target), esc(a.attachmentFile), button('view', { action: 'view-announcement' })]]
    : [];
  return `
    ${pageHead('Announcements')}
    ${table(['Title', 'Target Dealers', 'Attachment', 'Action'], rows)}`;
}
