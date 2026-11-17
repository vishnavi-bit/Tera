import { esc } from './components.js?v=5';
import { icon } from './icons.js?v=5';

const PORTAL_LABEL = { dealer: 'Dealer', oem: 'OEM' };
const RECENT = 5;
const ago = (min) => (min < 60 ? `${min} min ago` : min < 1440 ? `${Math.round(min / 60)} h ago` : `${Math.round(min / 1440)} d ago`);

// navItems: from menuFor() in spec.js, one per spec section
export function renderShell({ user, body, navItems, activeCode, embedded, notifications }) {
  const sorted = [...notifications].sort((a, b) => a.minutesAgo - b.minutesAgo);
  const unread = sorted.filter((n) => n.unread).length;
  const nav = navItems
    .map(
      (n) => `<button class="nav-item${n.codes.includes(activeCode) ? ' active' : ''}" ${n.built ? `data-goto="${esc(n.target)}"` : `data-spec-code="${esc(n.target)}"`} title="${esc(n.label)}">
        ${icon(n.icon)}<span>${esc(n.label)}</span></button>`
    )
    .join('');
  return `
    <div class="shell">
      <header class="topbar">
        <button class="icon-btn" data-ui="toggle-menu" aria-label="Toggle menu">${icon('menu')}</button>
        <span class="portal">${PORTAL_LABEL[user.side]}</span>
        <div class="spacer"></div>
        <div class="bell-wrap">
          <button class="icon-btn" data-ui="toggle-bell" aria-label="Notifications" aria-expanded="false">
            ${icon('bell')}${unread ? `<span class="count-badge">${unread}</span>` : ''}
          </button>
          <div class="dropdown" data-ui-panel="bell" hidden>
            <div class="dropdown-head"><strong>Notifications</strong>
              <button class="link" data-action="mark-all-read">Mark all read</button></div>
            <ul>${sorted.slice(0, RECENT).map((n) => `
              <li><button class="notif${n.unread ? ' unread' : ''}" data-action="open-notification" data-link="${esc(n.link)}">
                <span>${esc(n.title)}</span><small>${ago(n.minutesAgo)}</small></button></li>`).join('')}</ul>
            <button class="dropdown-foot link" data-action="show-all-notifications">Show all</button>
          </div>
        </div>
        <div class="user-wrap">
          <button class="avatar" data-ui="toggle-user" aria-label="User menu" aria-haspopup="menu" aria-expanded="false" title="${esc(user.roleLabel)}">${esc(user.name.slice(0, 1).toUpperCase())}</button>
          <div class="dropdown dropdown-menu" data-ui-panel="user" role="menu" hidden>
            <div class="user-name">${esc(user.name)}</div>
            <button class="menu-item" role="menuitem" data-action="open-settings">${icon('settings')}<span>Settings</span></button>
            <button class="menu-item" role="menuitem" data-action="logout">${icon('logout')}<span>Log out</span></button>
          </div>
        </div>
      </header>
      <div class="body">
        <nav class="sidenav" aria-label="Main menu">${nav}${embedded ? '' : '<a class="nav-item dev" href="?">All screens</a>'}</nav>
        <div class="backdrop" data-ui="close-drawer"></div>
        <main class="content">${body}</main>
      </div>
    </div>`;
}

export function renderDirectory(screens) {
  const rows = screens
    .map(
      (s) => `<tr>
        <td><code>${esc(s.code)}</code></td>
        <td><a href="?screen=${esc(s.code)}">${esc(s.name)}</a></td>
        <td>${esc(s.roles.join(', '))}</td></tr>`
    )
    .join('');
  return `<div class="directory"><h1>Tera EV mock application</h1>
    <p>Standalone view of every mock screen. Pick one to open it.</p>
    <table class="grid"><thead><tr><th>Code</th><th>Screen</th><th>Users</th></tr></thead><tbody>${rows}</tbody></table>
    <p><a href="?reset=1">Reset mock data</a></p></div>`;
}
