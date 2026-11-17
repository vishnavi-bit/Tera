import { openDialog, toast, esc } from '../ui.js';

// Field from screen_details.md O03: "Edit (slogan)", dashboardSlogan, text, PATCH /accounts/oem/dashboard-slogan.
export function openEditSlogan(current) {
  const d = openDialog({
    title: 'Edit slogan',
    body: `<label class="field"><span>Slogan</span><input name="dashboardSlogan" value="${esc(current)}"></label>`,
    actions: [
      { label: 'Cancel', action: 'cancel-slogan' },
      { label: 'Save', action: 'save-slogan', primary: true }
    ]
  });
  d.el.querySelector('[data-action="cancel-slogan"]').onclick = d.close;
  d.el.querySelector('[data-action="save-slogan"]').onclick = () => {
    d.close();
    toast('The slogan would be saved (PATCH /accounts/oem/dashboard-slogan). Nothing is saved in the mock.');
  };
}
