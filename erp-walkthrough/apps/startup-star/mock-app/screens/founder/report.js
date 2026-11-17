import { esc, btn } from '../../shared/components.js?v=2';

export const meta = { code: 'W22', name: 'Report Preview', side: 'founder', icon: 'report', nav: 'Report', roles: ['founder-women', 'founder-genz', 'founder-midlife'] };

const slide = (n, title, sub, body, rc) => `<section class="slide" style="--rc:${esc(rc)}"><h2>${esc(title)}</h2><p class="sub">${esc(sub)}</p>${body}<div class="ftr"><span>Startup Star · Confidential</span><span>${n} / 9</span></div></section>`;

export function render({ data }) {
  const r = data.report;
  const [c1, c2] = r.brand;
  const tiles = (arr) => `<div class="cols">${arr.map(([a, b, c]) => `<div class="tilebox"><div class="big">${esc(a)}</div><b>${esc(b)}</b><p>${esc(c)}</p></div>`).join('')}</div>`;
  const list = (arr) => `<ul>${arr.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  return `<div class="rbar"><span>📄 Report preview · ${esc(data.plan.name)} plan</span>
      ${btn('Download PDF', { variant: 'amber', toast: 'Download PDF would wait until fonts and images are ready, then save an A4 landscape PDF.' })}</div>
    <div class="rwrap">
    ${slide(1, r.title, r.summary, `<p>Prepared for ${esc(data.contact.name)}</p><div class="cover-score">Readiness score ${esc(r.finalScore)} · ${esc(r.finalBand)}</div>`, c1)}
    ${slide(2, 'Market Reality & Competitor Benchmarks', 'Local competitor price benchmarks', tiles(r.benchmarks), c1)}
    ${slide(3, 'The Acquisition Funnel', 'Top 2 lead generation channels and the conversion script',
      `${r.channels.map(([a, b]) => `<h3>${esc(a)}</h3><p>${esc(b)}</p>`).join('')}<h3>The Conversion Script</h3>${list(r.funnel)}`, c1)}
    ${slide(4, 'The Survival Math', 'Unit economics and break-even point', tiles(r.unit.map(([a, b]) => [b, a, ''])), c1)}
    ${slide(5, 'The Scale Protocol', 'First 2 processes to automate, and your legal and compliance checklist',
      `<h3>Automate first</h3>${list(r.automate)}<h3>Legal &amp; Compliance Checklist</h3>${list(r.compliance)}`, c1)}
    ${slide(6, 'Brand Identity & Psychology', 'Your primary brand palette',
      `<div class="swatches"><div class="sw" style="background:${esc(c1)}"></div><div class="sw" style="background:${esc(c2)}"></div></div><p style="margin-top:10px">Use the first colour for trust surfaces such as your logo and header. Use the second for offers and calls to action.</p>`, c1)}
    ${slide(7, 'Your 30-Day Launch Checklist', 'Execute in order. Each week compounds the next.', r.weeks.map((w, i) => `<h3>Week ${i + 1}</h3><p>${esc(w)}</p>`).join(''), c1)}
    ${slide(8, 'Score breakdown', 'How your readiness score adds up', `<ul>${r.categories.map((c) => `<li><b>${esc(c.name)}: ${esc(c.score)}/${esc(c.max)}</b>. ${esc(c.rationale)}</li>`).join('')}</ul>`, c1)}
    ${slide(9, 'Next steps', 'Your options from here', `<p>${data.plan.id === 'premium' ? 'Book your 1:1 consultation or join the incubation programme.' : data.plan.id === 'core' ? 'Upgrade to Premium or book a consultation.' : 'Upgrade to Core or Premium for the 7-day plan and city insights.'}</p>`, c1)}
    </div>`;
}
