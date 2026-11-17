import { esc, btn, qcard } from '../../shared/components.js?v=2';

export const meta = { code: 'W15', name: 'Your Score', side: 'founder', icon: 'score', nav: 'Score', roles: ['founder-women', 'founder-genz', 'founder-midlife'] };

const LOCKED = [
  ['📊', 'Complete Score Breakdown', 'Market readiness: 78 · Skills match: 65 · Financial readiness: 71 · Timing: 74'],
  ['🏙️', 'City-Specific Insights', 'GST registration required · High demand for this service · 3 key competitors identified'],
  ['📅', '7-Day Action Plan', 'Day 1: Register on MSME portal · Day 2: Open current account · Day 3: Create social presence...'],
  ['⚠️', 'Mistakes to Avoid', 'Common pitfalls for your business type and stage, with how to avoid each one']
];

export function render({ data }) {
  const v = data.preview;
  return `<section class="qcard">
    <div class="center" style="margin-bottom:24px"><span class="logo" style="display:block;margin-bottom:18px">🚀 Startup Star</span>
      <div class="score-circle"><div><strong>${esc(v.score)}</strong><small>/100</small></div></div>
      <h2 style="margin-bottom:6px">Your Startup Readiness Score</h2>
      <p style="color:var(--muted)">You're in the <strong style="color:var(--brand)">top ${esc(v.top)}%</strong> of aspiring entrepreneurs</p></div>
    <p class="label">✨ Why it's a great idea</p>
    ${v.why.map((r) => `<div class="why"><b>✓</b><span>${esc(r)}</span></div>`).join('')}
    <p class="label" style="margin-top:24px">What's in your full report</p>
    <div class="locked"><div class="blur">${LOCKED.map(([i, t, b]) => `<div class="item"><b>${i} ${esc(t)}</b><span>${esc(b)}</span></div>`).join('')}</div>
      <div class="lock-badge"><div><div class="big">🔒</div><b>Unlock Full Report</b><p class="small" style="font-size:14px;color:var(--muted)">Starting at ₹59</p></div></div></div>
    <div style="margin-top:20px">${btn('Unlock My Full Report →', { action: 'unlock', goto: 'W16', size: 'lg', block: true })}</div>
    <p class="small center" style="margin-top:12px">Instant PDF delivery · Permanent access · Secured by Razorpay</p></section>`;
}
