# Resident App: scope for the mock-up

**Status: derived, not a specification.** No Resident App document has been provided. These screens come only from what the two Guard App documents say residents do. Anything not in those documents is shown as "Not defined". Replace this file with the real Resident App document when there is one.

Sources: `apps/guard/docs/guard_app_ui_requirements_v0_1.md` (UI) and `apps/guard/docs/guard_app_build_context_v0_1.md` (build context).

## What the Guard documents say about residents

| Statement | Source |
|---|---|
| Resident App is for residents and family members; part of the first release with Guard and Admin Apps. | UI s.2; build context s.1 |
| Residents approve or reject unexpected visitors in the Resident App. | Build context s.3, Flow C |
| A visitor may present a QR code or digital pass received through WhatsApp or another channel (a pre-approved guest). | UI s.2 |
| A guest may be pre-approved; the pass can be valid or expired/revoked. | UI s.4 S03; build context Flow A |
| A phone call alone is not approval; the explicit decision is recorded. | UI s.4 S05 |
| Delivery handled at the gate can be held and collected by the resident. | UI s.4 S08; Flow E |
| Resident availability status may be supplied to the guard. | UI s.4 S05 |

## Screens built

| Code | Screen | Based on |
|---|---|---|
| R01 | Home | Navigation hub (own choice; no navigation pattern is defined) |
| R02 | Approvals | Resident receives a request and opens the app (Flow C step 3) |
| R03 | Visitor Request | Resident approves or rejects (Flow C step 4) |
| R04 | Pre-approve a Guest | Pre-approved visitor with a pass (Flow A) |
| R05 | Guest Pass | QR or digital pass sent through WhatsApp or another channel |
| R06 | Visitor History | Result of decisions; entries and exits for the flat |
| R07 | Parcels at the Gate | Parcels held at the gate (Flow E) |

## Not covered

Login, profile, family members, notification settings, resident availability setting, domestic help schedules, RFID cards, payments and anything else not named above.
