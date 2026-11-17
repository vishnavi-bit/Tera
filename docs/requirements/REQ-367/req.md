# OEM: Regions, zones and operating states

Requirement REQ-367 · Feature FEAT-1330 · Decision DEC-402
Order: 1 of 37 · Depends on: none

## Purpose
OEM admin maintains operating states, regions and zones. Dealers are placed in a region and zone, so these must exist first.

## Behaviour
- OEM admin creates, edits and lists operating states.
- OEM admin creates a region with a name and head; zones are added under a region with a name and head.
- Regions and zones are listed and selectable when onboarding a dealer (story 7).

## Acceptance criteria
1. Operating states can be created, edited and listed by OEM admin.
2. A region has a name and head; zones are added under it with a name and head.
3. Regions and zones appear as choices on dealer onboarding.

## Source documents
- docs/source/functional_brief.md sections 2.1, 2.15
- docs/source/workflows/feature_catalog.md O50, O51

## Open questions
- Is region and zone access (R8) scoped by server-side rules, or only by assigned dealers (R7)? Source says this needs a server-side test (feature catalog O51).
