// Approved screen modules. Add a line here when a screen is added.
// The thirteen question screens (W02 to W14) are built by one factory in questions.js.
const Q = './screens/founder/questions.js?v=1';
export const SCREENS = {
  W01: './screens/founder/landing.js?v=1',
  W02: Q, W03: Q, W04: Q, W05: Q, W06: Q, W07: Q, W08: Q, W09: Q, W10: Q, W11: Q, W12: Q, W13: Q, W14: Q,
  W15: './screens/founder/score.js?v=1',
  W16: './screens/founder/details.js?v=1',
  W17: './screens/founder/plan.js?v=1',
  W18: './screens/founder/payment.js?v=1',
  W19: './screens/founder/confirm.js?v=1',
  W20: './screens/founder/generate.js?v=1',
  W21: './screens/founder/dashboard.js?v=1',
  W22: './screens/founder/report.js?v=1'
};

export async function loadScreen(code) {
  const path = SCREENS[code];
  if (!path) throw new Error(`Unknown screen code: ${code}`);
  const mod = await import(path);
  return path === Q ? mod.makeScreen(code) : mod;
}
