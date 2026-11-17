// Screen definitions extracted from docs/screen_details.md (mock-app/mock-data/spec/screens.json).
import { toast, notDefined } from './ui.js?v=5';

let screens = [];
export async function loadSpec() {
  screens = await (await fetch(new URL('../mock-data/spec/screens.json', import.meta.url))).json();
}
export const findScreen = (code) => screens.find((s) => s.code === code);

const displayContent = (s) => s.fields.match(/Display\/column content:\s*([^\n]+)/)?.[1]?.trim();

// What a menu item that leads to an unbuilt screen should do.
export function announce(code) {
  const s = findScreen(code);
  if (!s) return notDefined(`${code} is not in screen_details.md.`);
  if (/not yet speced/i.test(s.buttons + s.fields))
    return notDefined(`${code} ${s.name} is "not yet speced" in screen_details.md.`);
  const parts = [`${code} ${s.name} will open (${[s.type, s.mode].filter(Boolean).join(', ')}).`];
  if (s.buttons) parts.push(`Actions: ${s.buttons}.`);
  const shown = displayContent(s);
  if (shown) parts.push(`Shows: ${shown}`);
  toast(parts.join(' '));
}

const APP = { dealer: 'Dealer App', oem: 'OEM App' };
const NOT_MENU = new Set(['Global', 'Auth']);
const ICONS = [
  [/dashboard/i, 'dashboard'], [/announce/i, 'announce'], [/enquiry/i, 'search'], [/service/i, 'wrench'],
  [/customer/i, 'customers'], [/invoice/i, 'file'], [/payment/i, 'payments'], [/inventory/i, 'inventory'],
  [/purchase|orders/i, 'orders'], [/dealer/i, 'store'], [/issue/i, 'alert'], [/warranty/i, 'shield'],
  [/settings/i, 'settings'], [/report/i, 'chart'], [/product/i, 'products'], [/manufacturing/i, 'production'],
  [/vendor/i, 'truck'], [/ledger/i, 'book'], [/sales/i, 'chart']
];
const iconFor = (name) => ICONS.find(([re]) => re.test(name))?.[1] ?? 'dashboard';

// One menu item per spec section, in spec order. built = a screen of the section that exists in the mock.
export function menuFor(side, builtCodes) {
  const sections = new Map();
  for (const s of screens.filter((x) => x.app === APP[side] && !NOT_MENU.has(x.section))) {
    if (!sections.has(s.section)) sections.set(s.section, []);
    sections.get(s.section).push(s.code);
  }
  return [...sections].map(([label, codes]) => ({
    label,
    icon: iconFor(label),
    codes,
    target: codes.find((c) => builtCodes.includes(c)) ?? codes[0],
    built: codes.some((c) => builtCodes.includes(c))
  }));
}
