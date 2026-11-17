import { esc } from '../ui.js';
import { findScreen } from '../spec.js';

// Shown for a landing screen that is not built: what screen_details.md says about it.
export function showSpecPage(el, code) {
  const s = findScreen(code);
  el.innerHTML = s
    ? `<div class="page-head"><h1>${esc(s.name)}</h1></div>
       <div class="card">
         <p class="muted">This screen is not built in the mock. screen_details.md defines it as:</p>
         <dl class="spec">
           <dt>Type</dt><dd>${esc(s.type)}${s.mode ? `, ${esc(s.mode)}` : ''}</dd>
           <dt>Roles</dt><dd>${esc(s.roles || 'Not defined')}</dd>
           <dt>Actions</dt><dd>${esc(s.buttons || 'Not defined')}</dd>
           <dt>Content</dt><dd>${esc(s.fields.replace(/^No dedicated input form[^.]*\.\s*/, '') || 'Not defined')}</dd>
         </dl>
       </div>`
    : `<div class="card"><p>${esc(code)} is not in screen_details.md.</p></div>`;
}

export function showNotDefinedPage(el, roleLabel, reason) {
  el.innerHTML = `<div class="page-head"><h1>Dashboard</h1></div>
    <div class="card notice"><strong>Not defined</strong>
      <p>No dashboard is defined for ${esc(roleLabel)} in screen_details.md. ${esc(reason)}</p></div>`;
}
