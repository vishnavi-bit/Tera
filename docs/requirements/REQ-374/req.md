# REQ-374: Dealer staff accounts

- Status: finalized (pending product owner approval)
- Decision: DEC-409
- Feature: FEAT-1337 (Dealer: Dealer staff accounts), group GRP-276
- Project: Tera

## Purpose

A dealer owner adds salesmen and servicemen to the dealership, so that the dealer's own staff can sign in and work enquiries and service jobs. Source of the need: docs/source/functional_brief.md sections 1 and 2.15; docs/source/people.md (dealer sales and service staff); docs/source/workflows/feature_catalog.md D48 and D49. This requirement is an enabler for G2 and G3 in docs/project/intent.md.

## Behaviour

1. The dealer owner can create a staff user. The staff user has one of two roles, Salesman or Serviceman, and carries a name, an email, a phone number and a password.
2. A staff user can sign in and sees only the dealer's own data.
3. The dealer owner can edit a staff user. The owner role is kept by the owner only: a staff user cannot hold it, and it cannot be given to a staff user through editing.

## Acceptance criteria

1. The dealer owner can create a staff user with role Salesman or Serviceman, name, email, phone and password.
2. A staff user can sign in and sees only the dealer's own data.
3. The dealer owner can edit a staff user, and the owner role is kept by the owner only.

## Questions

No questions were raised for this requirement. There were no answers to record.
