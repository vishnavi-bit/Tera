export const esc = (v) =>
  String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

export const badge = (text, tone = 'neutral') => `<span class="badge badge-${tone}">${esc(text)}</span>`;

export function statusTone(status) {
  if (/delivered|verified|approved|paid|in production/i.test(status)) return 'good';
  if (/pending|awaiting|submitted|not started/i.test(status)) return 'warn';
  if (/reject|fail/i.test(status)) return 'bad';
  return 'neutral';
}

export function table(headers, rows) {
  return `<div class="scroll"><table class="grid">
    <thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`;
}

export const field = (label, value, { required = false } = {}) =>
  `<label class="field"><span>${esc(label)}${required ? ' *' : ''}</span><input value="${esc(value)}" readonly></label>`;

export const pageHead = (title, actions = '') =>
  `<div class="page-head"><h1>${esc(title)}</h1><div class="page-actions">${actions}</div></div>`;
