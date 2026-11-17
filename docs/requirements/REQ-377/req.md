# OEM: Material inward with QC check

Requirement REQ-377 · Feature FEAT-1340 · Decision DEC-412
Order: 11 of 37 · Depends on: 4 OEM: Vendor master and vendor purchase orders (merged from 10)

## Purpose
Inventory executive receives material against a vendor PO and QC-checks each item. Only good stock enters inventory.

## Behaviour
- Records the received quantity against the PO.
- Records any shortfall against the PO quantity.
- Marks each item pass or fail; fail and scrap items do not enter stock.
- Only passed quantity increases stock.

## Acceptance criteria
1. Received quantity is recorded against the PO.
2. Shortfall against the PO quantity is recorded.
3. Each item is marked pass or fail.
4. Only passed quantity increases stock.

## Source documents
- docs/source/functional_brief.md section 2.4 step 2
- docs/source/workflows/feature_catalog.md N02

## Open questions
- Is scrap a separate state from fail, and does scrap need a reason? Source says "mark scrap" without detail.
