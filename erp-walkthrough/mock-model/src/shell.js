import { session } from './state.js';
import { icon } from './icons.js';
import { esc, toast, notDefined } from './ui.js';
import { announce, findScreen, roleExcluded } from './spec.js';
import { BUILT } from './screens/index.js';
import { showSpecPage, showNotDefinedPage } from './screens/spec-page.js';

const json = async (name) => (await fetch(new URL(`../data/${name}.json`, import.meta.url))).json();
const PORTAL_LABEL = { oem: 'OEM', dealer: 'Dealer' };
const RECENT = 5;

const ago = (min) => (min < 60 ? `${min} min ago` : min < 1440 ? `${Math.round(min / 60)} h ago` : `${Math.round(min / 1440)} d ago`);

export async function mountShell(root, { onLogout }) {
  const { user, role } = session;
  const [menus, notes] = await Promise.all([json('menu'), json('notifications')]);
  const menu = menus[user.portal];
  const notifications = [...notes[user.portal]].sort((a, b) => a.minutesAgo - b.minutesAgo);
  const unread = notifications.filter((n) => n.unread).length;
  let current = null;

  root.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <button class="icon-btn" id="menu-toggle" data-action="toggle-menu" aria-label="Toggle menu">${icon('menu')}</button>
        <span class="portal">${PORTAL_LABEL[user.portal]}</span>
        <div class="spacer"></div>
        <div class="bell-wrap">
          <button class="icon-btn" id="bell" data-action="open-notifications" aria-label="Notifications" aria-expanded="false">
            ${icon('bell')}${unread ? `<span class="badge">${unread}</span>` : ''}
          </button>
          <div class="dropdown" id="notif" hidden>
            <div class="dropdown-head"><strong>Notifications</strong>
              <button class="link" data-action="mark-all-read">Mark all read</button></div>
            <ul>${notifications.slice(0, RECENT).map((n) => `
              <li><button class="notif${n.unread ? ' unread' : ''}" data-action="open-notification" data-id="${esc(n.id)}" data-link="${esc(n.link)}">
                <span>${esc(n.title)}</span><small>${ago(n.minutesAgo)}</small></button></li>`).join('')}</ul>
            <button class="dropdown-foot link" data-action="show-all-notifications">Show all</button>
          </div>
        </div>
        <div class="user-wrap">
          <button class="avatar" id="avatar" data-action="open-user-menu" aria-label="User menu" aria-haspopup="menu" aria-expanded="false" title="${esc(role.label)}">${esc(user.id.slice(0, 1).toUpperCase())}</button>
          <div class="dropdown dropdown-menu" id="user-menu" role="menu" hidden>
            <div class="user-name">${esc(user.id)}</div>
            <button class="menu-item" role="menuitem" data-action="open-settings">${icon('settings')}<span>Settings</span></button>
            <button class="menu-item" role="menuitem" data-action="logout">${icon('logout')}<span>Log out</span></button>
          </div>
        </div>
      </header>
      <div class="body">
        <nav class="sidenav" id="sidenav" aria-label="Main menu">
          ${menu.map((m) => `<button class="nav-item" data-action="open-${esc(m.code)}" data-code="${esc(m.code)}" title="${esc(m.label)}">
            ${icon(m.icon)}<span>${esc(m.label)}</span></button>`).join('')}
        </nav>
        <div class="backdrop" id="backdrop"></div>
        <main class="content" id="content"></main>
      </div>
    </div>`;

  const $ = (sel) => root.querySelector(sel);
  const content = $('#content');
  const bell = $('#bell');
  const notif = $('#notif');

  async function open(code) {
    const spec = findScreen(code);
    if (BUILT[code]) {
      if (code === 'O03' && roleExcluded(spec, role.specCode)) {
        return notDefined(`${role.label} is excluded from the Dashboard (${spec.roles}). Which dashboard this role gets is not defined in screen_details.md.`);
      }
      current = code;
      root.querySelectorAll('.nav-item').forEach((b) => b.classList.toggle('active', b.dataset.code === code));
      closeMenuOnPhone();
      const module = await BUILT[code]();
      return module.show(content);
    }
    announce(code);
  }

  function landing() {
    const code = menu[0].code;
    if (BUILT[code]) {
      const spec = findScreen(code);
      if (roleExcluded(spec, role.specCode)) return showNotDefinedPage(content, role.label, `Dashboard ${code} excludes this role (${spec.roles}).`);
      return open(code);
    }
    root.querySelector(`.nav-item[data-code="${code}"]`)?.classList.add('active');
    return showSpecPage(content, code);
  }

  const closeMenuOnPhone = () => root.querySelector('.shell').classList.remove('nav-open');
  const closeNotif = () => {
    notif.hidden = true;
    bell.setAttribute('aria-expanded', 'false');
  };
  const avatar = $('#avatar');
  const userMenu = $('#user-menu');
  const closeUserMenu = () => {
    userMenu.hidden = true;
    avatar.setAttribute('aria-expanded', 'false');
  };

  $('#menu-toggle').onclick = () => {
    const shell = $('.shell');
    if (matchMedia('(max-width: 768px)').matches) shell.classList.toggle('nav-open');
    else shell.classList.toggle('nav-collapsed');
  };
  $('#backdrop').onclick = closeMenuOnPhone;
  bell.onclick = (e) => {
    e.stopPropagation();
    closeUserMenu();
    notif.hidden = !notif.hidden;
    bell.setAttribute('aria-expanded', String(!notif.hidden));
  };
  avatar.onclick = (e) => {
    e.stopPropagation();
    closeNotif();
    userMenu.hidden = !userMenu.hidden;
    avatar.setAttribute('aria-expanded', String(!userMenu.hidden));
  };
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.bell-wrap')) closeNotif();
    if (!e.target.closest('.user-wrap')) closeUserMenu();
  });
  document.addEventListener('keydown', (e) => e.key === 'Escape' && (closeNotif(), closeUserMenu()));

  root.querySelectorAll('.nav-item').forEach((b) => (b.onclick = () => open(b.dataset.code)));
  notif.querySelectorAll('[data-action="open-notification"]').forEach(
    (b) =>
      (b.onclick = () => {
        closeNotif();
        const target = findScreen(b.dataset.link);
        toast(`Would open ${b.dataset.link}${target ? ` ${target.name}` : ''} and delete this notification.`);
      })
  );
  $('[data-action="mark-all-read"]').onclick = () => toast('All notifications would be marked as read.');
  $('[data-action="show-all-notifications"]').onclick = () => {
    closeNotif();
    notDefined('A "show all notifications" page is not defined in screen_details.md. Only the header notifications panel (D00/O00) is described.');
  };
  $('[data-action="open-settings"]').onclick = () => {
    closeUserMenu();
    return user.portal === 'dealer'
      ? announce('D47')
      : notDefined('Which screen Settings in the user menu opens for OEM users is not defined in screen_details.md.');
  };
  $('[data-action="logout"]').onclick = onLogout;

  await landing();
}
