import { initStore, getState } from './store.js?v=1';
import { SCREENS, loadScreen } from './registry.js?v=3';
import { renderShell, renderDirectory } from './shared/shell.js?v=3';
import { installBridge } from './bridge.js?v=1';
import { loadSpec } from './shared/spec.js?v=1';
import { installShellBehavior } from './shared/shell-behavior.js?v=1';
import { installControls } from './shared/controls.js?v=1';

const params = new URLSearchParams(location.search);
const embedded = params.get('embedded') === '1';
const app = document.getElementById('app');

const users = await (await fetch(new URL('./mock-data/users.json', import.meta.url))).json();
await loadSpec();
await initStore({ reset: params.get('reset') === '1' });
installShellBehavior();
installControls();

let current = null;
installBridge(() => current);

async function show(code, userId) {
  const screen = await loadScreen(code);
  const { meta } = screen;
  const id = userId && users[userId] ? userId : meta.roles[0];
  const user = users[id];
  const data = getState();
  const body = screen.render({ user, data, params });
  current = code;
  document.title = `${meta.name} - Residents - Guard`;
  app.innerHTML = renderShell({ user, body, activeCode: code, embedded, data });
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
