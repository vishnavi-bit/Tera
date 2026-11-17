// Scaffold-owned glue file (STORY-105). Modules register at the markers below; do not edit the marked lines by hand.
// knm:imports
import { poRoutes } from '../procurement/poRoutes'; // WI-032
import { vendorRoutes } from '../procurement/vendorRoutes'; // WI-035
import { loginRoutes } from '../auth/loginRoutes'; // REQ-369 slice: sign-in

export const routes = [
  // knm:entries
  loginRoutes, // REQ-369 slice: sign-in
  poRoutes, // WI-032
  vendorRoutes, // WI-035
  // knm:entries-end
];
