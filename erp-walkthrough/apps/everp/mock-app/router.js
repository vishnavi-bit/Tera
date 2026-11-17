import { initStore, getState } from './store.js?v=5';
import { SCREENS, loadScreen } from './registry.js?v=11';
import { renderShell, renderDirectory } from './shared/shell.js?v=5';
import { installBridge } from './bridge.js?v=5';
import { loadSpec, menuFor } from './shared/spec.js?v=5';
import { installShellBehavior } from './shared/shell-behavior.js?v=5';
import { installControls } from './shared/controls.js?v=5';

const params = new URLSearchParams(location.search);
const embedded = params.get('embedded') === '1';
const app = document.getElementById('app');

const users = await (await fetch(new URL('./mock-data/users.json', import.meta.url), { cache: 'no-store' })).json();
await loadSpec();
await initStore({ reset: params.get('reset') === '1' });

const notifications = await (await fetch(new URL('./mock-data/notifications.json', import.meta.url))).json();
installShellBehavior();
installControls();

let current = null;
installBridge(() => current);

async function show(code, userId) {
  const screen = await loadScreen(code);
  const { meta } = screen;
  const id = userId && users[userId] ? userId : meta.roles[0];
  const user = users[id];

  const navItems = await navFor(user.side);
  const body = screen.render({ user, data: getState(), params });
  current = code;
  document.title = `${meta.name} - Tera EV`;
  app.innerHTML = renderShell({ user, body, navItems, activeCode: code, embedded, notifications: notifications[user.side] });
}

async function navFor(side) {
  const built = [];
  for (const code of Object.keys(SCREENS)) if ((await loadScreen(code)).meta.side === side) built.push(code);
  return menuFor(side, built);
}

async function showDirectory() {
  const list = [];
  for (const code of Object.keys(SCREENS)) list.push((await loadScreen(code)).meta);
  app.innerHTML = renderDirectory(list);
}

const first = params.get('screen');
if (first) await show(first, params.get('user'));
else await showDirectory();

// Standalone browsing only: the walkthrough hosts the app with embedded=1 and drives navigation itself.
if (!embedded) {
  document.addEventListener('click', async (event) => {
    const el = event.target.closest('[data-goto]');
    if (!el) return;
    const url = new URL(location.href);
    url.searchParams.set('screen', el.dataset.goto);
    url.searchParams.delete('user');
    history.pushState({}, '', url);
    await show(el.dataset.goto);
  });
  addEventListener('popstate', () => location.reload());
}

