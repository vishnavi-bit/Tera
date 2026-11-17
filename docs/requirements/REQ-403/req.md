# Dealer: Vehicle history by chassis

Requirement REQ-403 · Feature FEAT-1366 · Decision DEC-438
Order: 37 of 37 · Depends on: 29 Dealer: Sale invoice with serial capture, 32 Dealer: Service job card, 34 Dealer: Raise warranty claim to OEM

## Purpose
Dealer owner sees a vehicle's sales, service and warranty history by chassis number. The vehicle can be traced from production to the customer sale and through its service.

## Behaviour
- A chassis number search shows the sale, the customer and the invoice.
- The history lists service jobs and warranty claims for that chassis, in date order.
- The history shows only the dealer's own records.

## Acceptance criteria
1. Searching a chassis shows the sale, the customer and the invoice.
2. The history lists service jobs and warranty claims in date order.
3. Only the dealer's own records are shown.

## Source documents
- docs/source/functional_brief.md sections 2.3, 3
- docs/source/workflows/feature_catalog.md D17, D18, O07

## Open questions
- None.
