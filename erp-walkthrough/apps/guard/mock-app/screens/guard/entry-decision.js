import { esc } from '../../shared/components.js?v=1';
import { icon } from '../../shared/icons.js?v=2';
import { button } from '../../shared/form.js?v=1';

export const meta = { code: 'S06', name: 'Entry Decision / Check-In', side: 'guard', icon: 'check', nav: 'Entry', roles: ['guard-gate1'] };

const block = (html) => html.replace('class="btn', 'class="btn btn-block');

function rejected(data) {
  const v = data.visit;
  return `
    <div class="result result-bad">${icon('stop', 40)}<strong>DO NOT ALLOW ENTRY</strong>
      <span>The resident rejected this visit</span></div>
    <div class="card kv">
      <div><span>Reason</span><strong>Rejected by ${esc(v.resident)} (${esc(v.flat)})</strong></div>
      <div><span>Visitor</span><strong>${esc(v.visitor)}</strong></div>
      <div><span>Category</span><strong>${esc(v.category)}</strong></div>
      <div><span>Decision source</span><strong>${esc(v.source)}</strong></div>
      <div><span>Gate</span><strong>${esc(data.gate.name)}</strong></div>
      <div><span>Guard</span><strong>${esc(data.guard.name)}</strong></div>
    </div>
    <div class="actions">${block(button('Close without entry', { action: 'refuse-entry', primary: true }))}</div>
    <p class="note">A rejected visitor cannot be checked in. The refusal is recorded with the gate and guard.</p>`;
}

function approved(data) {
  const v = data.visit;
  return `
    <div class="result result-good">${icon('check', 40)}<strong>ALLOW ENTRY</strong>
      <span>Approved for ${esc(v.flat)}</span></div>
    <div class="card kv">
      <div><span>Reason</span><strong>${esc(v.resident)} approved this visit</strong></div>
      <div><span>Visitor</span><strong>${esc(v.visitor)}</strong></div>
      <div><span>Category</span><strong>${esc(v.category)}</strong></div>
      <div><span>Gate</span><strong>${esc(data.gate.name)}</strong></div>
      <div><span>Guard</span><strong>${esc(data.guard.name)}</strong></div>
      <div><span>Decision source</span><strong>${esc(v.source)}</strong></div>
      <div><span>Time</span><strong>${esc(data.entry.time)}</strong></div>
    </div>
    <div class="actions">
      ${block(button('Confirm entry', { action: 'confirm-entry', primary: true }))}
      ${block(button('Do not allow', { toast: 'Do not allow would record a refused entry with a reason.' })).replace('class="btn btn-block', 'class="btn btn-block btn-danger')}
    </div>
    <p class="note">Confirming records the timestamp, gate, guard, category and decision source.</p>`;
}

export function render({ data }) {
  if (data.visit.status === 'rejected') return rejected(data);
  if (data.visit.status === 'approved') return approved(data);
  const p = data.pass;
  return `
    <div class="result result-good">${icon('check', 40)}<strong>ALLOW ENTRY</strong>
      <span>Valid pre-approved pass for ${esc(p.flat)}</span></div>
    <div class="card kv">
      <div><span>Reason</span><strong>Pass valid, in date, pre-approved by the resident</strong></div>
      <div><span>Visitor</span><strong>${esc(p.visitor)}</strong></div>
      <div><span>Category</span><strong>${esc(p.category)}</strong></div>
      <div><span>Gate</span><strong>${esc(data.gate.name)}</strong></div>
      <div><span>Guard</span><strong>${esc(data.guard.name)}</strong></div>
      <div><span>Decision source</span><strong>${esc(data.entry.source)}</strong></div>
      <div><span>Time</span><strong>${esc(data.entry.time)}</strong></div>
      <div><span>Resident availability</span><strong><button class="link" data-not-defined="Whether a resident-availability check applies to a pre-approved visitor is not defined. The requirements leave it as a sponsor decision (UI requirements section 5 and section 8, question 3).">Not defined</button></strong></div>
    </div>
    <div class="actions">
      ${block(button('Confirm entry', { action: 'confirm-entry', primary: true }))}
      ${block(button('Do not allow', { toast: 'Do not allow would record a refused entry with a reason.' })).replace('class="btn btn-block', 'class="btn btn-block btn-danger')}
    </div>
    <p class="note">Confirming records the timestamp, gate, guard, category and decision source.</p>`;
}
