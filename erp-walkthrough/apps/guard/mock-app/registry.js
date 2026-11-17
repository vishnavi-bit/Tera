// Approved screen modules. Add a line here when a screen is added.
export const SCREENS = {
  S01: './screens/guard/login.js?v=1',
  S02: './screens/guard/home.js?v=2',
  S03: './screens/guard/scan-pass.js?v=2',
  S04: './screens/guard/register-visitor.js?v=1',
  S05: './screens/guard/approval-status.js?v=2',
  S06: './screens/guard/entry-decision.js?v=2',
  S07: './screens/guard/visitors-inside.js?v=2',
  S08: './screens/guard/delivery.js?v=2',
  S09: './screens/guard/activity.js?v=1',
  R01: './screens/resident/home.js?v=1',
  R02: './screens/resident/approvals.js?v=1',
  R03: './screens/resident/visitor-request.js?v=1',
  R04: './screens/resident/pre-approve.js?v=1',
  R05: './screens/resident/pass-created.js?v=1',
  R06: './screens/resident/history.js?v=1',
  R07: './screens/resident/parcels.js?v=1'
};

export async function loadScreen(code) {
  const path = SCREENS[code];
  if (!path) throw new Error(`Unknown screen code: ${code}`);
  return import(path);
}
