import { esc, btn, qcard } from '../../shared/components.js?v=2';

export const meta = { code: 'W19', name: 'Review & Confirm', side: 'founder', icon: 'check', nav: 'Confirm', roles: ['founder-women', 'founder-genz', 'founder-midlife'] };

const STAGE = { idea: 'Idea', prototype: 'Prototype', revenue: 'Revenue' };
const WHERE = { online: 'Online / Pan-India', global: 'Online / Pan-world' };

export function render({ data }) {
  const b = data.business, f = data.profile, c = data.contact, x = data.persona.extra;
  const rows = [
    ['Business Idea', b.idea], ['Stage', STAGE[b.stage]], ['Main Concern', b.concern], ['Location', WHERE[b.location] ?? b.city],
    [x[0].label, x[0].a], [x[1].label, x[1].a],
    ['Interests', f.interests.join(', ')], ['Skills', f.skills.join(', ')], ['Budget', f.budget], ['Business Type', f.businessType],
    ['Name', c.name], ['Email', c.email], ['Phone', '+91 ' + c.phone]
  ];
  const core = data.plan.id === 'core';
  const banner = core
    ? `<div class="note amber"><span>📋</span><div><p class="t">Ready to generate your report?</p><p class="b">Please review your details carefully before proceeding. With the <strong>Core plan, you get 2 revision opportunities</strong>: you can update your details and regenerate up to twice after the initial report.</p></div></div>`
    : `<div class="note blue"><span>⚠️</span><div><p class="t">Review your details carefully</p><p class="b">Once your report is generated, <strong>the information cannot be changed</strong>. Make sure everything below is accurate before you proceed.</p></div></div>`;
  return `<section class="qcard">${banner}<h2>Review &amp; Confirm</h2><p class="qsub">Use "Revise" on any field to add a correction before we generate</p>
    <div>${rows.map(([k, v]) => `<div class="rev"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span><button data-toast="${esc(`Revise would let you add a correction to ${k.toLowerCase()}.`)}">Revise</button></div>`).join('')}</div>
    <div style="margin-top:20px">${btn('Generate My Report →', { action: 'generate', goto: 'W20', size: 'lg', block: true })}</div></section>`;
}
