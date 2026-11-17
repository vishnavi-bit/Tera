// Header and menu behaviour, delegated once so it survives screen re-renders.
import { toast, notDefined } from './ui.js?v=5';
import { announce } from './spec.js?v=5';

const panel = (name) => document.querySelector(`[data-ui-panel="${name}"]`);
const trigger = (name) => document.querySelector(`[data-ui="toggle-${name}"]`);

function setOpen(name, open) {
  panel(name)?.toggleAttribute('hidden', !open);
  trigger(name)?.setAttribute('aria-expanded', String(open));
}
const closePanels = () => ['bell', 'user'].forEach((n) => setOpen(n, false));

export function installShellBehavior() {
  document.addEventListener('click', (e) => {
    const ui = e.target.closest('[data-ui]')?.dataset.ui;
    const action = e.target.closest('[data-action]');
    const shell = document.querySelector('.shell');

    if (ui === 'toggle-bell' || ui === 'toggle-user') {
      const name = ui.slice(7);
      const open = panel(name)?.hasAttribute('hidden');
      closePanels();
      setOpen(name, open);
      return;
    }
    if (!e.target.closest('.bell-wrap, .user-wrap')) closePanels();

    if (ui === 'toggle-menu') {
      shell.classList.toggle(matchMedia('(max-width: 768px)').matches ? 'nav-open' : 'nav-collapsed');
    } else if (ui === 'close-drawer') shell.classList.remove('nav-open');

    const unbuilt = e.target.closest('[data-spec-code]');
    if (unbuilt) {
      document.querySelector('.shell').classList.remove('nav-open');
      return announce(unbuilt.dataset.specCode);
    }

    switch (action?.dataset.action) {
      case 'open-notification':
        closePanels();
        toast(`Would open ${action.dataset.link} and delete this notification.`);
        break;
      case 'mark-all-read':
        toast('All notifications would be marked as read.');
        break;
      case 'show-all-notifications':
        closePanels();
        notDefined('A "show all notifications" page is not defined in screen_details.md. Only the header notifications panel (D00/O00) is described.');
        break;
      case 'open-settings':
        closePanels();
        toast('Settings would open.');
        break;
      case 'logout':
        closePanels();
        toast('You would be returned to the login screen.');
        break;
    }
  });
  document.addEventListener('keydown', (e) => e.key === 'Escape' && closePanels());
}
