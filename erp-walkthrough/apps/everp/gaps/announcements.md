# Gap list: Announcements

Sequence: `sequences/announcements.json`. Seed (sample data): `mock-app/mock-data/seeds/announcements.json`. Screens: O15, O16, D05, D06 (all new).

## Spec gaps

1. **O15 and O16 roles are unkeyed.** The spec says "Role not in permission map — confirm access". Charan (Super Admin, `oem-super-admin`) is the one actor.
2. **O16 required marks are "?"** for Title, Description and Target Dealers. Shown without a required mark.
3. **O16 Target Dealers: the MU picker (muIds) has no label.** The select shows the two spec options, with "Selected Manufacturing Unit" chosen, and the MU name from the seed shown below it.
4. **The effect of create is not described.** The walkthrough adds the announcement to the list and sets the count to 1 (stateChange).
5. **The effect of edit and stop is not described.** Both show toasts only. No card (question A, approved).
6. **O15 "open" has no stated target.** It shows a toast.
7. **O15 and D05 list columns are not defined.** Title, Target Dealers and Attachment are used (see assumptions).
8. **D06 "full screen" and "download" have no stated targets.** Both show toasts. The download toast names the file from the seed.
9. **The File attachment:** the spec gives the types only (Image, PDF, Video). The upload effect is not defined. The file name is a sample PDF from the seed.
10. **The Table attachment option** is a grid that the spec does not describe. Only its radio label is shown.
11. **N20 (WhatsApp employee broadcast) has no screen.** It is shown on the O15 step as a "Not defined" card, with the heading "O15: Announcements List" (see walkthrough notes).

## Assumptions (approved)

12. **O15 and D05 columns: Title, Target Dealers, Attachment.** These labels come from O16 (Title, Target Dealers, Attachment). O15 also shows an "open" button in the Action column.
13. **R5 applies to D05.** Sri Lakshmi EVs is on MU Hosur, so it sees announcements for all manufacturing units and for MU Hosur. The sample announcement targets MU Hosur, so Ravi sees one row. This is a visibility rule, not a calculation.
14. **The "open" button on O15 and the "view" button on D05** are walkthrough moves (D05 view leads to D06).
15. **O15 "new" leads to O16** (the spec's new button).
16. **The "Announcements" floater count** starts at 0 and becomes 1 at the create step. It is a walkthrough choice, changed only by stateChange.
17. **The O15 list-column card is not shown.** A step can carry only one card, and the N20 card takes that step (approved).

## Walkthrough notes (not spec gaps)

- The N20 card is on the O15 step after the new announcement, because N20 is a broadcast to OEM employees, not to dealers (approved). Its heading reads "O15: Announcements List", because the card style takes the heading from the screen behind it.
- The tour ends on D06 for Ravi (approved).
- The sample attachment is a PDF file name from the seed.
