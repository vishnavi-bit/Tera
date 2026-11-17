# OEM: Vehicle models with variants and five price tiers

Requirement REQ-371 · Feature FEAT-1334 · Decision DEC-406
Order: 5 of 37 · Depends on: 2 OEM: Manufacturing unit setup

## Purpose
OEM admin creates a vehicle model with variants, colours and five price tiers. Each dealer sees only its own tier price.

## Behaviour
- OEM admin creates a model with type, motor and controller links, HSN and GST.
- Each variant has colours and five prices: Distributor, Divisional Distributor, District Dealer, Area Dealer and Customer.
- A dealer sees its own tier price and the customer price only.
- Availability is set per manufacturing unit.

## Acceptance criteria
1. A model can be created with type, motor and controller links, HSN and GST.
2. Each variant holds colours and five prices.
3. A dealer sees only its tier price and the customer price.
4. Availability can be set per manufacturing unit.

## Source documents
- docs/source/functional_brief.md section 2.2
- docs/source/workflows/feature_catalog.md O26

## Open questions
- None.
