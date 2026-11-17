import { esc, badge } from '../../shared/components.js?v=1';
import { button, input } from '../../shared/form.js?v=1';

export const meta = { code: 'S07', name: 'Visitors Inside / Check-Out', side: 'guard', icon: 'people', nav: 'Inside', roles: ['guard-gate1'] };

const block = (html) => html.replace('class="btn', 'class="btn btn-block');

const card = (v, exit) => {
  const target = exit.target && v.visitor === exit.target;
  const out = target
    ? block(button('Check Out', { action: 'check-out', primary: true }))
    : block(button('Check Out', { toast: `Check Out would record ${v.visitor}'s exit time and gate.` }));
  return `
  <div class="card visit">
    <div class="visit-top"><strong>${esc(v.visitor)}</strong>${v.new ? badge('Checked In', 'good') : v.overdue ? badge('Overdue', 'warn') : badge('Inside', 'neutral')}</div>
    <small>${esc(v.category)} · Flat ${esc(v.flat)}</small>
    <small>Entered ${esc(v.since)}${v.gate ? ` · ${esc(v.gate)}` : ''}${v.overdue ? ' · over the time limit (demo)' : ''}</small>
    ${exit.confirming ? '' : out}
  </div>`;
};

export function render({ data }) {
  const exit = data.exit;
  let list = [...data.inside.list];
  const who = data.visit.status === 'approved' ? data.visit : data.pass;
  if (data.entry.done)
    list.unshift({ visitor: who.visitor, category: who.category, flat: who.flat, since: data.entry.time, gate: data.gate.name, new: true });
  const leaving = list.find((v) => v.visitor === exit.target);
  if (exit.done) list = list.filter((v) => v.visitor !== exit.target);

  const banner = exit.done
    ? `<div class="result result-good"><strong>CHECKED OUT</strong><span>${esc(exit.target)} left at ${esc(exit.time)} · ${esc(data.gate.name)} · ${esc(data.guard.name)}</span></div>`
    : '';
  const confirm =
    exit.confirming && leaving
      ? `<div class="card"><strong>Check out ${esc(leaving.visitor)}?</strong>
          <p class="note">Flat ${esc(leaving.flat)} · entered ${esc(leaving.since)}. Exit time ${esc(exit.time)} at ${esc(data.gate.name)}, recorded by ${esc(data.guard.name)}.</p>
          <div class="actions">${block(button('Confirm check-out', { action: 'confirm-check-out', primary: true }))}${block(button('Cancel', { toast: 'Cancel would leave the visit open.' }))}</div></div>`
      : '';
  return `
    <div class="page-head"><h1>Visitors inside</h1>${badge(`${data.counts.inside} inside`, 'neutral')}</div>
    ${banner}${confirm}
    ${input('Search', '', { placeholder: 'Visitor, flat or category', toast: 'Search would filter the active visits by visitor, flat, category or entry time.' })}
    <div style="height:12px"></div>
    ${list.map((v) => card(v, exit)).join('')}`;
}
