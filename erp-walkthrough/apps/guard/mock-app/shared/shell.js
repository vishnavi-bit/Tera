import { esc } from './components.js?v=1';
import { icon } from './icons.js?v=2';

// One phone, two apps: S* screens show the Guard app, R* screens the Resident app.
const GUARD_TABS = [
  { code: 'S02', label: 'Home', icon: 'home' },
  { code: 'S03', label: 'Scan', icon: 'scan' },
  { code: 'S07', label: 'Inside', icon: 'people' },
  { code: 'S08', label: 'Parcels', icon: 'parcel' },
  { code: 'S09', label: 'Activity', icon: 'activity' }
];
const RESIDENT_TABS = [
  { code: 'R01', label: 'Home', icon: 'home' },
  { code: 'R02', label: 'Approvals', icon: 'hourglass' },
  { code: 'R04', label: 'Guests', icon: 'userplus' },
  { code: 'R06', label: 'History', icon: 'activity' },
  { code: 'R07', label: 'Parcels', icon: 'parcel' }
];

const tabsHtml = (tabs, activeCode) =>
  tabs
    .map((t) => `<button class="tab-item${t.code === activeCode ? ' active' : ''}" data-goto="${t.code}">${icon(t.icon)}<span>${esc(t.label)}</span></button>`)
    .join('');

export function renderShell({ user, body, activeCode, embedded, data }) {
  const resident = activeCode.startsWith('R');
  const bare = activeCode === 'S01'; // sign-in has no bottom bar
  const pill = resident ? data.resident.flat : data.gate.name;
  const sub = resident ? user.org : data.guard.shift;
  return `
    <div class="shell${resident ? ' resident' : ''}">
      <header class="topbar">
        <span class="gate-pill">${esc(pill)}</span>
        <div class="who"><strong>${esc(user.name)}</strong><small>${esc(sub)}</small></div>
        <span class="conn" title="Connection status (demo)"><i></i>${resident ? 'Resident App' : 'Guard App'}</span>
      </header>
      <main class="content">${body}</main>
      ${bare ? '' : `<nav class="tabbar" aria-label="Main">${tabsHtml(resident ? RESIDENT_TABS : GUARD_TABS, activeCode)}</nav>`}
    </div>`;
}

export function renderDirectory(screens) {
  const rows = screens
    .map((s) => `<li><code>${esc(s.code)}</code> <a href="?screen=${esc(s.code)}">${esc(s.name)}</a></li>`)
    .join('');
  return `<div class="directory"><h1>Residents - Guard + Resident (mock)</h1>
    <p>Standalone view of every mock screen of both apps. Pick one to open it. Demo data only.</p>
    <ul>${rows}</ul><p><a href="?reset=1">Reset mock data</a></p></div>`;
}
