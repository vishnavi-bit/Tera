# OEM: Chassis validation and dispatch shipment

Requirement REQ-386 · Feature FEAT-1349 · Decision DEC-421
Order: 20 of 37 · Depends on: 18 OEM: QC branding and packaging requisition, 19 OEM: Assign units to dealer order with stock reservation

## Purpose
Dispatch manager validates the chassis and identifiers of assigned units, then dispatches the shipment. Only verified units leave the unit.

## Behaviour
- Before dispatch, each unit's chassis and identifiers are checked against the record.
- A unit with a mismatch is blocked and cannot be shipped.
- Dispatch takes stock out of inventory, records transport details and per-line quantities, and sets the order to dispatched.
- Partial dispatch is supported.

## Acceptance criteria
1. Each unit's identifiers are checked against the record before dispatch.
2. A mismatch blocks the unit from shipping.
3. Dispatch deducts stock, records transport details and per-line quantities, and sets the order to dispatched.
4. A partial dispatch is possible.

## Source documents
- docs/source/functional_brief.md section 2.7
- docs/source/workflows/feature_catalog.md N07, O22
- docs/source/workflows/flow_first_order.md

## Open questions
- What exactly is validated (chassis number against the invoice, or all four identifiers)? Source says "correct chassis number and all identifiers" (N07) without a list.
