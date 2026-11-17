// knm-managed: v1 version: 1
// Approved screen modules. Add a line here when a screen is added: CODE: './screens/<side>/<name>.js?v=1'
export const SCREENS = {
  S01: './screens/dealer/new-order.js?v=1',
  S02: './screens/dealer/order-payment.js?v=1',
  S03: './screens/oem/order-approval.js?v=1',
  S04: './screens/oem/assign-units.js?v=1',
  S05: './screens/oem/dispatch.js?v=1',
  S06: './screens/dealer/shipment.js?v=1',
};

export async function loadScreen(code) {
  const path = SCREENS[code];
  if (!path) throw new Error(`Unknown screen code: ${code}`);
  return import(path);
}
