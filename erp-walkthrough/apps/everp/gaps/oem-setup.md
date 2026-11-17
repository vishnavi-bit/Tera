# Gap list: OEM setup

Source of truth: `docs/screen_details.md` (read only). Sequence: `apps/everp/sequences/oem-setup.json`. Seed (sample data): `apps/everp/mock-app/mock-data/seeds/oem-setup.json`.

Ends at O47 after "add credit". The next walkthrough is "Setting up dealer"; no screen was added for it.

## Spec gaps

1. **Hand-off to Setting up dealer.** No workflow in `docs/workflows` covers OEM setup or the step that leads into dealer setup. The walkthrough ends at O47 and the completion text names "setting up a dealer" only as the next step.
2. **O53 User Role.** The spec says "15 OEM roles (section 2.1)". Section 2.1 is not in `screen_details.md`. The select has no options and shows the "Not defined" alert. The new user's role is therefore not set, and O52 shows "Not defined" in the Role column for that user.
3. **O53 role category.** O52 has a "role category" column with no definition. Shown as "Not defined".
4. **O33 Production Unit Head.** The spec says OEM_PRODUCTION_HEAD users, but no such users are created in this walkthrough. Only "No unit head" is offered. The spec does not say how a head is assigned after the unit is created.
5. **O49 Approval Admin Email.** The spec marks the requirement as "?". It is shown without the required marker.
6. **O01 Forgot Password.** The screen name includes it, but the spec gives no fields or actions. Shown as "Not defined".
7. **O01 Remember me.** The spec says not to copy the dealer app's plaintext password storage. The OEM rule is not defined. The control shows a toast only.
8. **O01 placeholder.** The spec's placeholder for User ID is "eg. D001", which is a dealer-style example. Shown as written.
9. **O50 options.** The spec gives no option list for State. See assumption A1.
10. **O51 Region Head and Zone Head.** The spec says "OEM users" for Region Head and "Select Manager" for Zone Head. The Region Head field has no placeholder in the spec, so none is shown.
11. **O51 row actions.** "edit" and "delete" belong to list rows. The walkthrough creates the first region from an empty list, so those controls do not appear. Same for O39 (edit, delete) and O32 (view).
12. **O51 list columns.** The spec lists columns (region ID, name, head, zones, dealers, created on, status) and shows the empty table only. No row is shown in this walkthrough.
13. **O32 columns.** The spec gives no list columns. The empty list shows no columns for rows. If a row is added later, it uses the O33 field labels (see A4).
14. **O52 user ID.** The spec does not say how a user ID is generated. The new user is shown as OEM0002 (sample).
15. **O53 edit-only controls.** Status (edit), Assigned Dealers (sales roles, edit), Device limit (edit) and Devices & sessions (edit) belong to edit mode. The walkthrough is an add form, but the controls are shown with toasts so every control in the table appears.
16. **O26 Purchase limit.** The dealer types and share of stock are not defined. Shown as "Not defined".
17. **O26 charger and WBC.** The spec says the Charger field is hidden if WBC is ticked. The charger is always shown, as decided.
18. **O26 component options.** The spec gives Motor, Controller, Battery and Charger as product lists. This walkthrough creates one component (the motor). The Controller, Battery and Charger selects use sample option lists from the seed.
19. **O27 Category, Brand (accessory).** The spec says "text / select" with no option list. Shown as "Not defined".
20. **O27 Available from per MU, Purchase limit.** The spec says "as 7.12". Section 7.12 is not in `screen_details.md`.
21. **O27 Is Panel / Painted Part?.** The spec says it creates one spare per colour of the model. The walkthrough does not create those records. The toast is neutral, as decided.
22. **[C] and [I] markers.** The spec uses these markers in several tables. There is no legend in the spec. The markers are not shown.
23. **O28 Additional specs.** The spec lists voltage, capacity and warranty as custom fields, but does not say which fields each product type has. Sample keys are used (Motor Type, Voltage).
24. **O39 procurement.** It leads to O40, which this walkthrough does not show. Toast only, as decided.
25. **Access on O39, O46, O47.** The spec says "Role not keyed — confirm access". Charan (Super Admin) is used.
26. **O39 list.** No list columns are defined. The list is empty in this walkthrough.
27. **O46 list and header totals.** The spec gives list columns (name, members, balance, tally) and header totals (total held, tally). The list has no rows, and the header totals are not shown.
28. **O47 Add debit message.** "That is more than this ledger holds" is validation text, so it is not shown.
29. **O47 Connect / remove dealer.** The spec gives no dealer options. No dealers exist before the dealer setup walkthrough, so the Dealer select is empty.
30. **O47 History.** The spec does not say what history contains before the first credit. One sample row is shown.
31. **O33 Capacity and working calendar.** The spec gives endpoints only, not a screen detail. Shown as "Not defined".
32. **O53 create and submit.** The spec lists both buttons. "submit" saves and moves on. "create" shows a toast.

## Assumptions

- **A1. O50 states.** The sample operating state is Tamil Nadu only. Karnataka was removed from the selected states, so one State dropdown shows at the start. The option list is still the 36 states / UTs and Nepal from O33, as sample data. "add state" adds another State row only as a toast; the row is not added.
- **A2. O03 to Settings.** The sidebar item "Settings" leads to O49, the first built screen of the Settings section. The dashboard itself was not changed.
- **A3. O39 vendor name.** The Setting up dealer seed has no vendor. The vendor is "Sample Vendor Hosur", a new sample name that matches the MU name.
- **A4. O32 rows.** Rows use the O33 field labels as columns (see gap 13).
- **A5. O53 Manufacturing Unit.** The option list is "All units (global)" and the MU in the seed.
- **A6. Save feedback.** Each save moves on through the transition popup, as in the Setting up dealer walkthrough.

## Other items to fix in the spec or the dashboard

- **O03 "no. of dealers" tile.** The dashboard reads `dealers.count` and shows the value from the seed. In this walkthrough the seed sets it to 0, because no dealer exists before the dealer setup walkthrough. The shared dealer seed shows 3, which does not fit this walkthrough. The dashboard was not changed, as instructed.

## Walkthrough notes (not spec gaps)

- No sample value appears in any `.js` file or in the sequence text. Values come from `apps/everp/mock-app/mock-data/seeds/oem-setup.json`, which is marked `_sample`.
- Floater values: manufacturing units, products and ledgers, changed only by the sequence's `stateChange`.
- Charan is the only user in this walkthrough (`oem-super-admin`).
