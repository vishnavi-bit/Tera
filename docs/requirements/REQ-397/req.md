# OEM: Read-only view of dealer sales

Requirement REQ-397 · Feature FEAT-1360 · Decision DEC-432
Order: 31 of 37 · Depends on: 29 Dealer: Sale invoice with serial capture, 30 Dealer: Customer payment against invoice

## Purpose
OEM sales user views a dealer's customers, enquiries and sold vehicles, read-only. The OEM never creates or edits dealer customer records.

## Behaviour
- OEM sales user views the dealer's customers, enquiries, invoices, payments, services and warranty claims.
- No create, edit or delete is offered on dealer records.
- Only dealers the user is assigned to are visible.
- Customer personal data is masked for roles not allowed to see it.

## Acceptance criteria
1. The dealer's customers, enquiries, invoices, payments, services and warranty claims can be viewed.
2. No create, edit or delete is offered.
3. Only assigned dealers are visible.

## Source documents
- docs/source/functional_brief.md sections 2.8, 2.15
- docs/source/workflows/feature_catalog.md O07, O08, O09

## Open questions
- Customer PII is unmasked on the OEM side in the reference app (O07, F9 gap). Which roles see unmasked data, and does masking apply here?
