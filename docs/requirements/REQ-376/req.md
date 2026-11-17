# OEM: Vendor purchase order for shortfall (MERGED)

> Merged into REQ-370 (OEM: Vendor master and vendor purchase orders). Feature FEAT-1339 and decision DEC-411 are superseded
> by FEAT-1333 and DEC-405. The original text is kept below for audit; the merged requirement is the source of truth.

---

# OEM: Vendor purchase order for shortfall

Requirement REQ-376 · Feature FEAT-1339 · Decision DEC-411
Order: 10 of 37 · Depends on: 4 OEM: Vendor master, 9 OEM: Bill of materials per model

## Purpose
Procurement manager raises a vendor purchase order for material that is short against demand.

## Behaviour
- Procurement manager sees needed quantity against stock in hand, per part.
- Procurement manager picks a vendor and enters order quantity and rate.
- The PO is created and listed with its status.

## Acceptance criteria
1. Needed quantity versus stock in hand is shown per part.
2. A vendor PO can be created with vendor, quantity and rate.
3. The PO is listed with its status.

## Source documents
- docs/source/functional_brief.md section 2.11
- docs/source/workflows/feature_catalog.md O40, O41
- docs/source/workflows/flow_first_order.md

## Open questions
- Is the PO document emailed to the vendor, or only the internal approval request? (feature catalog O41; N17 auto-email is not in this story.)
- Who approves the vendor PO? Approval is by email to the OEM approval admin today.
