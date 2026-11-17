# OEM: Assign units to dealer order with stock reservation

Requirement REQ-385 · Feature FEAT-1348 · Decision DEC-420
Order: 19 of 37 · Depends on: 14 OEM: OEM approves order and verifies payment, 17 OEM: QC inspection checklist per unit

## Purpose
Dispatch manager assigns finished units to a dealer order. Stock is reserved automatically once the order is 30 percent paid.

## Behaviour
- Dispatch manager assigns units by manufacturing unit, model, variant and colour, with identifiers.
- Stock is reserved automatically when the verified payment reaches 30 percent.
- A unit already assigned to another order cannot be assigned again.
- Only units that passed QC can be assigned.

## Acceptance criteria
1. Units can be assigned by unit, model, variant and colour, with identifiers.
2. Stock is reserved automatically at 30 percent verified payment.
3. An already-assigned unit is refused.
4. Only QC-passed units can be assigned.

## Source documents
- docs/source/functional_brief.md sections 2.3, 2.7
- docs/source/workflows/feature_catalog.md O21
- docs/source/workflows/flow_first_order.md

## Open questions
- The source notes no chassis is entered at assignment (O21), but N07 says identifiers are validated before assignment. Which is it? Confirm in story 20.
