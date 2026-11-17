// Screen index for the Resident App, derived by hand from the Guard App documents (docs/resident_app_scope.md) (mock-data/spec/screens.json).
import { toast, notDefined } from './ui.js?v=1';

let screens = [];
export async function loadSpec() {
  screens = await (await fetch(new URL('../mock-data/spec/screens.json', import.meta.url))).json();
}
export const findScreen = (code) => screens.find((s) => s.code === code);

// What a control that leads to a screen the walkthrough does not build should do.
export function announce(code) {
  const s = findScreen(code);
  if (!s) return notDefined(`${code} is not in the Resident App scope.`);
  const parts = [`${code} ${s.name} would open (${[s.type, s.mode].filter(Boolean).join(', ')}).`];
  if (s.buttons) parts.push(`Actions: ${s.buttons}.`);
  if (s.fields) parts.push(`Shows: ${s.fields}`);
  toast(parts.join(' '));
}
