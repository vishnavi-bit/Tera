export const esc = (v) => String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function toast(message) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => el.remove(), 6000);
}

// Generic modal. Returns { el, close }. Esc and backdrop click close it.
export function openDialog({ title, body, actions = [] }) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="dialog" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <h2>${esc(title)}</h2>
      <div class="dialog-body">${body}</div>
      <div class="dialog-actions">${actions
        .map((a) => `<button class="btn ${a.primary ? 'btn-primary' : ''}" data-action="${esc(a.action)}">${esc(a.label)}</button>`)
        .join('')}</div>
    </div>`;
  document.body.appendChild(overlay);
  const close = () => {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (e) => e.key === 'Escape' && close();
  document.addEventListener('keydown', onKey);
  overlay.addEventListener('mousedown', (e) => e.target === overlay && close());
  overlay.querySelector('input, button')?.focus();
  return { el: overlay, close };
}

export function notDefined(message) {
  const d = openDialog({
    title: 'Not defined',
    body: `<p>${esc(message)}</p>`,
    actions: [{ label: 'OK', action: 'close-alert', primary: true }]
  });
  d.el.querySelector('[data-action="close-alert"]').onclick = d.close;
}
