// Screen definitions extracted from docs/screen_details.md (see scripts/extract-spec.mjs).
import { toast, notDefined } from './ui.js';

let screens = [];

export async function loadSpec() {
  screens = await (await fetch(new URL('../data/spec/screens.json', import.meta.url))).json();
}

export const findScreen = (code) => screens.find((s) => s.code === code);

const displayContent = (s) => s.fields.match(/Display\/column content:\s*([^\n]+)/)?.[1]?.trim();

// What a control that leads to `code` should do while that screen is not built.
export function describeScreen(code) {
  const s = findScreen(code);
  if (!s) return { kind: 'alert', message: `${code} is not in screen_details.md.` };
  if (/not yet speced/i.test(s.buttons + s.fields))
    return { kind: 'alert', message: `${code} ${s.name} is "not yet speced" in screen_details.md.` };
  const parts = [`${code} ${s.name} will open (${[s.type, s.mode].filter(Boolean).join(', ')}).`];
  if (s.buttons) parts.push(`Actions: ${s.buttons}.`);
  const shown = displayContent(s);
  if (shown) parts.push(`Shows: ${shown}`);
  return { kind: 'toast', message: parts.join(' ') };
}

export function announce(code) {
  const d = describeScreen(code);
  (d.kind === 'alert' ? notDefined : toast)(d.message);
}

// Role codes: "all but PH, PM" excludes those codes. Other forms are not evaluated.
export function roleExcluded(screen, specCode) {
  const m = screen?.roles?.match(/^all but (.+)$/i);
  return !!m && !!specCode && m[1].split(',').map((c) => c.trim()).includes(specCode);
}
