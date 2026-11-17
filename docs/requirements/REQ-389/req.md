# OEM: Dealer ledger and shared credit

Requirement REQ-389 · Feature FEAT-1352 · Decision DEC-424
Order: 23 of 37 · Depends on: 13 Dealer: Dealer pays order advance, 14 OEM: OEM approves order and verifies payment

## Purpose
Accounts manager maintains a shared dealer ledger and applies credit to approved orders. Surplus payments are not lost.

## Behaviour
- Accounts manager creates a ledger and connects or removes dealers.
- Accounts manager adds a credit or debit with a supporting document.
- Several dealers draw from one shared balance; every movement is listed in history.
- A surplus payment is credited to the ledger automatically.

## Acceptance criteria
1. A ledger can be created; dealers can be connected or removed.
2. A credit or debit can be added with a supporting document.
3. Several dealers draw from one balance, and history lists every movement.
4. A surplus payment is credited automatically.

## Source documents
- docs/source/functional_brief.md section 2.6
- docs/source/workflows/feature_catalog.md O46, O47, D33, D34

## Open questions
- Ledger top-ups have no proof upload in the reference app (D46, spec gap). Close the gap or keep it?
