# Implementation: Vendor PO for shortfall (WI-032)

Requirement REQ-376 · Feature FEAT-1339 · Decision DEC-411
Applications: web (primary), api (other)

## Scope delivered in this work item
Create and list vendor purchase orders. The shortage view and the vendor picker are **not** in this work item; they wait on Vendor master (story 4) and Bill of materials (story 9). See "Follow-up".

## Approach
- **api**: `GET` and `POST /api/procurement/purchase-orders`. Create takes vendor, part, quantity and rate and stores the PO with status `created`. List returns the tenant's POs, newest first (max 200). Validation errors answer 400 with the message.
- **web**: `Vendors > Procurement` screen at `/vendors/procurement`. Form (Vendor ID, Part ID, Order qty, Rate, "Create PO") with client-side checks that mirror the API, and a list of POs with their status.
- **web**: `/dashboard` shows procurement figures from the same list (PO count, open POs, vendors, order value) and the five latest POs, with a link to the Procurement screen.

## Files
- apps/api/src/procurement/purchaseOrders.ts: PO service, migration SQL (`purchase_orders` table), validation.
- apps/api/src/procurement/poRoutes.ts: the two routes; the table is created on first use.
- apps/api/src/glue/routes.ts: route registration (between the `knm:entries` markers).
- apps/api/src/db/schema.ts: Drizzle definition of `purchase_orders`.
- apps/web/src/state/procurementStore.ts: PO list in the app store, loader, form rules, dashboard summary.
- apps/web/src/app/procurement/ProcurementPage.tsx: Procurement screen.
- apps/web/src/app/dashboard/DashboardPage.tsx: dashboard (added beyond the plan; see Assumptions).
- apps/web/src/app/router.tsx: routes `/vendors/procurement` and `/dashboard` (between the `knm:entries` markers).
- Tests: apps/api/tests/modules/procurement-po/contract/{purchaseOrders,poRoutes}.test.ts; apps/web/tests/modules/procurement-po/contract/{ProcurementPage,DashboardPage}.test.tsx.

## Follow-up (not in this work item)
- Shortage view: needed quantity per part (BOM, story 9), stock in hand (source still to be confirmed) and shortfall (needed minus stock). The order quantity prefill then uses the shortfall.
- Vendor picker from the Vendor master (story 4); until then the form takes a vendor ID.
- Auth: the web app does not send a token yet; the API's JWT middleware needs it for the screens to load.
- Dev proxy: `/api` is not proxied by Vite; the screens need the API on the same origin or a proxy.

## Dependencies
- OEM: Vendor master (story 4) for the vendor picker. Follow-up.
- OEM: Bill of materials per model (story 9) for needed quantity. Follow-up.
- Stock in hand: source to be confirmed. Follow-up.

## Risks
- The PO table and its status values are new; a later approval flow will need to extend them.
- The migration runs on first request, not from the database module.

## Assumptions
- Emailing the PO to the vendor is out of scope (REQ-376 open question; the feature catalog's auto-email N17 is not in this story).
- Approval of the vendor PO is not in this story. The PO is created with an initial status only.
- The dashboard was added during implementation to show the feature; it is not in the original plan and is recorded here for review.
