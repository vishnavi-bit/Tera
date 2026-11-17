import { esc } from './components.js?v=1';
import { icon } from './icons.js?v=2';

// The bottom bar: the screens a resident moves between.
const TABS = [
  { code: 'R01', label: 'Home', icon: 'home' },
  { code: 'R02', label: 'Approvals', icon: 'hourglass' },
  { code: 'R04', label: 'Guests', icon: 'userplus' },
  { code: 'R06', label: 'History', icon: 'activity' },
  { code: 'R07', label: 'Parcels', icon: 'parcel' }
];

export function renderShell({ user, body, activeCode, embedded, data }) {
  const tabs = TABS.map(
    (t) => `<button class="tab-item${t.code === activeCode ? ' active' : ''}" data-goto="${t.code}">${icon(t.icon)}<span>${esc(t.label)}</span></button>`
  ).join('');
  return `
    <div class="shell">
      <header class="topbar">
        <span class="gate-pill">${esc(data.resident.flat)}</span>
        <div class="who"><strong>${esc(user.name)}</strong><small>${esc(user.org)}</small></div>
        <span class="conn" title="Connection status (demo)"><i></i>Online (demo)</span>
      </header>
      <main class="content">${body}</main>
      <nav class="tabbar" aria-label="Main">${tabs}</nav>
    </div>`;
}

export function renderDirectory(screens) {
  const rows = screens
    .map((s) => `<li><code>${esc(s.code)}</code> <a href="?screen=${esc(s.code)}">${esc(s.name)}</a></li>`)
    .join('');
  return `<div class="directory"><h1>Residents - Resident App (mock)</h1>
    <p>Standalone view of every mock screen. Pick one to open it. Demo data only.</p>
    <ul>${rows}</ul><p><a href="?reset=1">Reset mock data</a></p></div>`;
}
