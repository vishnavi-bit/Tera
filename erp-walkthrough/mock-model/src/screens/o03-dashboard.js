import { esc, toast, notDefined } from '../ui.js';
import { openEditSlogan } from '../dialogs/edit-slogan.js';

export const meta = { code: 'O03', name: 'Dashboard' };

const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
const num = (n) => Number(n).toLocaleString('en-IN');

export async function show(el) {
  const d = await (await fetch(new URL('../../data/dashboard.json', import.meta.url))).json();
  const select = (label, key) => `<label class="field"><span>${label}</span>
    <select data-filter="${key}">${d.filters[key].map((o) => `<option>${esc(o)}</option>`).join('')}</select></label>`;
  const kpi = (label, value) => `<div class="kpi"><span>${label}</span><strong>${num(value)}</strong></div>`;
  const rows = (items, cols) =>
    `<table class="grid"><tbody>${items.map((r) => `<tr>${cols.map((c) => `<td>${esc(c(r))}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

  el.innerHTML = `
    <div class="page-head"><h1>Dashboard</h1></div>
    <div class="card row">
      ${select('Period', 'period')}${select('State', 'state')}${select('Unit', 'unit')}
    </div>
    <div class="card slogan">
      <div><span class="muted">Slogan</span><p id="slogan">${esc(d.slogan)}</p></div>
      <button class="btn" data-action="edit-slogan">Edit</button>
    </div>
    <div class="section-head"><h2>Key figures</h2>
      <button class="link" data-action="show-undefined-kpi">ⓘ Not defined</button></div>
    <div class="kpis">
      ${kpi('No. of dealers', d.kpis.dealers)}${kpi('Vehicles sold', d.kpis.vehiclesSold)}
      ${kpi('Vehicle stock', d.kpis.vehicleStock)}${kpi('Pending orders', d.kpis.pendingOrders)}
    </div>
    <div class="cols">
      <section class="card"><h3>PO by model</h3>${rows(d.poByModel, [(r) => r.model, (r) => `${r.orders} orders`, (r) => `${r.units} units`])}</section>
      <section class="card"><h3>Vehicle sales</h3>${rows(d.vehicleSales, [(r) => r.month, (r) => `${r.units} units`])}</section>
      <section class="card"><h3>Warranty</h3>${rows([['Open', d.warranty.open], ['Resolved', d.warranty.resolved], ['Replacements', d.warranty.replacements]], [(r) => r[0], (r) => r[1]])}</section>
      <section class="card"><h3>Top warranty dealers</h3>${rows(d.topWarrantyDealers, [(r) => r.dealer, (r) => `${r.claims} claims`])}</section>
      <section class="card"><h3>Top selling vehicle</h3>${rows([d.topSellingVehicle], [(r) => r.model, (r) => `${r.units} units`])}</section>
      <section class="card"><h3>Top dealers by purchases</h3>${rows(d.topDealersByPurchases, [(r) => r.dealer, (r) => `${r.units} units`, (r) => inr(r.amount)])}</section>
    </div>`;

  el.querySelectorAll('[data-filter]').forEach((s) => {
    s.onchange = () => {
      if (s.value === 'Custom Date') {
        return notDefined('How a custom date range is chosen is not defined in screen_details.md.');
      }
      const v = Object.fromEntries([...el.querySelectorAll('[data-filter]')].map((f) => [f.dataset.filter, f.value]));
      toast(`Dashboard would reload for Period: ${v.period}, State: ${v.state}, Unit: ${v.unit}.`);
    };
  });
  el.querySelector('[data-action="edit-slogan"]').onclick = () => openEditSlogan(d.slogan);
  el.querySelector('[data-action="show-undefined-kpi"]').onclick = () =>
    notDefined('screen_details.md lists the KPIs but not how they are shown (chart types, layout) or what "vehicle sales" plots. They are shown here as plain cards and tables.');
}
