# Test plan: Vendor PO for shortfall (TC-017)

Requirement REQ-376 · Work item WI-032
Applications: web (primary, Vendors > Procurement), api (PO endpoints)

## Scope
- In scope: shortage view per part, vendor PO create, PO list with status.
- Out of scope: emailing the PO to the vendor (WI-032 and REQ-376 open question); PO approval flow.

## Scenarios

### S1 Shortage view shows needed, stock in hand and shortfall per part (web + api)
Acceptance: REQ-376 item 1.
1. Seed a part with needed quantity 100 and stock in hand 30.
2. Open Vendors > Procurement.
3. Expected: the part row shows needed 100, stock in hand 30, shortfall 70.
4. Seed a part with stock in hand greater than or equal to needed.
5. Expected: shortfall is 0 (or no shortage is shown); the row is not treated as short.

### S2 Opening a part prefills the PO form with the shortfall (web)
Acceptance: REQ-376 items 1 and 2 (WI-032 approach).
1. From S1, select the part with shortfall 70.
2. Expected: the PO form opens with order quantity 70 prefilled and the vendor picker empty.
3. Change the order quantity to 80.
4. Expected: the field accepts 80; the prefilled value is replaced by the user value.

### S3 Form validation blocks an incomplete PO (web)
Acceptance: REQ-376 item 2.
1. Open the PO form for a part.
2. Click "Create PO" without choosing a vendor.
3. Expected: no PO is created; a validation message names the missing vendor.
4. Choose a vendor, leave rate empty, click "Create PO".
5. Expected: no PO is created; validation names the missing rate.
6. Enter quantity 0 or a negative quantity.
7. Expected: no PO is created; validation rejects the quantity.

### S4 Create a vendor PO and see it listed with its status (web + api)
Acceptance: REQ-376 items 2 and 3.
1. Choose vendor V1, quantity 70, rate 12.50 for the part from S2.
2. Click "Create PO".
3. Expected: API responds with a PO containing vendor, part, quantity 70, rate 12.50 and an initial status.
4. Expected: the PO appears in the PO list below the form with the same vendor, quantity, rate and status.
5. Expected: no email is sent to the vendor (out of scope; assert no email call is made).

### S5 API create and list (api)
Acceptance: REQ-376 item 3.
1. POST a PO with vendor, part, quantity, rate.
2. Expected: a PO record is returned with an id and an initial status.
3. GET the PO list.
4. Expected: the created PO is in the list with its status.
5. POST with a missing vendor, missing part or non-numeric rate.
6. Expected: request is rejected with a validation error; no PO is stored.

### S6 Shortage read per part (api)
Acceptance: REQ-376 item 1.
1. Request the shortage data for the seeded parts.
2. Expected: each part returns needed quantity, stock in hand and shortfall (needed minus stock in hand).

## Test data
- Use fixture parts with known needed and stock-in-hand values (for example 100/30 and 50/80).
- Use at least two vendors from the vendor master fixture.
- Stock-in-hand source is to be confirmed during implementation (WI-032); the test uses fixture values and does not assert where they come from.

## Existing automated tests (reference)
- apps/api/tests/modules/procurement-po/contract/purchaseOrders.test.ts
- apps/api/tests/modules/procurement-po/contract/poRoutes.test.ts
- apps/web/tests/modules/procurement-po/contract/ProcurementPage.test.tsx
- apps/web/tests/modules/procurement-po/contract/DashboardPage.test.tsx

## Pass criteria
All scenarios S1 to S6 pass. A failing scenario is reported with its step and the observed result.
