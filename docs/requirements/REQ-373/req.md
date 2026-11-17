# OEM: Dealer onboarding with login

Requirement REQ-373 · Feature FEAT-1336 · Decision DEC-408
Order: 7 of 37 · Depends on: 1 OEM: Regions, zones and operating states, 2 OEM: Manufacturing unit setup, 3 OEM: OEM users and roles

## Purpose
OEM admin onboards a dealer with its region, zone, manufacturing unit and login. Nothing can be bought before this.

## Behaviour
- OEM admin creates a dealer with type, owner, firm, GST, region, zone, unit, billing and shipping address, and bank details.
- Saving creates the dealer's login in the same step.
- A dealer cannot be saved without a region, zone and unit.
- The dealer can sign in and see its tier's catalogue.

## Acceptance criteria
1. A dealer can be created with all listed fields.
2. Saving creates the dealer's login.
3. A dealer without region, zone or unit cannot be saved.
4. The dealer signs in and sees its tier's catalogue.

## Source documents
- docs/source/functional_brief.md sections 2.1, 3 (onboarding-to-first-order)
- docs/source/workflows/feature_catalog.md O04, O05, D01
- docs/source/workflows/flow_first_order.md

## Open questions
- GSTIN auto-fill for dealer onboarding (N01): same open provider question as the vendor master.
