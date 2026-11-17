# OEM: Production completion and handover

Requirement REQ-382 · Feature FEAT-1345 · Decision DEC-417
Order: 16 of 37 · Depends on: 15 OEM: Material requisition against an order

## Purpose
Production manager records the identifiers of a finished unit and hands it to inventory. This makes each vehicle traceable from production.

## Behaviour
- Records chassis, motor, battery and controller identifiers for a finished unit.
- An identifier already used on another unit is refused.
- On handover the unit appears in inventory as built, with its identifiers, linked to its order.
- A unit cannot go on to QC without its identifiers.

## Acceptance criteria
1. Chassis, motor, battery and controller identifiers can be recorded for a unit.
2. An identifier used on another unit is refused.
3. Handover puts the unit in inventory as built, linked to its order.
4. A unit without identifiers cannot go to QC.

## Source documents
- docs/source/functional_brief.md sections 2.3, 2.4 step 4
- docs/source/workflows/feature_catalog.md N04
- docs/source/workflows/flow_first_order.md

## Open questions
- Is one motor and one battery per unit always the case, or can a unit have several? Source shows one of each per line on the invoice (D20).
