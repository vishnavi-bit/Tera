# OEM: OEM handles warranty claim

Requirement REQ-401 · Feature FEAT-1364 · Decision DEC-436
Order: 35 of 37 · Depends on: 19 OEM: Assign units to dealer order with stock reservation, 34 Dealer: Raise warranty claim to OEM

## Purpose
OEM service engineer verifies and inspects a warranty claim, then approves it for replacement or service, or rejects it.

## Behaviour
- OEM verifies a claim, records an inspection report, and rejects with a reason shown to the dealer.
- An approved claim is serviced or replaced; replacement is stock-checked and blocked when no stock.
- Replacement deducts OEM stock, not dealer stock.
- Return logistics can be recorded; the dealer confirms receipt.

## Acceptance criteria
1. A claim can be verified and inspected, with an inspection report.
2. A rejected claim shows its reason to the dealer.
3. Replacement is blocked when OEM stock is zero, and deducts OEM stock on approval.
4. Return logistics can be recorded and confirmed by the dealer.

## Source documents
- docs/source/functional_brief.md section 2.9
- docs/source/workflows/flow_service_warranty.md
- docs/source/workflows/feature_catalog.md O43, O44, D39

## Open questions
- Service-or-replacement decision rules: who chooses, and on what basis? Source only says the OEM decides.
