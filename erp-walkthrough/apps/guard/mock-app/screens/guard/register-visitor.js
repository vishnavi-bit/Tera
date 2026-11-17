import { esc } from '../../shared/components.js?v=1';
import { button, input, select } from '../../shared/form.js?v=1';

export const meta = { code: 'S04', name: 'Visitor Details / Registration', side: 'guard', icon: 'userplus', nav: 'Register', roles: ['guard-gate1'] };

const block = (html) => html.replace('class="btn', 'class="btn btn-block');
const CATEGORIES = ['Personal Guest', 'Food Delivery / Courier', 'Domestic Help', 'Service Provider', 'Other'];

export function render({ data }) {
  const v = data.visit;
  return `
    <div class="page-head"><h1>Register visitor</h1></div>
    <div class="card">
      <div class="row">
        ${input('Visitor name', v.visitor, { required: true, toast: 'Visitor name would be saved with the visit.' })}
        ${input('Phone number', v.phone, { type: 'tel', toast: 'Phone number (if available) would be saved with the visit.' })}
        ${input('Destination flat', v.flat, { required: true, toast: 'Destination flat would be used to find the resident.' })}
        ${select('Visitor category', CATEGORIES, v.category, { required: true, toast: 'Category decides which approval and time-limit rules apply.' })}
        ${input('Purpose of visit', v.purpose, { toast: 'Purpose of visit would be saved with the visit.' })}
        <label class="field"><span>Photo</span><button class="btn" data-toast="Photo capture would open the camera. Whether a photo is required is a society policy.">Take photo</button></label>
        ${input('Identity details', 'Not collected', { notDefined: 'Which identity details are mandatory for each category is not defined. Government ID is not always required (UI requirements section 8, question 5).' })}
      </div>
    </div>
    <p class="note">For a repeat visitor, the previous flat would be suggested here and the guard would confirm it.</p>
    <div class="actions">${block(button('Save and continue', { action: 'save-visitor', goto: 'S05', primary: true }))}</div>
    <p class="note">${esc('Demo data. Fictional visitor.')}</p>`;
}
