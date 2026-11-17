# Gap list: Dealer stock and issues

Sequence: `sequences/dealer-stock-and-issues.json`. Seed (sample data): `mock-app/mock-data/seeds/dealer-stock-and-issues.json`. Screens: D27, D30 (reused), D32 (reused), D36, O42.

## Spec gaps

1. **D27 has no submit control and no link to O42.** The spec gives only the "new issue" button and the field table. The walkthrough shows the "Not defined" alert on arrival at D27 (step 1). It does not invent a button or a link.
2. **D27 required marks are "?".** Type, Select Spare, Title and Description are marked "?" in the spec. None is shown as required.
3. **D27 list columns are not defined.** The screen shows the "New issue" button and the dialog only. No list is shown.
4. **D27 and O42 may or may not be the same list.** The spec lists O42 as a counterpart of D27 but does not say they share data. The walkthrough does not connect them.
5. **D27 Select Spare options** are Motor, Battery, Controller and Accessories. The spec does not say how they depend on the Type radio (Spare or Accessory).
6. **O42 stage names are not defined.** The spec has "stage tabs" and a stage column but no names.
7. **O42 roles are IM, SVH and ADM**, but `docs/people.md` has no role codes.
8. **Manager and OEM review** may need different people. The spec does not say.
9. **Manager decline and OEM decline** have no stated effect on the stage. Reason is required on decline. Shown as toasts only.
10. **Settle with money**: the spec gives Compensation amount (₹) and Transaction ID, both required. It does not say what the dealer sees, whether a ledger changes, or whether a notification is sent.
11. **Replace** has no stated effect on stock, the dealer, or the replacement serial. Not built: shows a toast.
12. **Mark replacement dispatched** has no stated effect on the dealer. Not built: shows a toast.
13. **Mark resolved and reject claim**: the spec does not say which stage each sets. Reason is required on reject. Not built: shows toasts.
14. **D36 list columns are not defined.** The walkthrough uses the O42 list columns (order, dealer, product, serial or chassis, issue, media, stage, reported, action) as an assumption, with an Outcome column added for F8.
15. **D36 "open PO" has no stated target.** The walkthrough assumes D30. It shows a toast only.
16. **Outcome wording** is not defined. The walkthrough uses "Settled with money" as the outcome label.
17. **D32 "Submit & confirm" also marks the shipment delivered.** The walkthrough's seed starts with the shipment already delivered, so no change is shown. The spec does not say what happens if the shipment is already delivered.
18. **Serial or chassis on D32 has no requirement** in the spec. It is shown as a text field.
19. **D27 file preview** is not defined beyond "preview". The walkthrough shows a file input that shows a toast.
20. **D32 photos or videos and O42 media** have no preview defined. The walkthrough shows the media file name only.
21. **D27 to D30 move** (step 1 to step 2): the spec has no link from the new issue dialog to a delivered PO. The walkthrough moves the dealer there as a walkthrough choice.

## Assumptions (approved)

22. **Stage names** are the endpoint-based labels: Manager review, OEM review, Settlement, Replacement dispatched, Resolved and Rejected. The walkthrough uses Manager review, OEM review, Settlement and Resolved.
23. **Ruby (oem-inventory-mgr)** does the manager review, because the spec's IM role is read as Inventory Manager.
24. **Charan (oem-super-admin)** does the OEM review, because the spec's ADM role is read as Admin. SVH is not used.
25. **D36 uses the O42 list columns**, with the outcome column added for F8.
26. **"Open PO" goes to D30.**
27. **The dealer sees stage and outcome only** (F8). The seed has no review notes and D36 shows none.

## Walkthrough notes (not spec gaps)

- **Shared screens and new action ids.** D30 "Report issue" now has the action `report-issue`, and D32 "Submit & confirm" has `submit-issue`. They are used only in this walkthrough. In `order-to-production` (Dealer order to dealer delivery), they add warnings and a click on either shows a hint instead of a toast. Its steps and its `confirm-delivery` action are unchanged.
- **D27 alert on arrival.** The "Not defined" alert shows when the walkthrough reaches D27, not when the dealer clicks "New issue". A button with an action cannot also show an alert in this engine.
- **Floater "Issue status"** shows the value set by the step before. The values are Not raised, Issue raised, Manager review, OEM review, Settlement and Resolved, as approved.
- **Other warnings** (shared screens with actions that belong to other steps) are expected, as in the other walkthroughs.
