# Gap list: Delivery at the gate

Source of truth: `docs/guard_app_ui_requirements_v0_1.md` and `docs/guard_app_build_context_v0_1.md` (read only). Sequence: `sequences/delivery-at-gate.json`. Seed (demo data): `mock-app/mock-data/seeds/delivery-at-gate.json`.

## Spec gaps

1. **Flow letters differ between the two documents.** Delivery is Flow D in the UI requirements and Flow E in the build context. This tour follows the build-context letter (Flow E).
2. **Which delivery types may enter.** Both documents say not to assume every delivery person may enter, and leave which types may enter or must stay at the gate as a sponsor question (UI requirements section 8, question 6). The tour assumes the parcel is held at the gate. The S08 note says the rule is not defined.
3. **Category-specific rule.** Build context Flow E step 3 says the app applies a category-specific rule (approved entry, resident approval, or gate handover). No rule, wording or screen for that choice is defined. The tour records a gate hold only.
4. **Parcel photo.** "Parcel reference or photo if required" has no condition for when it is required. The photo button shows a toast saying it would open the camera.
5. **Where the parcel is held.** The build context asks to record where the parcel is held and its status. No location field or list of places is defined. Only the status "Held at gate" is shown.
6. **Collection confirmation.** The documents say to record the resident's collection or handover but do not say how the resident is identified or confirmed (signature, code, name). The tour has one "Mark collected" button.
7. **Resident notification.** Neither document says whether the resident is told that a parcel has arrived.
8. **Holding choices.** The "Holding" options (Held at gate, Handed over at gate) are taken from the document's "storage/holding status" and "handover/collection". The exact labels are the walkthrough's own.
9. **No visitor check-out.** S08 says a delivery handed over at the gate does not need an inside-visitor check-out. The tour does not add the courier to the visitors-inside list.

## Walkthrough notes (not spec gaps)

- The tour ends when "Mark collected" is tapped.
- The recipient flat, company, parcel reference and time are demo values.
