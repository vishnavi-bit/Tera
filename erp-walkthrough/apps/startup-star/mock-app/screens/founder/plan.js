import { esc, inr, btn } from '../../shared/components.js?v=2';

export const meta = { code: 'W17', name: 'Choose Plan', side: 'founder', icon: 'plan', nav: 'Plan', roles: ['founder-women', 'founder-genz', 'founder-midlife'] };

const PLANS = [
  { id: 'entry', name: 'Entry', price: 59, originalPrice: 119, tag: null, outcome: 'I have basic clarity and direction', features: ['Startup Readiness Score', 'Personalized analysis (3 areas)', 'Top 1 business idea', 'Basic templates (idea worksheet, cost calculator)', 'Webinar: "How to start a company"', '1 month "Stay Motivated" app access'] },
  { id: 'core', name: 'Core', price: 199, originalPrice: 399, tag: 'Most Popular', outcome: 'I know exactly what to do next', features: ['Everything in Entry', 'Personalized analysis (7 areas)', 'Top 3 business ideas', 'City-specific insights (licenses, demand, competitors)', '7-day action plan', 'Mistakes to avoid', 'Advanced templates', 'WhatsApp support (3 questions)', '1 year "Stay Motivated" app access'] },
  { id: 'premium', name: 'Premium', price: 2999, originalPrice: 9999, tag: 'Best Value', outcome: 'I am confident and ready to launch', features: ['Everything in Core', '1:1 Consultation (30–60 min)', 'Deep personalized roadmap', 'Market validation guidance', 'Custom execution plan', 'Priority WhatsApp/email support', 'Investor pitch guidance', 'Incubation pathway recommendation'] }
];

export function render({ data }) {
  const cards = PLANS.map((p) => `<button type="button" class="plan${p.id === data.plan.id ? ' on' : ''}" data-toast="${esc(`${p.name} would be chosen for ${inr(p.price)}.`)}">
      ${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ''}<h3>${esc(p.name)} Plan</h3>
      <div><span class="price">${inr(p.price)}</span><s>${inr(p.originalPrice)}</s></div><p class="outcome">"${esc(p.outcome)}"</p>
      <ul>${p.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></button>`).join('');
  return `<div class="center"><h2 style="font-size:26px;font-weight:800;margin-bottom:6px">Choose your plan</h2><p style="color:var(--muted)">Unlock your personalized startup report</p></div>
    <div class="plan-grid">${cards}</div>
    ${btn(`Continue with ${data.plan.name} — ${inr(data.plan.price)} →`, { action: 'continue', goto: 'W18', size: 'lg', block: true })}
    <p class="small center" style="margin-top:12px">Secured by Razorpay · UPI, Cards, Net Banking, Wallets</p>`;
}
