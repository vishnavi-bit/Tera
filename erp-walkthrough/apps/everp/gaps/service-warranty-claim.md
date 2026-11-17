# Gap list: Service to warranty claim

Source of truth: `docs/screen_details.md` (read only). Order: `docs/workflows/flow_service_warranty.md`. Sequence: `apps/everp/sequences/service-warranty-claim.json`. Seed (sample data): `apps/everp/mock-app/mock-data/seeds/service-warranty.json`.

## Roles and people

1. **WARRANTY role is not defined.** O43 and O44 say "WARRANTY roles", and `docs/people.md` has no such role. Charan is used as Super Admin (`oem-super-admin`) for both screens, as approved. Add the WARRANTY role to `docs/people.md`.
2. **Role codes D, S and V are not defined in the spec.** V is read as service (assumption). Latha is `dealer-service`.
3. **Latha's dealer firm is an assumption.** `docs/people.md` says "Dealer - Service" without a firm. Latha is placed in Sri Lakshmi EVs (District Dealer), the dealer in the other seeds.
4. **Charan's role key.** Charan uses the existing `oem-super-admin` key, which already has a colour in `roles.json`. No separate `super-admin` key was added, since no user would use it.

## Order conflicts

5. **Workflow or spec: which is newer, and the order chosen.** The file timestamps do not decide it: `flow_service_warranty.md` is 16 ms newer on disk, both written 18:44:06 on 2026-10-25. Git says the spec is newer: the last commit of `docs/screen_details.md` is b9e9b7a (2026-10-17 18:19), and the last commit of `docs/workflows/flow_service_warranty.md` is 960c3a6 (2026-10-16 15:01). Decision: spec order, chosen by the product owner. The workflow order is not followed.
6. **Service completion and the SERVICE invoice come before the claim (spec order, decision 5).** The spec says D42 "complete service" opens D20 directly. The walkthrough completes the service and creates the SERVICE invoice first, then raises the claim. The workflow had completion after the OEM return, so this order differs from the workflow.
7. **Service before ask cost (spec order, decision 5), which conflicts with the spec.** The chosen order puts O44 "service or replacement" before "Ask cost from dealer". The spec's O44 row says ask cost "blocks service / replacement until dealer pays and OEM verifies", so the spec's own rule runs the other way. Flagged for the owner. To follow the rule, swap steps s12-service and s13-ask-cost in the sequence file.
8. **Step 14 is split in two.** The approved step "verify payment, return details" is two steps: verify payment, then return details. The workflow has a return step between them.

## Job card and claim entry

9. **No fault or inspect action on D42.** The workflow has "Job Card: Inspect" and "Parts need replacing?". D42 has only the spec controls. The faulty part (battery, "Not Working") appears only in seed data.
10. **D42 fields have no API names.** The requirement column says "?". Job Type and Service Type options are taken from D41 (assumption). RSA / On Site is shown as a checkbox (the spec says "select / checkbox"). Requested Rectification has no add control in the spec, so none is shown.
11. **"Done" is a toast only.** Its effect is not defined.
12. **No link from D42 or D20 to a claim.** After the SERVICE invoice is created, the walkthrough goes to D37 directly. This is a walkthrough transition, not a spec link. "+" (D37) then raises the claim.
13. **"Select customer by chassis" dialog has no field table.** The D37 step shows the "Not defined" alert and goes straight to D38.

## Claim status (floater)

14. **Claim status values are not defined in full.** In order, the floater shows: "—" until the claim is raised (not a spec value); "Raised to OEM" (from the D38 "Raised to" option OEM and the "claim warranty" button); "inTransit" (spec); "verify", "inspect", "service" (O44 workflow words); "request service charge", "pay service charge", "verify payment" (composed from the O44 and D39 button labels); "return" (O44 workflow word); "dealer_received" (spec: "Confirm received sets dealer_received"). The values follow the chosen order (gaps 5 to 7). The full set needs a decision.

## Branches left out

15. **Reject branch is not built.** The "verify / reject" card has a reason field, and "reject payment" shows a toast. The claim rejection ("D39 Claim Rejected", workflow) is not in the walkthrough.
16. **Replacement is not built.** The "Service" radio is shown with "Service" selected. Choosing "Replacement" shows a toast only. No stock check, no OEM stock deduction.
17. **Service charge pass-through.** The workflow's open question (charge passed to the customer, absorbed by the dealer, or configurable) is not shown.

## Screens with missing detail

