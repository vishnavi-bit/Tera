import { esc, inr, btn } from '../../shared/components.js?v=2';

export const meta = { code: 'W21', name: 'Dashboard', side: 'founder', icon: 'home', nav: 'Dashboard', roles: ['founder-women', 'founder-genz', 'founder-midlife'] };

const PRICE = { entry: [59, 'Entry'], core: [199, 'Core'], premium: [2999, 'Premium'] };

function card(r, isNew) {
  const [price, name] = PRICE[r.plan];
  const gen = r.status === 'generating';
  return `<div class="rcard${isNew ? ' new' : ''}"><div class="pillrow" style="justify-content:space-between"><h3>${esc(r.topIdea)}</h3>
      <span>${isNew ? '<span class="pill new">New</span> ' : ''}${gen ? '<span class="pill gen">Generating...</span>' : `<span class="pill plan-${esc(r.plan)}">₹${price} ${name}</span>`}</span></div>
    <p class="q">"${esc(r.idea)}"</p>
    <div class="pillrow">${r.tags.map((t) => `<span class="pill">${esc(t)}</span>`).join('')}<span class="small" style="margin-left:auto">${esc(r.date)}</span></div>
    <div class="bar"><span>Readiness Score</span><div class="track"><i style="width:${r.score}%"></i></div><strong>${r.score}/100</strong></div>
    <div class="acts">${isNew ? btn('View report', { action: 'open-report', goto: 'W22' }) : btn('View report', { variant: 'outline', toast: 'View report would open the report preview.' })}
      ${btn('Download PDF', { variant: 'outline', toast: 'Download PDF would save the report from a signed link.' })}</div></div>`;
}

export function render({ data }) {
  const all = [{ ...data.report.card }, ...data.dashboard.others];
  const total = all.reduce((s, r) => s + PRICE[r.plan][0], 0);
  const avg = Math.round(all.reduce((s, r) => s + r.score, 0) / all.length);
  return `<main class="dash"><div class="dash-head"><div><h1>My Ideas &amp; Reports</h1><p>${all.length} reports · ${all.filter((r) => r.status === 'ready').length} ready to download</p></div>
      ${btn('+ New Idea', { toast: '+ New Idea would start a new intake for another idea.' })}</div>
    <div class="stats"><div class="stat"><span>📄 Total Reports</span><strong>${all.length}</strong></div><div class="stat"><span>📊 Avg. Score</span><strong>${avg}</strong></div><div class="stat"><span>💳 Total Spent</span><strong>${inr(total)}</strong></div></div>
    <div class="tabs">${['All Plans', '₹59 Entry', '₹199 Core', '₹2999 Premium'].map((t, i) => `<button class="${i === 0 ? 'on' : ''}" data-toast="${esc(`${t} would filter the list.`)}">${esc(t)}</button>`).join('')}</div>
    ${all.map((r, i) => card(r, i === 0)).join('')}
    <div class="upsell"><div><b style="font-size:18px">Ready to go deeper?</b><small>Upgrade to Premium for a 1:1 consultation and custom execution plan</small></div>${btn('Upgrade', { variant: 'white', toast: 'Upgrade would open the Premium plan.' })}</div></main>`;
}
