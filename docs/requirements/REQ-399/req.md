# Dealer: Service price list and service invoice

Requirement REQ-399 · Feature FEAT-1362 · Decision DEC-434
Order: 33 of 37 · Depends on: 32 Dealer: Service job card

## Purpose
Dealer owner maintains a service price list. When a service job completes, a service-type invoice is issued.

## Behaviour
- Dealer owner adds, edits and deletes service items with a price.
- Completing a job creates a service-type invoice priced from the price list.
- Non-warranty parts on the job are added as paid line items from dealer stock.

## Acceptance criteria
1. Service items can be added, edited and deleted with a price.
2. Completing a job creates a service-type invoice priced from the list.
3. Non-warranty parts are added as paid lines and deduct dealer stock.

## Source documents
- docs/source/functional_brief.md section 2.10
- docs/source/workflows/flow_service_warranty.md
- docs/source/workflows/feature_catalog.md D26, D20, D42

## Open questions
- None.
