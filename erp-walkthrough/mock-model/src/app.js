import { session } from './state.js';
import { loadSpec } from './spec.js';
import { showLogin } from './screens/login.js';
import { mountShell } from './shell.js';
import { installBridge } from './bridge.js';

await loadSpec();
const root = document.getElementById('app');
let screenCode = 'login';
installBridge(() => screenCode);

function login() {
  session.user = session.role = null;
  screenCode = 'login';
  showLogin(root, (user, role) => {
    session.user = user;
    session.role = role;
    screenCode = 'shell';
    mountShell(root, { onLogout: login });
  });
}

// ?user=Name&role=Role label signs in directly (used when this app is framed by the walkthrough).
const params = new URLSearchParams(location.search);
const { users } = await (await fetch(new URL('../data/users.json', import.meta.url))).json();
const auto = users.find((u) => u.id.toLowerCase() === (params.get('user') ?? '').toLowerCase());
if (auto) {
  session.user = auto;
  session.role = auto.roles.find((r) => r.label === params.get('role')) ?? auto.roles[0];
  screenCode = 'shell';
  mountShell(root, { onLogout: login });
} else login();