18. **O44 sections with no field table.** These show the "Not defined" alert on their headings: OEM review., Customer & claim., Issue & coverage., Dealer claim photos., Dealer issue report (post-receipt). "Dealer & summary", "Claimed item" and "Replacement details" list their labels in the spec, so they show read-only fields with seed values.
19. **O44 dialog labels.** The spec gives API-style names for some fields: "company", "contactNumber", "trackingNo", "serviceOn", "item_id", "transport", "payment", "date", "attachments". These are shown as written, with the case of the spec. "Inspection report" and "notes" are the spec's own wording.
20. **O44 Service charge controls.** The spec says "shows dealer transaction ID + amount" with no labels. "dealer transaction ID" and "amount" are used as labels (assumption). "reason" is the spec's own wording.
21. **O44 Ask cost from dealer.** "notes for dealer" is the spec's own wording. The spec does not say what sends the cost request. Its button is "request / edit / waive service charge" (button label), so that button carries the step.
22. **O44 "Inspection Reports" text.** The spec's validation text is not used, since it is not a rule the walkthrough runs.
23. **O44 "Service or replacement" fields.** The "service" radio label and "remark" are the spec's own wording. "replacement serial / product #" is shown as written. Replacement shows the toast described in gap 16.
24. **D39 "Claim details".** No fields are defined in the spec, so the heading shows the "Not defined" alert.
25. **D39 field labels.** The spec gives "company", "contactNumber", "trackingId", "amount", "transactionId", "proof file", "description" and "media" as field names. Shown as written. Amount and transactionId are marked required (assumption from the ✔ in the spec table).
26. **D39 button label versus card title.** The button is "confirm receipt" (from the spec button list). The card title is "Confirm received" (from the spec table). Both are used as written.
27. **"[I]" marker has no legend.** It appears on "proof file" and "media" (D39). The marker is not shown. The file fields are shown without it.
28. **Transport label.** "Air Wave" is used, as written in the spec. The spelling may be a typo for "Airwave".

## D15, D18, D37, D41, D38, D20 and O43

29. **D15 row link.** The spec has only "search" and "create". The customer name is a link to open the customer (assumption). List columns Customer ID, Name, Mobile and Email are assumed, since the spec gives no columns.
30. **D18 search chassis.** The spec gives the button "search chassis". Its input placeholder is "chassis number" (assumption).
31. **D37 list columns and search.** Claim ID, Customer and Status are assumed columns. The search input has no label in the spec, so it has none in the walkthrough.
32. **D38 warranty products search.** The spec says "Warranty-products mode: search" with no label. The label "Search" and the placeholder from the spec are used. The mode is not reachable in this walkthrough.
33. **D38 Select Vehicle.** The spec lists the customer's paid invoices. The walkthrough has one sample option built from the seed (model, variant, chassis, colour).
34. **D20 SERVICE lines.** The spec does not show how the labour line from D26 appears on D20. The sample labour line in the seed is the walkthrough's assumption.
35. **D20 "+ Add Item".** The spec's "product picker" button is shown as "+ Add Item", the label the spec gives for that dialog.
36. **D20 "Add Vehicle Detail".** This dialog is shown as spec controls, but a SERVICE invoice does not use it. Its toast says it checks dealer stock.
37. **D20 "Payment Records" note.** The line "No payments linked yet." is walkthrough text, not spec text.
38. **D20 hidden field.** "invoiceType" is hidden in the spec and is not shown. The SERVICE mode is set by the walkthrough.
39. **O43 status filter.** The spec gives no options. The select shows the "Not defined" alert on click. Columns Claim ID, Dealer, Raised to and Status are assumed. The claim ID is a link (assumption).
40. **Login steps.** None, as approved. Each step switches to the user's screen directly.

## Hand-off notes (not spec gaps)

- Screens created: D15, D18, D20, D37, D38, D39, D41, D42, O43, O44. None existed in the registry, so none were rebuilt.
- Config changed: `walkthrough/config/roles.json` (dealer-service), `walkthrough/config/walkthroughs.json` (new entry), `apps/everp/mock-app/mock-data/users.json` (Latha), `apps/everp/mock-app/registry.js` (10 entries). The shell is not changed.
- The validator passes. Its remaining warnings are hints for actions that belong to other steps on the same screen (for example, D39 and O44). Clicking one of these shows a hint, as in the other walkthroughs.
- No sample value appears in any `.js` file or in the sequence text. All values come from `apps/everp/mock-app/mock-data/seeds/service-warranty.json`.
- Existing screen noticed but not changed: O23 (`apps/everp/mock-app/screens/oem/payment-verify.js`) hard-codes a transaction ID and amount, against the seed-data rule. It is used by the order walkthrough, which is outside this change.
