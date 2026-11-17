# Dealer: Pay service charge on warranty claim

Requirement REQ-402 · Feature FEAT-1365 · Decision DEC-437
Order: 36 of 37 · Depends on: 14 OEM: OEM approves order and verifies payment, 35 OEM: OEM handles warranty claim

## Purpose
Dealer owner pays a service charge the OEM requested on a warranty claim. The OEM verifies the payment, and the claim can then proceed.

## Behaviour
- OEM requests a service charge on an approved claim, and can edit or waive it.
- Dealer submits payment for the charge with a receipt.
- OEM verifies or rejects the payment; a verified payment lets the claim proceed.

## Acceptance criteria
1. OEM can request, edit or waive a service charge on an approved claim.
2. Dealer can submit payment for the charge with a receipt.
3. OEM verifies or rejects; a verified payment lets the claim proceed.

## Source documents
- docs/source/functional_brief.md section 2.9
- docs/source/workflows/flow_service_warranty.md
- docs/source/workflows/feature_catalog.md D39, O44

## Open questions
- If the OEM charges a service fee, is it passed to the customer, absorbed by the dealer, or configurable? The source leaves this open (flow_service_warranty.md); the decision is needed before build.
