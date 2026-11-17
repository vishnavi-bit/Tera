import { button, input, select } from '../../shared/form.js?v=1';

export const meta = { code: 'R04', name: 'Pre-approve a Guest', side: 'resident', icon: 'userplus', nav: 'Pre-approve', roles: ['resident-a1204'] };

const CATEGORIES = ['Personal Guest', 'Domestic Help', 'Service Provider', 'Food Delivery / Courier'];

export function render({ data }) {
  const g = data.guest;
  return `
    <div class="page-head"><h1>Pre-approve a guest</h1></div>
    <div class="card"><div class="row">
      ${input('Guest name', g.name, { required: true, toast: 'Guest name would be saved with the pass.' })}
      ${input('Phone number', g.phone, { type: 'tel', toast: 'Phone number (if available) would be saved with the pass.' })}
      ${select('Category', CATEGORIES, g.category, { required: true, toast: 'Category decides which rules apply at the gate.' })}
      ${input('Visit date', g.date, { required: true, toast: 'Visit date would limit when the pass is valid.' })}
      ${input('Valid until', g.validUntil, { required: true, toast: 'Valid until would set when the pass expires.' })}
      ${input('Purpose of visit', g.purpose, { toast: 'Purpose would be shown to the guard.' })}
      ${input('Pass use', 'Single visit', { notDefined: 'Whether a pass can be reused for repeat visits is not defined (UI requirements section 8, question 3).' })}
    </div></div>
    <div class="actions">${button('Create pass', { action: 'create-pass', goto: 'R05', primary: true }).replace('class="btn', 'class="btn btn-block')}</div>
    <p class="note">Your guest does not need to install an app. They show the pass at the gate.</p>`;
}
