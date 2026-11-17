# OEM: OEM approves order and verifies payment

Requirement REQ-380 · Feature FEAT-1343 · Decision DEC-415
Order: 14 of 37 · Depends on: 13 Dealer: Dealer pays order advance

## Purpose
OEM sales user approves a dealer order and verifies its advance payment, which starts production.

## Behaviour
- OEM sales user approves or rejects a pending order, with remarks on rejection.
- OEM sales user verifies or rejects a submitted payment, with a reason on rejection.
- A verified advance of at least 30 percent moves the order to production started.
- Any surplus is credited to the dealer ledger.

## Acceptance criteria
1. An order can be approved or rejected, with remarks on rejection.
2. A payment can be verified or rejected, with a reason on rejection.
3. A verified advance of at least 30 percent sets the order to production started.
4. Surplus is credited to the dealer ledger.

## Source documents
- docs/source/functional_brief.md sections 2.5, 2.6
- docs/source/workflows/feature_catalog.md O17, O20, O23, O24
- docs/source/workflows/flow_first_order.md

## Open questions
- Which OEM roles can approve orders and verify payments? The approval is by Sales (Head, Regional, Zonal); the Accounts role also verifies payments. Confirm the split.
