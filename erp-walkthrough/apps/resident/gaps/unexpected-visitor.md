# Gap list: Approve or reject a visitor

There is **no Resident App specification**. Screens are derived from the Guard App documents (`docs/resident_app_scope.md`). Sequence: `sequences/unexpected-visitor.json`. Seed (demo data): `mock-app/mock-data/seeds/unexpected-visitor.json`.

## Spec gaps

1. **No Resident App document.** Every screen here is the walkthrough's own layout, based on Flow C of the build context ("Resident approves or rejects").
2. **How the resident is notified.** "Receives a notification and opens the Resident App or uses a supported notification action." Push, in-app or WhatsApp is not defined. The tour starts on Home with one request waiting.
3. **What the request shows.** Visitor name, category, purpose, gate, time and a photo are assumed from what the guard registers (UI S04). The wording and layout are the walkthrough's own.
4. **Reason or note.** Whether the resident can give a reason is not defined; the field shows a "Not defined" alert.
5. **No answer.** The default is no entry. How long a request stays open and whether it expires is not defined.
6. **Answering from the notification.** "A supported notification action" is mentioned but not designed.
7. **Resident availability.** The guard may see an availability status "when supplied". There is no screen where the resident sets it.

## Walkthrough notes (not spec gaps)

- The tour branches at the request: Approve and Reject both end on the visitor history.
- The Guard App's matching walkthroughs are "Unlisted visitor: guard asks, resident approves" and "... rejects" in the `guard` app, which switch to these screens.
