# Dealer: Raise warranty claim to OEM

Requirement REQ-400 · Feature FEAT-1363 · Decision DEC-435
Order: 34 of 37 · Depends on: 21 Dealer: Dealer confirms delivery or reports issue, 29 Dealer: Sale invoice with serial capture

## Purpose
Dealer serviceman raises a warranty claim to the OEM for a chassis and part, so the defect is reviewed.

## Behaviour
- Claim picks the customer, chassis or spare, and serial.
- Claim has an issue, remarks and up to 10 images.
- Claim can be raised to the OEM or to the dealer's own service team.
- A claim raised to the OEM appears in the OEM queue with status raised.

## Acceptance criteria
1. A claim can be raised with customer, chassis or spare, and serial.
2. A claim has an issue, remarks and up to 10 images.
3. A claim raised to the OEM appears in the OEM queue.

## Source documents
- docs/source/functional_brief.md section 2.9
- docs/source/workflows/flow_service_warranty.md
- docs/source/workflows/feature_catalog.md D37, D38

## Open questions
- Dealer's own service team (self-contained) is also an option. Is that path in this story, or only the OEM route?
