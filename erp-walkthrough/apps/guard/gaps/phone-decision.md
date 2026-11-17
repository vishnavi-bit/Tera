# Gap list: Resident gives a decision by phone

Source of truth: `docs/guard_app_ui_requirements_v0_1.md` and `docs/guard_app_build_context_v0_1.md` (read only). Sequence: `sequences/phone-decision.json`. Seed (demo data): `mock-app/mock-data/seeds/phone-decision.json`.

## Spec gaps

1. **Flow letters.** The build context calls this Flow D (Flow C covers the resident not answering). The UI requirements do not have it as a separate flow.
2. **Phone calling.** "Call Resident" is named but how it dials (dialler, VoIP, intercom) is not defined. The mock only shows the call card.
3. **Recording the decision.** The documents require the explicit decision, source (phone), timestamp and guard to be recorded. The input design (buttons vs form) is not defined; the mock uses two buttons.
4. **Resident not answering at all.** The default is no entry. How long to wait, and how many retries, is not defined (UI requirements section 8, question 7).
5. **Reject by phone.** The "Resident rejected" button only shows a toast; the tour follows the approval.

## Walkthrough notes (not spec gaps)

- The tour starts at Home with one pending approval already waiting, as after an unanswered request.
