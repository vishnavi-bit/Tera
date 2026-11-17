# Gap list: Pre-approved visitor at the gate

Source of truth: `docs/guard_app_ui_requirements_v0_1.md` and `docs/guard_app_build_context_v0_1.md` (read only). Sequence: `sequences/pre-approved-visitor.json`. Seed (demo data): `mock-app/mock-data/seeds/pre-approved-visitor.json`.

## Spec gaps

1. **Flow letters differ between the two documents.** The UI requirements call the delivery flow D and the exit flow E. The build context calls delivery E and exit F, and has extra flows for phone decisions (D) and domestic help (G). The walkthroughs follow the build-context letters: this tour is Flow A (same in both).
2. **How the pass is validated.** The build context says a QR image is not proof by itself and must be checked against an authorised record. How that check works (backend, offline) is not defined. The scanner is simulated with a "Scan demo pass" button and the result is seed data.
3. **Resident-availability rule for a pre-approved visitor.** Both documents mention applying a resident-availability rule, and the UI requirements list it as a sponsor question (section 8, question 3 on what counts as a valid pass; section 5 table). The S06 row "Resident availability" shows a "Not defined" alert.
4. **Scan outcomes other than Valid.** S03 names Expired, Already Used, Not Found and Needs Verification. This tour shows only Valid. The other results have no layout or wording defined beyond their names.
5. **S03 to S06 hand-over.** The documents say "Valid pass/details" then "Confirm entry" but do not say whether the pass details are on S03 or on S04/S05. The walkthrough shows the pass details on S03 under the Valid result, then goes to S06.
6. **S06 reason text.** The documents require the reason to be shown but give no wording. The reason shown is the walkthrough's own text.
7. **Confirmation before entry.** The UI guidance asks for a confirmation before finalising an entry. The "Confirm entry" button on S06 is that confirmation; there is no second dialog.
8. **Time and decision source.** S06 must record time, gate, guard, category and decision source. The values shown (time 10:42, source "Scanned pass") are demo data.
9. **Navigation.** The documents give no navigation pattern. The walkthrough uses a bottom bar (Home, Scan, Inside, Parcels). The home actions Register Visitor and Pending Approvals lead to screens this tour does not build and show a toast saying what would open.
10. **Overdue limits.** S07 must flag overdue visits by category limit. The limits are not confirmed (build context section 8 calls the 30 minutes example illustrative). One overdue row is shown in demo data.
11. **Check Out on S07.** The tour ends on the list. Check Out shows a toast saying what would be recorded.

## Walkthrough notes (not spec gaps)

- The tour ends on S07 as soon as the step is shown. S07 has no control that finishes the tour.
- Demo data and a "Demo data" label appear on the home screen, as the documents ask.
- The resident's side (creating the pass) is not shown here. It is shown in the walkthrough "Pre-approved guest: resident creates pass, guard scans it". The Admin App is not shown.
