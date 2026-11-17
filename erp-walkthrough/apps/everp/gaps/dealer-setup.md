# Gap list: Setting up dealer

Source of truth: `docs/screen_details.md` (read only). Sequence: `apps/everp/sequences/dealer-setup.json`. Seed (sample data): `apps/everp/mock-app/mock-data/seeds/dealer-setup.json`.

## Spec gaps

1. **Landing after save (assumption).** O05 does not say where Save goes. The walkthrough goes to O04, where the new row and the count are visible, then opens O06.
2. **Dealer ID format.** O05 says "D00000n auto". D01 gives the example "D000002" (7 characters). D01's placeholder "eg. D001" is 6 characters. The walkthrough uses the 7-character form from the sample data and shows the placeholder as written in the spec.
3. **Credential hand-over.** No screen or rule says how the user ID and password reach the dealer. Shown as the "Not defined" alert on the O06 step. No email, SMS or WhatsApp screen was added.
4. **First login.** The spec does not require a password change on first sign-in. D47 "change password" is an optional control only. D47 is built and registered, but the flow does not reach it.
5. **Notification on dealer creation.** R9 covers notifications per recipient, but no event is defined for "dealer account created".
6. **D03 shop location prompt.** The spec does not say whether the prompt shows once or on every login. The walkthrough shows it once, after the first sign-in.
7. **D04 dashboard content.** The aggregates (invoices, POs, service, warranty, follow-ups) have no defined values, layout or drill targets. Shown as "Not defined".
8. **O06 tabs.** The spec names three tabs: Profile, Connections, Ledger top-ups. The other six have no name. The Connections and Ledger top-ups contents are not defined. Only Profile shows content.
9. **D01 login errors and lockout.** No error text or lockout threshold is defined. O04 mentions failed login attempts and unlock, with no threshold.
10. **Prerequisites.** Region, Zone, Manufacturing Unit and operating states must already exist. The walkthrough assumes them as seed data. The spec does not cover creating them in this flow.
11. **User Type (O05).** F1 is defined: five price tiers, and a dealer sees its own tier on a PO. In this walkthrough the User Type control shows with no visible effect, as the rules require.
12. **Sidebar link O03 to O04 (assumption).** O03 has no link to the dealers list. The walkthrough uses the sidebar item "Dealers" as the way to reach O04.
13. **Firm name link O04 to O06 (assumption).** O04 lists only edit and unlock as row actions. The walkthrough makes the new dealer's firm name a link to O06. The existing rows have no link.
14. **O04 column set.** The spec gives no columns for O04. The columns used are Dealer ID, Firm, User type, State, District and Status, taken from O05 field names.
15. **O06 Profile fields.** The spec does not list the Profile tab's fields. The walkthrough shows the O05 fields, read only.
16. **O03 KPI values.** The spec names ten KPIs. Only "no. of dealers" has a value in this walkthrough. The other nine show "Not defined".
17. **D04 period options and drill links.** The period filter options and the drill-link targets are not defined.
18. **Option lists.** States, districts, regions, zones, Manufacturing Units and the Country values are sample lists in the seed. The spec gives no values for them, and Country has no options at all (shown as "Not defined").
19. **D47 password labels.** The spec gives "Change password" with fields password and confirmPassword. The labels "Password" and "Confirm password" are the walkthrough's own.
20. **Save feedback.** The spec gives no message for Save. The message shown is the walkthrough's transition popup, using the button label ("clicked save"). It is not an in-page toast, because the frame reloads on the next screen.

## Walkthrough notes (not spec gaps)

- The sequence ends on D04 as soon as the step is shown. D04 has no control in the spec that finishes the walkthrough.
- O04 "add" is also available from the post-create list and leads to O05 again.
- No sample value appears in any `.js` file or in the sequence text. Values come from `apps/everp/mock-app/mock-data/seeds/dealer-setup.json`.
