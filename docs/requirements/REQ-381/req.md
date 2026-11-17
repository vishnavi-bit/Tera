# OEM: Material requisition against an order

Requirement REQ-381 · Feature FEAT-1344 · Decision DEC-416
Order: 15 of 37 · Depends on: 9 OEM: Bill of materials per model, 11 OEM: Material inward with QC check, 14 OEM: OEM approves order and verifies payment

## Purpose
Production manager requests materials from inventory for a specific order. Quantities are read from the BOM.

## Behaviour
- Production manager picks an order; required parts and quantities are filled from the BOM.
- The requisition shows stock available for each part.
- Insufficient raw stock is flagged, and the user is directed to a vendor PO.

## Acceptance criteria
1. Parts and quantities are filled from the BOM for the chosen order.
2. Stock available is shown for each part.
3. Insufficient stock is flagged with a route to a vendor PO.

## Source documents
- docs/source/functional_brief.md section 2.4 step 3
- docs/source/workflows/feature_catalog.md N03
- docs/source/workflows/flow_first_order.md

## Open questions
- Requisition against a forecast and for loss or damage replacement (the other two cases in N03) are not in this story. Add them later, or in this story?
