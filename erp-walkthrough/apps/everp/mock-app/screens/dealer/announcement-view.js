import { pageHead, field, esc } from '../../shared/components.js?v=5';
import { button } from '../../shared/form.js?v=5';

export const meta = { code: 'D06', name: 'Announcement View', side: 'dealer', icon: 'orders', nav: 'Announcements', roles: ['dealer-owner'] };

// Spec: detail screen with buttons full screen and download. Read only. Download target is not defined (gap list).
export function render({ data }) {
  const a = data.announcement;
  return `
    ${pageHead(a.title, `
      ${button('full screen', { toast: 'full screen would show the announcement full screen.' })}
      ${button('download', { toast: `download would download ${a.attachmentFile}.` })}`)}
    <div class="card">
      ${field('Title', a.title)}
      <p class="note">${esc(a.description)}</p>
      ${field('Attachment', a.attachmentFile)}
    </div>`;
}
