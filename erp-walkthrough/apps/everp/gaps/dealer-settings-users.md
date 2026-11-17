# Gap list: Dealer settings and users

Sequence: `sequences/dealer-settings-users.json`. Seed (sample data): `mock-app/mock-data/seeds/dealer-settings-users.json` (the dealer is the Setting up dealer sample, Sample Motors Coimbatore). Screens: D47 (rebuilt from the spec), D48 and D49 (new). No other screen is used.

## Spec gaps

1. **The dealer roles (D, S, V) are not in `docs/people.md`.** D47 to D49 allow D, S and V. Ravi Kumar (`dealer-owner`) is the actor, as an assumption. Swati (`dealer-sales`) is the new staff user.
2. **D47 has two field tables, and shop location appears in both.** It is shown once, as the Latitude, Longitude and Address fields (decision A).
3. **D47 read-only dealer profile.** The spec says all org, address, bank and login fields are read-only (F3, `dealer_profile.*`), but it does not list their labels. Only Firm Name is shown, with the note "contact OEM Admin". The other fields are not shown.
4. **D47 Save shop location has no stated effect on the screen.** The spec gives the endpoint only. It shows a toast. The card on step 1 says so.
5. **D47 document upload has no stated effect on the screen.** The four spec labels (GST Certificate, PAN Card, Aadhaar, Dealership Agreement) are shown as file fields. Upload shows a toast. The card on step 1 says so.
6. **D47 profile photo has no stated effect.** It shows a toast.
7. **D47 "Use my current location"** comes from the spec note on Latitude ("from browser geolocation"). The spec does not give it as a button, so it is shown as a toast control. The spec does not say what the browser location fills in beyond Latitude and Longitude.
8. **D47 change password.** Password and Confirm password are required and must match (spec). They are shown as required, with no validation. The dealer-setup gap list says the change is optional on first sign-in, and the spec does not force a change. This tour does not force it either.
9. **D48 has no column list.** The columns are User ID, Name, Role, Contact, Email and Status, taken from the O52 labels (assumption). An unlabelled action column holds the edit button. The card on step 2 says so.
10. **D48 search has no stated target.** It shows a toast.
11. **D48 edit has no stated target on this tour.** It shows a toast that names D49.
12. **R1 (dealer sees only its own rows).** The seed rows are the dealer's own staff only.
13. **D49 Contact format is not defined.** Contact is shown as a text field with no format rule. Nothing is validated.
14. **D49 role options.** Add mode shows Sales Man and Service Man, from the spec. The Dealer role (F10) is offered in edit mode only, so it is not shown.
15. **D49 edit-only items are not shown.** Status (edit) (Active / InActive) and Change Password (edit) belong to edit mode, so this add-mode tour does not show them.
16. **D49 submit has no stated effect beyond adding.** The new user appears in the D48 list and the Staff users count goes up by one (walkthrough choice, decision B). The count and the new row change together, through the submit step's stateChange only.
17. **D49 Password and Confirm Password** are required in add mode (spec). They are shown, with no matching check.
18. **Swati's last name is not in `docs/people.md`.** The seed uses "Sample" as the last name (sample data).
19. **N11 role assignment for a dealer and its sub-dealers** depends on the sub-dealer clarification document, which is not in the repo. The card on the last step says so.
20. **The existing D47 screen did not match the spec** (it showed Firm Name, two password fields and a single shop location block, and it had no document rows or current-location control). It has been rebuilt from the spec (decision A). D47 is in no other walkthrough sequence, so no other tour changes.

## Assumptions and decisions (approved)

21. **Actor: Ravi Kumar (dealer-owner).** Decision: D47 to D49 are shown as the dealer owner, as the approved proposal says.
22. **The new user is Swati, as a Sales Man** (decision C). The password fields are fields only.
23. **Staff users floater** (decision B). The count changes only through the submit step's stateChange (`staff.count` +1, `staff.created` true). The D48 row and the count change together.
24. **The five steps:** D47 (card), D48 list (card), D48 click create (action), D49 submit (action, no card), D48 with the new row and the N11 card (end). A step with a card carries no action.

## Walkthrough notes (not spec gaps)

- D47 is rebuilt, and no other walkthrough uses it, so the other tours are unchanged.
- D48 and D49 are new. They are registered in `registry.js`, and the registry import is bumped to `?v=10` in `router.js`, `apps/everp/mock-app/index.html` and `walkthrough/src/main.js`.
- The D49 submit step has no card, because it carries an action. Its gaps (13 to 17) are shown on the screen only.
