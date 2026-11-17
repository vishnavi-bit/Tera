# OEM: QC inspection checklist per unit

Requirement REQ-383 · Feature FEAT-1346 · Decision DEC-418
Order: 17 of 37 · Depends on: 16 OEM: Production completion and handover

## Purpose
QC manager completes a yes/no inspection checklist for each finished unit. Only passed units move on.

## Behaviour
- The checklist items are shown for each finished unit.
- Each item is answered yes or no; all items must be answered.
- A unit with any failed item goes back to production and is not released.
- A unit with all items passed is released to the next step.

## Acceptance criteria
1. The checklist is shown for each finished unit.
2. Every item must be answered yes or no before submitting.
3. Any failed item sends the unit back to production.
4. A unit with all items passed is released.

## Source documents
- docs/source/functional_brief.md section 2.4 step 5
- docs/source/workflows/feature_catalog.md N05
- docs/source/workflows/flow_first_order.md

## Open questions
- The checklist items themselves are not in the sources. Who maintains them, and what are the items? Needed before build.
