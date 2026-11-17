// Approved screen modules. Add a line here when a screen is added.
export const SCREENS = {
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
