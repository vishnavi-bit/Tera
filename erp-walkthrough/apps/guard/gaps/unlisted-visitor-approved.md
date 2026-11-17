# Gap list: Unlisted visitor, guard asks, resident approves

Sources (read only): `apps/guard/docs/*` for the Guard screens; the Resident screens are derived, see `apps/resident/docs/resident_app_scope.md`. Sequence: `sequences/unlisted-visitor-approved.json`.

## Spec gaps

1. **Guard side.** Same gaps as the guard app's "Unlisted visitor, resident approves" list (registration fields, where the request is sent from, availability, decision-source wording).
2. **Resident side.** Same gaps as the resident app's "Approve or reject a visitor" list: no Resident App document, how the resident is notified, what the request shows, reason or note, expiry of an unanswered request.
3. **How the guard learns the answer.** "Refresh Status" is named, but push or poll is not defined. In this tour the answer is already there when the guard returns to S05, so no Refresh is needed.

## Walkthrough notes (not spec gaps)

- One phone shows both apps; the top bar colour and the bottom bar change with the app. A real guard and resident use separate devices.
- The resident's answer in this tour is fixed by the seed (`visit.residentDecision`). The other button only shows a toast.
