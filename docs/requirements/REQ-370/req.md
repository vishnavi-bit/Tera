# OEM: Vendor master and vendor purchase orders

Requirement REQ-370 · Feature FEAT-1333 · Decision DEC-405
Order: 4 of 37 · Merges: 10 OEM: Vendor purchase order for shortfall (REQ-376, FEAT-1339, DEC-411)
Depends on: 3 OEM: OEM users and roles, 6 OEM: Spares and components catalogue (part picker), 9 OEM: Bill of materials per model (needed quantity)

## Purpose
OEM admin creates and edits vendors (suppliers). Spares and material purchases link to a vendor.
Procurement manager raises a vendor purchase order for material that is short against demand.

## Behaviour
- OEM admin creates a vendor with name, contact, phone, email, GST, address and active flag.
- OEM admin edits and deactivates a vendor.
- An inactive vendor cannot be chosen on a new spare or vendor PO.
- Procurement manager sees needed quantity against stock in hand, per part.
- Procurement manager picks a vendor and enters order quantity and rate.
- The PO is created and listed with its status.

## Acceptance criteria
1. A vendor can be created with all listed fields.
2. A vendor can be edited and deactivated.
3. An inactive vendor is not selectable on new spares or vendor POs.
4. Needed quantity versus stock in hand is shown per part.
5. A vendor PO can be created with vendor, quantity and rate.
6. The PO is listed with its status.

## Release split
- Release 1: acceptance criteria 1, 2, 3, 5 and 6. The PO is entered by hand (part and unit typed as ids), since the part catalogue and units are not built yet.
- Release 2: acceptance criterion 4 (the shortage view, and the order quantity prefilled from the shortfall). It waits on Bill of materials (REQ-375, order 9).

## Source documents
- docs/source/functional_brief.md section 2.11
- docs/source/workflows/feature_catalog.md O39, N01 (vendor master); O40, O41 (vendor PO)
- docs/source/workflows/flow_first_order.md (vendor PO)

## Open questions
- GSTIN auto-fill from the GST portal (N01): which provider or API? It needs an external integration partner.
- Is the PO document emailed to the vendor, or only the internal approval request? (feature catalog O41; N17 auto-email is not in this story.)
- Who approves the vendor PO? Approval is by email to the OEM approval admin today.
- Where do "needed" (BOM) and "stock in hand" come from? WI-032 flags stock as still to be confirmed.

## Merge notes
- REQ-376 (order 10) is merged into this requirement. Its original text is kept in docs/requirements/REQ-376/req.md for audit.
- Orders 5 to 9 and 11 onward keep their numbers. REQ-377 (order 11) now depends on 4.
- Approved text changed by this merge: product-owner re-approval is needed in KNM.
