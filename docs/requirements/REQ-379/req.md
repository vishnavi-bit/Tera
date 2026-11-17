# Dealer: Dealer pays order advance

Requirement REQ-379 · Feature FEAT-1342 · Decision DEC-414
Order: 13 of 37 · Depends on: 12 Dealer: Dealer places purchase order

## Purpose
Dealer owner pays an advance of at least 30 percent of an order, so that the order can move to production.

## Behaviour
- Dealer owner submits a payment with transaction id, amount, date and receipt, or enters the details manually.
- A payment below 30 percent of the order total does not move the order to production.
- The payment shows as waiting for verification until the OEM verifies it.

## Acceptance criteria
1. A payment can be submitted with transaction id, amount, date and receipt.
2. A payment below 30 percent does not move the order to production.
3. The payment shows as waiting for verification.

## Source documents
- docs/source/functional_brief.md sections 2.5, 2.6
- docs/source/workflows/feature_catalog.md D31, D46
- docs/source/workflows/flow_first_order.md

## Open questions
- Receipt upload uses OCR to fill transaction, amount and date (D31). Is OCR in this story, or is manual entry enough for the first release?
- Ledger top-ups have no proof upload (D46, spec gap). Keep or close that gap? See story 23.
