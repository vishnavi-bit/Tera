import { esc, btn } from '../../shared/components.js?v=2';

export const meta = { code: 'W01', name: 'Persona landing page', side: 'founder', icon: 'home', nav: 'Landing', roles: ['founder-women', 'founder-genz', 'founder-midlife'] };

export function render({ data }) {
  const p = data.persona;
  const [a, b, c] = p.gradient;
  const pains = p.pain.map((x) => `<div class="pain"><i>✗</i><span>${esc(x)}</span></div>`).join('');
  return `
    <nav class="nav"><div class="nav-in"><span class="logo">🚀 Startup Star</span>
      <div class="nav-links"><span>How it works</span><span>Pricing</span><span>About</span><span>Blog</span><span>Resources</span></div>
      ${btn('Get Your Plan →', { toast: 'Get Your Plan would start the same journey.' })}</div></nav>
    <section class="hero" style="background:linear-gradient(135deg,${esc(a)},${esc(b)},${esc(c)})"><div class="hero-in">
      <div class="emoji">${esc(p.emoji)}</div><div class="tagline">${esc(p.label)}</div>
      <h1>${esc(p.headline)}</h1><p class="sub">${esc(p.sub)}</p>
      <div class="teaser"><div><strong class="n">72</strong><small>Est. score</small></div><span class="sep"></span>
        <div><b>Startup Readiness Score</b><br><small>Take the quiz to see your actual score</small></div></div>
      <div>${btn('Get My Free Score & Plan →', { action: 'start', goto: 'W02', variant: 'white', size: 'lg' })}</div>
      <p class="fine">2 minutes · No signup required to start</p></div></section>
    <section class="band-section"><div class="narrow"><h2>Sound familiar?</h2>${pains}
      <div class="pain yes"><i>✓</i><span>Startup Star answers all of this, personalized for you</span></div></div></section>
    <section class="band-section alt"><div class="narrow"><div class="stars">⭐⭐⭐⭐⭐</div>
      <blockquote class="big">"${esc(p.testimonial.quote)}"</blockquote><cite>— ${esc(p.testimonial.who)}</cite></div></section>
    <section class="band-section center">${btn('Start My Startup Journey →', { action: 'start', goto: 'W02', size: 'lg' })}<p class="small" style="margin-top:12px">Starting from ₹59</p></section>`;
}
