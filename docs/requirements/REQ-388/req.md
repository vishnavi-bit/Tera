# OEM: Shipment issue review and settlement

Requirement REQ-388 · Feature FEAT-1351 · Decision DEC-423
Order: 22 of 37 · Depends on: 21 Dealer: Dealer confirms delivery or reports issue

## Purpose
Issue manager reviews a dealer-reported shipment issue and settles it with money or a replacement.

## Behaviour
- Issue manager sees the issue with its stage, lines and attachments.
- Issue manager approves or declines at each review stage, with remarks.
- A settled issue closes with money or a replacement; a replacement is dispatched.

## Acceptance criteria
1. The issue is shown with its stage, lines and attachments.
2. Approve or decline is possible at each stage, with remarks.
3. A settled issue is closed, and a replacement is dispatched.

## Source documents
- docs/source/functional_brief.md section 2.9
- docs/source/workflows/feature_catalog.md O42, D36

## Open questions
- Who approves at each stage? The source names a manager review, then OEM approval (O42). Which roles?
