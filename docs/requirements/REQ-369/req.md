# OEM: OEM users and roles

Requirement REQ-369 · Feature FEAT-1332 · Decision DEC-404
Order: 3 of 37 · Depends on: 2 OEM: Manufacturing unit setup

## Purpose
OEM admin creates OEM users with a role and a unit scope, so that each user sees only what its role allows.

## Behaviour
- OEM admin creates a user with one of the OEM roles, name, contact and password.
- The user is scoped to a manufacturing unit; sales roles are also scoped to assigned dealers.
- A sales user with no assigned dealers sees no dealers.
- The server enforces row, field and action limits independently of the client.

## Acceptance criteria
1. A user can be created with one of the 15 OEM roles.
2. The user is scoped to a unit, and sales roles to assigned dealers.
3. A sales user with no assigned dealers sees no dealers.
4. Row, field and action limits are enforced on the server.

## Source documents
- docs/source/functional_brief.md sections 1, 2.15
- docs/source/people.md
- docs/source/workflows/feature_catalog.md O52, O53

## Open questions
- Which OEM roles can view and send announcements, and manage vendors? The role map does not key these (feature catalog O15, O39).
