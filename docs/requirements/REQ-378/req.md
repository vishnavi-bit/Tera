# Dealer: Dealer places purchase order

Requirement REQ-378 · Feature FEAT-1341 · Decision DEC-413
Order: 12 of 37 · Depends on: 6 OEM: Spares and components catalogue, 7 OEM: Dealer onboarding with login

## Purpose
Dealer owner places a purchase order for vehicles, spares and accessories with a total quantity of 16, 20, 32 or 40 units.

## Behaviour
- Dealer owner picks a seller (manufacturing unit or higher-tier dealer), product, variant and colour.
- The cart shows live stock for each line.
- An order whose total is not 16, 20, 32 or 40 is refused with a clear message.
- The placed order is listed with status pending.

## Acceptance criteria
1. A seller, product, variant and colour can be picked.
2. Live stock is shown per line.
3. A total not in 16, 20, 32 or 40 is refused.
4. The placed order appears with status pending.

## Source documents
- docs/source/functional_brief.md section 2.5
- docs/source/workflows/feature_catalog.md D28, D29
- docs/source/workflows/flow_first_order.md

## Open questions
- Can a dealer order from a higher-tier dealer as seller, and does the 16/20/32/40 rule apply the same way? Source says both are possible; the rule is stated for the cart.
