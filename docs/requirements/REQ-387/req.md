# Dealer: Dealer confirms delivery or reports issue

Requirement REQ-387 · Feature FEAT-1350 · Decision DEC-422
Order: 21 of 37 · Depends on: 20 OEM: Chassis validation and dispatch shipment

## Purpose
Dealer owner confirms receipt of a shipment, or rejects it or reports a problem with it.

## Behaviour
- Dealer owner sees each dispatched shipment with its lines.
- Dealer confirms receipt, which sets the order to delivered.
- Dealer rejects with a reason or reports an issue, which opens an issue record.

## Acceptance criteria
1. Dispatched shipments are listed with their lines.
2. Confirming receipt sets the order to delivered.
3. Rejecting with a reason or reporting an issue opens an issue record.

## Source documents
- docs/source/functional_brief.md section 2.7
- docs/source/workflows/feature_catalog.md D30, D32, D36
- docs/source/workflows/flow_first_order.md

## Open questions
- None.
