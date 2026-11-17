export const esc = (v) =>
  String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
export const wordCount = (t) => String(t).trim().split(/\s+/).filter(Boolean).length;

// A button that moves the tour (action) or only says what it would do (toast). notDefined shows the "Not defined" alert.
export function btn(label, o = {}) {
  const cls = `btn${o.size === 'lg' ? ' btn-lg' : ''}${o.block ? ' btn-block' : ''}${o.variant ? ' btn-' + o.variant : ''}`;
  if (o.action) return `<button class="${cls}" data-action="${esc(o.action)}"${o.goto ? ` data-goto="${esc(o.goto)}"` : ''}>${esc(label)}</button>`;
  if (o.notDefined) return `<button class="${cls}" data-not-defined="${esc(o.notDefined)}">${esc(label)}</button>`;
  return `<button class="${cls}" data-toast="${esc(o.toast ?? `${label} would run here.`)}">${esc(label)}</button>`;
}

export const qcard = (title, sub, body) => `<section class="qcard"><h2>${esc(title)}</h2><p class="qsub">${esc(sub)}</p><div class="stack">${body}</div></section>`;

// Selectable choices. The sample answer shows as chosen; a click only says what it would do.
export const radio = (items, sel, what) =>
  `<div>${items.map((x) => `<button type="button" class="opt radio${x === sel ? ' on' : ''}" data-toast="${esc(`${what}: ${x} would be selected.`)}">${esc(x)}</button>`).join('')}</div>`;
export const chips = (items, sel, what) =>
  `<div class="chips">${items.map((x) => `<button type="button" class="chip${sel.includes(x) ? ' on' : ''}" data-toast="${esc(`${what}: ${x} would be toggled.`)}">${esc(x)}</button>`).join('')}</div>`;
export const tiles = (items, sel, what, cols = 3) =>
  `<div class="grid${cols}">${items.map((t) => `<button type="button" class="opt tile${t.id === sel ? ' on' : ''}" data-toast="${esc(`${what}: ${t.label} would be selected.`)}"><span class="ic">${t.icon}</span><b>${esc(t.label)}</b>${t.desc ? `<small>${esc(t.desc)}</small>` : ''}</button>`).join('')}</div>`;
