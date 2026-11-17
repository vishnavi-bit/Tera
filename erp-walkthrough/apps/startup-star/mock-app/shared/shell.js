import { esc } from './components.js?v=2';

// Order of the intake screens (the POC's FLOW_META, plus two persona questions in Stage 2).
const FLOW = [
  ['W02', 1, 'Your Idea'], ['W03', 1, 'Your Stage'], ['W04', 1, 'Main Concern'], ['W05', 1, 'Your Location'],
  ['W06', 2, 'About You'], ['W07', 2, 'About You'], ['W08', 2, 'Your Interests'], ['W09', 2, 'Your Skills'], ['W10', 2, 'Your Budget'],
  ['W11', 2, 'Business Type'], ['W12', 2, 'Your Experience'], ['W13', 2, 'Your Time'], ['W14', 2, 'Your Mindset'],
  ['W15', 3, 'Your Score'], ['W16', 3, 'Your Details'], ['W17', 3, 'Choose Plan'], ['W18', 3, 'Payment'],
  ['W19', 4, 'Confirm'], ['W20', 4, 'Get Report']
];
const LOGO = '<span class="logo">🚀 Startup Star</span>';

export const personaLabel = (data, i) => data.persona.extra[i].label;

function progress(code, data) {
  const i = FLOW.findIndex((f) => f[0] === code);
  if (i < 0 || code === 'W20') return '';
  const [, stage, label] = FLOW[i];
  const pct = Math.round(((i + 1) / FLOW.length) * 100);
  const name = code === 'W06' ? personaLabel(data, 0) : code === 'W07' ? personaLabel(data, 1) : label;
  const back = i > 0 ? `<button class="round" aria-label="Back" data-toast="Back would return to the previous question.">‹</button>` : '';
  const dots = [1, 2, 3, 4].map((s) => `<span class="${s < stage ? 'done' : s === stage ? 'now' : ''}">Stage ${s}</span>`).join('');
  return `<div class="progress"><div class="progress-top"><div class="l">${back}<span>${esc(name)}</span></div><span class="pct">${pct}%</span></div>
    <div class="track"><i style="width:${pct}%"></i></div><div class="stages">${dots}</div></div>`;
}

export function renderShell({ user, body, activeCode, data }) {
  if (activeCode === 'W01' || activeCode === 'W22') return body;
  if (activeCode === 'W21') {
    return `<nav class="dnav"><div class="dnav-in">${LOGO}<div class="who"><span class="avatar">${esc(user.initial)}</span><div><strong>${esc(user.name)}</strong><small>${esc(data.contact.email)}</small></div></div></div></nav>${body}`;
  }
  return `<div class="flow"><div class="flow-in"><div class="flow-logo">${LOGO}</div>${progress(activeCode, data)}${body}</div></div>`;
}

export function renderDirectory(screens) {
  const rows = screens.map((s) => `<li><code>${esc(s.code)}</code> <a href="?screen=${esc(s.code)}">${esc(s.name)}</a></li>`).join('');
  return `<div class="directory"><h1>Startup Star (mock)</h1><p>Standalone view of every mock screen. Demo data only.</p><ul>${rows}</ul><p><a href="?reset=1">Reset mock data</a></p></div>`;
}
