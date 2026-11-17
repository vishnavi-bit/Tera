import { esc, btn } from '../../shared/components.js?v=2';

export const meta = { code: 'W20', name: 'Get Report', side: 'founder', icon: 'report', nav: 'Report', roles: ['founder-women', 'founder-genz', 'founder-midlife'] };

const STEPS = ['🔍 Analyzing your inputs...', '🧠 Generating personalized insights...', '📊 Calculating readiness score...', '🏙️ Pulling city-specific data...', '📄 Creating your PDF report...', '✅ Report ready!'];

export function render({ data }) {
  if (!data.report.ready) {
    return `<section class="qcard center" style="padding:48px 24px"><div class="score-circle" style="width:72px;height:72px;margin-bottom:18px"><strong style="font-size:26px">…</strong></div>
      <h2 style="margin-bottom:6px">Generating your report</h2><p class="qsub" style="margin:0">${esc(STEPS[3])}</p>
      <div class="gen-steps">${STEPS.map((s, i) => `<div class="${i < 3 ? 'done' : ''}">${esc(s)}</div>`).join('')}</div>
      <p class="small">This takes about a minute. You can keep this page open.</p></section>`;
  }
  return `<section class="qcard center" style="padding:40px 24px"><div class="big-ok">✓</div><h2 style="margin-bottom:6px">Your report is ready! 🎉</h2>
    <p style="color:var(--muted)">Sent to your WhatsApp and email.</p><p class="small" style="margin-bottom:24px">Check your messages for the download link</p>
    ${btn('View in Dashboard →', { action: 'view-dashboard', goto: 'W21', block: true })}
    <div style="border-top:1px solid var(--line);margin-top:24px;padding-top:20px"><p style="color:var(--muted);font-weight:500">Want to take it further?</p>
      <div class="next-grid"><button class="a" data-toast="Book a Call would open the 1:1 consultation booking (₹2,999)."><b>📞 Book a Call</b><small>1:1 expert consultation · ₹2,999</small></button>
        <button class="b" data-not-defined="Whether the incubation programme exists yet, and how a user joins it, is not defined (docs/07_conflicts_open_questions.md, number 5)."><b>🚀 Join Incubation</b><small>Full mentorship program</small></button></div></div></section>`;
}
