# OEM: QC branding and packaging requisition

Requirement REQ-384 · Feature FEAT-1347 · Decision DEC-419
Order: 18 of 37 · Depends on: 9 OEM: Bill of materials per model, 17 OEM: QC inspection checklist per unit

## Purpose
QC manager requests branding and packaging items from inventory for a passed unit. Items come from the BOM.

## Behaviour
- QC manager picks a passed unit; branding and packaging lines are filled from the BOM.
- The requisition shows stock available for each line.
- It can be submitted only for a unit that passed QC.

## Acceptance criteria
1. Branding and packaging lines are filled from the BOM for a passed unit.
2. Stock available is shown per line.
3. A unit that did not pass QC cannot be requisitioned.

## Source documents
- docs/source/functional_brief.md section 2.4 step 6
- docs/source/workflows/feature_catalog.md N06

## Open questions
- None.
