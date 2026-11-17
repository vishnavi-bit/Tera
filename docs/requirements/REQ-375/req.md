# OEM: Bill of materials per model

Requirement REQ-375 · Feature FEAT-1338 · Decision DEC-410
Order: 9 of 37 · Depends on: 5 OEM: Vehicle models with variants and five price tiers, 6 OEM: Spares and components catalogue

## Purpose
Production manager defines the bill of materials (BOM) for a vehicle model: parts, quantities, images and landing price. Requisitions read quantities from it.

## Behaviour
- Production manager adds a BOM line with part, quantity and image for a model.
- A BOM line can be edited and removed.
- Material requisition (story 15) and branding requisition (story 18) read quantities from the BOM.

## Acceptance criteria
1. A BOM line can be added with part, quantity and image.
2. A BOM line can be edited and removed.
3. Requisitions take quantities from the BOM.

## Source documents
- docs/source/functional_brief.md section 2.4 step 1
- docs/source/workflows/feature_catalog.md N08
- docs/source/workflows/flow_first_order.md

## Open questions
- BOM versioning and approval (N09): does every change need versioning, or only material changes? Who approves: Production Head, QC or OEM Admin? Not in this story.
