import { pageHead, table, esc } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'O15', name: 'Announcements List', side: 'oem', icon: 'orders', nav: 'Announcements', roles: ['oem-super-admin'] };

// Spec: buttons new and open. Roles unkeyed (see gap list). Columns are not defined: Title, Target Dealers and Attachment are assumptions.
export function render({ data }) {
  const a = data.announcement;
  const rows = data.announcements.count > 0
    ? [[esc(a.title), esc(a.target), esc(a.attachmentFile), button('open', { toast: 'open would open the announcement. The spec does not say where it goes.' })]]
    : [];
  return `
    ${pageHead('Announcements', button('new', { action: 'new-announcement', primary: true }))}
    ${table(['Title', 'Target Dealers', 'Attachment', 'Action'], rows)}`;
}
