# OEM: Vendor master

Requirement REQ-370 · Feature FEAT-1333 · Decision DEC-405
Order: 4 of 37 · Depends on: 3 OEM: OEM users and roles

## Purpose
OEM admin creates and edits vendors (suppliers). Spares and material purchases link to a vendor.

## Behaviour
- OEM admin creates a vendor with name, contact, phone, email, GST, address and active flag.
- OEM admin edits and deactivates a vendor.
- An inactive vendor cannot be chosen on a new spare or vendor PO.

## Acceptance criteria
1. A vendor can be created with all listed fields.
2. A vendor can be edited and deactivated.
3. An inactive vendor is not selectable on new spares or vendor POs.

## Source documents
- docs/source/functional_brief.md section 2.11
- docs/source/workflows/feature_catalog.md O39, N01

## Open questions
- GSTIN auto-fill from the GST portal (N01): which provider or API? It needs an external integration partner.
