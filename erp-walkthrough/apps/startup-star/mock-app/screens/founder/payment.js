import { esc, inr, btn } from '../../shared/components.js?v=2';

export const meta = { code: 'W18', name: 'Payment', side: 'founder', icon: 'pay', nav: 'Payment', roles: ['founder-women', 'founder-genz', 'founder-midlife'] };

export function render({ data }) {
  const p = data.plan;
  return `<section class="qcard"><div class="center" style="margin-bottom:20px"><h2>Complete your payment</h2><p class="qsub" style="margin:0">One step away from your personalized startup report</p></div>
    <div class="stack">
    <div class="plan on" style="cursor:default"><h3>${esc(p.name)} Plan</h3><div><span class="price">${inr(p.price)}</span><s>${inr(p.originalPrice)}</s></div>
      <ul style="margin-top:10px">${p.features.slice(0, 4).map((f) => `<li>${esc(f)}</li>`).join('')}</ul></div>
    <div><label class="label">Have a coupon?</label><div class="coupon"><input placeholder="Enter code (e.g. LAUNCH50)" data-toast="The code would be checked when you apply it."><button class="btn btn-outline" data-toast="Apply would check the code and reduce the total. Try LAUNCH50, STARTUP20 or WELCOME10.">Apply</button></div></div>
    <div class="sum"><div><span>${esc(p.name)} Plan</span><span>${inr(p.originalPrice)}</span></div><div style="color:var(--good)"><span>Launch offer</span><span>− ${inr(p.originalPrice - p.price)}</span></div><div class="total"><span>Total</span><span>${inr(data.order.total)}</span></div></div>
    ${btn(`Pay ${inr(data.order.total)} →`, { action: 'pay', goto: 'W19', size: 'lg', block: true })}
    <div class="methods">${['UPI', 'Cards', 'Net Banking', 'Wallets'].map((m) => `<span>${m}</span>`).join('')}</div>
    <p class="small center">🔒 100% secure · Powered by Razorpay · Instant delivery after payment</p>
    <p class="center"><button class="link-faint" data-not-defined="What the user sees when a payment fails or stays pending is not built in the POC and not designed in the documents.">Payment failed or pending?</button></p></div></section>`;
}
