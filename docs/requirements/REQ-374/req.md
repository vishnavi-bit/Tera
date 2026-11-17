# Dealer: Dealer staff accounts

Requirement REQ-374 · Feature FEAT-1337 · Decision DEC-409
Order: 8 of 37 · Depends on: 7 OEM: Dealer onboarding with login

## Purpose
Dealer owner adds salesmen and servicemen to the dealership, so staff can work enquiries and service jobs.

## Behaviour
- Dealer owner creates a staff user with role Salesman or Serviceman, name, email, phone and password.
- A staff user signs in and sees only the dealer's own data.
- Dealer owner edits staff users. The owner role is held by the owner only.

## Acceptance criteria
1. A staff user can be created with role Salesman or Serviceman.
2. A staff user sees only the dealer's own data.
3. The owner role cannot be given to staff.

## Source documents
- docs/source/functional_brief.md sections 1, 2.15
- docs/source/people.md (Swati, sales; Latha, service)
- docs/source/workflows/feature_catalog.md D48, D49

## Open questions
- Sub-dealer role assignment (N11): is it in this story or a later one? Source calls it a new requirement.
