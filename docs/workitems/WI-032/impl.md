# Implementation: Vendor PO for shortfall (WI-032)

Requirement REQ-376 · Feature FEAT-1339 · Decision DEC-411
Applications: web (primary), api (other)

## Approach
- **web**: add a "Procurement" screen under Vendors (`Vendors > Procurement`). It lists each part with needed quantity, stock in hand and shortfall (needed minus stock). Selecting a part opens a PO form: vendor picker, order quantity (prefilled with the shortfall), rate, and a "Create PO" action. Below the form, a list of POs with their status.
- **api**: add PO endpoints: create a vendor PO (vendor, part, quantity, rate, status) and list POs with status. Needed quantity and stock in hand are read from the BOM and stock data; the API returns them per part for the screen.
- Keep the screen to the mock layout (docs/requirements/REQ-376/mock.md). No new visual pattern.

## Areas and files likely affected
- apps/web/src/app: new Procurement page and its route under Vendors
- apps/web/src/state: PO list and shortage state
- apps/web/tests: component tests for shortage calculation and form validation
- apps/api/src/http: PO routes (shortage read, create, list)
- apps/api/src/db: PO table and queries
- apps/api/tests: route and validation tests

## Dependencies
- OEM: Vendor master (story 4): vendors to pick from must exist.
- OEM: Bill of materials per model (story 9): source of needed quantity.
- Stock in hand comes from the existing stock data; its source is to be confirmed during implementation.

## Risks
- Needed quantity depends on the BOM and demand; if those are not ready, the shortage view will be empty or wrong.
- The PO table and its status values are new; a later approval flow will need to extend them.

## Assumptions
- Emailing the PO to the vendor is out of scope (REQ-376 open question; the feature catalog's auto-email N17 is not in this story).
- Approval of the vendor PO is not in this story. The PO is created with an initial status only.
- Order quantity is prefilled with the shortfall but can be changed by the user.
