# OEM: Spares and components catalogue

Requirement REQ-372 · Feature FEAT-1335 · Decision DEC-407
Order: 6 of 37 · Depends on: 4 OEM: Vendor master, 5 OEM: Vehicle models with variants and five price tiers

## Purpose
OEM admin creates spares and components (battery, charger, motor, controller) linked to a vendor and a price, so they can be ordered and invoiced.

## Behaviour
- OEM admin creates a spare or component with type, vendor, HSN, GST and images.
- A dealer price and a customer price are stored.
- The item is switched on per manufacturing unit.
- The item cannot be saved without a vendor.

## Acceptance criteria
1. A spare or component can be created with type, vendor, HSN, GST and images.
2. A dealer price and a customer price are stored.
3. The item can be switched on per unit.
4. Saving without a vendor is refused.

## Source documents
- docs/source/functional_brief.md section 2.2
- docs/source/workflows/feature_catalog.md O27, O28

## Open questions
- None.
