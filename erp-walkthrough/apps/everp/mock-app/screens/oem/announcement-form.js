import { pageHead, esc } from '../../shared/components.js?v=5';
import { button, input, radios, select } from '../../shared/form.js?v=5';

export const meta = { code: 'O16', name: 'Announcement Create / Edit', side: 'oem', icon: 'orders', nav: 'Announcements', roles: ['oem-super-admin'] };

// Spec: buttons create, edit, stop. Fields: Title, Description, Attachment (None / File (Image / PDF / Video) / Table),
// Target Dealers (All Manufacturing Units / Selected Manufacturing Unit). Required marks are "?" in the spec, shown without a mark.
const ATTACHMENTS = ['None', 'File (Image / PDF / Video)', 'Table'];
const TARGETS = ['All Manufacturing Units', 'Selected Manufacturing Unit'];

export function render({ data }) {
  const a = data.announcement;
  return `
    ${pageHead('Announcement Create / Edit', `
      ${button('create', { action: 'create-announcement', primary: true })}
      ${button('edit', { toast: 'edit would open this announcement for changes.' })}
      ${button('stop', { toast: 'stop would stop this announcement.' })}`)}
    <div class="card">
      ${input('Title', a.title, { toast: 'Title would be saved with the announcement.' })}
      <label class="field"><span>Description</span><textarea data-toast="Description would be saved with the announcement.">${esc(a.description)}</textarea></label>
      ${radios('Attachment', 'attachment', ATTACHMENTS, 'File (Image / PDF / Video)', { toast: 'Attachment type would be chosen for the announcement.' })}
      <input type="file" accept="image/*,application/pdf,video/*" data-toast="The file would be attached to the announcement.">
      <p class="note">${esc(a.attachmentFile)}</p>
      ${select('Target Dealers', TARGETS, 'Selected Manufacturing Unit', { toast: 'Target Dealers would be chosen for the announcement.' })}
      <p class="note">${esc(data.mu.name)}</p>
    </div>`;
}
