import { esc, btn } from '../../shared/components.js?v=2';

export const meta = { code: 'W16', name: 'Your Details', side: 'founder', icon: 'user', nav: 'Details', roles: ['founder-women', 'founder-genz', 'founder-midlife'] };

export function render({ data }) {
  const c = data.contact;
  const form = `<section class="qcard${c.state === 'form' ? '' : ' dim'}"><h2>Almost there!</h2><p class="qsub">We'll send your report to these details</p><div class="stack">
    <div><label class="label">Full name</label><input value="${esc(c.name)}" placeholder="Your full name" data-toast="Name would be saved with your order."></div>
    <div><label class="label">Email address</label><input type="email" value="${esc(c.email)}" placeholder="you@example.com" data-toast="Email would receive the report link."></div>
    <div><label class="label">WhatsApp number</label><div class="phone-row"><span class="cc">+91</span><input type="tel" value="${esc(c.phone)}" placeholder="9876543210" data-toast="This number would be checked through WhatsApp."></div>
      <p class="small" style="margin-top:6px">Enter your 10-digit WhatsApp number</p></div>
    ${c.state === 'form' ? btn('Register →', { action: 'register', goto: 'W16', size: 'lg', block: true }) : btn('Register →', { toast: 'Register has already been done.', size: 'lg', block: true })}</div></section>`;
  let modal = '';
  if (c.state === 'confirm') {
    modal = `<div class="overlay"><div class="modal"><h3>💬 Verify via WhatsApp</h3>
      <p style="margin-top:12px">To complete your registration, we'll open WhatsApp and send a message to our team on your behalf.</p>
      <p>No OTP, no password. Just one tap and you're verified.</p>
      <button class="link-faint" style="padding-left:0" data-toast="WhatsApp is required for this process. We use it to securely verify your identity and deliver your report without any OTP. Please install WhatsApp and return. It's free and takes under a minute.">I do not have WhatsApp</button>
      <div class="row2">${btn('Cancel', { variant: 'outline', toast: 'Cancel would close this and keep you on the form.' })}${btn('Continue', { action: 'wa-continue', goto: 'W16', variant: 'green' })}</div></div></div>`;
  } else if (c.state === 'registered') {
    modal = `<div class="overlay"><div class="modal center"><div class="big-ok">✓</div><h3>You're registered!</h3>
      <p style="margin-top:8px">Welcome aboard, <strong>${esc(c.name.split(' ')[0])}</strong>. Now choose the plan that's right for you and unlock your full startup report.</p>
      ${btn('Choose a plan →', { action: 'choose-plan', goto: 'W17', size: 'lg', block: true })}</div></div>`;
  }
  return form + modal;
}
