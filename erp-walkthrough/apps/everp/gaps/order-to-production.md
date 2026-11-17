# Gap list: Dealer order to dealer delivery

Sequence: `apps/everp/sequences/order-to-production.json` (18 steps). Seed (sample data): `apps/everp/mock-app/mock-data/seeds/default.json`. Checked by `node walkthrough/validate-cli.mjs`: no errors, 7 warnings (2 from the original list, 5 from shared screens, see "Validator warnings after the 18-step build").

## Validator warnings (expected, left as they are)

1. **O20 `reject-order` has no rule.** Warning from step `oem-approve`. The reject button on O20 is an existing control that this walkthrough does not use. It shows a hint if clicked.
2. **O23 `reject-payment` has no rule.** Warning from step `oem-verify`. The reject button on O23 is an existing control that this walkthrough does not use. It shows a hint if clicked.

## Hard-coded sample values

3. **O23 transaction ID and receipt file: fixed.** The transaction ID and receipt name were in `payment-verify.js`. They now come from `order.transactionId` and `order.receiptFile` in `default.json`. The "at least 30%" note now reads the advance percentage from the seed. No amount is hard-coded in O23.
4. **D31 (PO Payment) hard-coded values: fixed.** The receipt name and transaction ID now come from `order.receiptFile` and `order.transactionId` in `default.json`. The amount fields already read from data.
5. **N03 (Material Requisition) product name: fixed.** The model field now reads `order.model` ("Tera Zip 60V 30Ah") from `default.json`.
6. **Sequence text: fixed, with one exception.** The step text, floater labels and completion message now read values from the seed. Tokens such as `{order.id}`, `{order.qty}`, `{order.advancePercent}` and `{order.advanceDue|inr}` are filled in by the engine. `order.paid` now copies `order.advanceDue` instead of a typed number. **Still literal:** the stock deductions in the `submit-requisition` step (-16 and -32 per item). They are state changes, not text, and are not in the seed. Converting them needs a quantity-per-unit rule that is not defined yet.
6a. **Engine support added for this.** `walkthrough/src/engine.js` fills `{path}` tokens in step text and labels from the seed, and supports `{ "copy": "path" }` in a `stateChange`.

## Assumptions in this walkthrough

7. **Advance is 30% of the order total.** The seed has the order total as 992000 and the advance as 297600. The sequence sets `order.paid` to 297600 on verify, which assumes the full advance is paid.
8. **Same receipt across screens.** D31 and O23 show the same transaction ID and receipt. The seed holds one set of values for both.
9. **Verifying an advance of at least the advance percentage allows production.** The O23 note says this. The walkthrough does not check the amount entered.
10. **Dealer is Sri Lakshmi EVs, MU is MU Hosur, product is Tera Zip (60V 30Ah).** These names are the same across the other walkthrough seeds.
11. **No finished stock.** The seed has 0 finished vehicles, so the cart shows "no stock" and production starts from raw stock.
12. **Sales Head (Anita Rao) is not in docs/people.md.** She is used as an OEM sales role for O20. The user is `oem-sales-head` in `users.json`, with the role badge "Sales Head" and the colour in `roles.json`.
13. **Dealer-sales entry (Swati) is kept but not used.** The `dealer-sales` entry in `users.json` is left as it was. No step in this walkthrough refers to it.
14. **O20 side.** Anita Rao is an OEM user, so the sidebar shows the OEM menu on O20, as for other OEM screens.
15. **People not in people.md.** Anita Rao is used in this walkthrough (item 12). Still in the walkthrough data and not removed, for a decision: "Sample Contact" (vendor contact person in the oem-setup seed), and "Meena Sample" and "Arun Sample" (customers in the service-warranty seed). Customers are not staff, so they may stay as sample customers.

## Gaps found while extending to 18 steps

16. **Six new features have no screen in the spec.** N03 Material Requisition, N04 Production Completion & Handover, N05 QC Inspection Checklist, N06 QC Branding / Packaging Requisition, N07 Despatch Chassis Validation Gate and N13 FIFO Stock Issuance & Location Report all say "Not yet speced". Steps 11, 13 and 14 show a "Not defined" alert for them.
17. **No chassis binding before dispatch.** O21 (Assign Item) takes quantities only, and O22 (Dispatch Shipment) has no chassis or serial field. Nothing in the spec ties a chassis number to a vehicle before it ships. N04 and N07 would do this but are not defined. The dispatch step has no chassis number.
18. **Advance versus full payment is unconfirmed.** O22 has "Payment Status: Paid / Unpaid [C]" and O19 combines "paid POs", but the spec does not say whether the 30% advance (step 10) is enough to dispatch, or whether full payment is needed first.
19. **No "delivered" stock rule.** D32 confirm delivery sets the shipment to Delivered. The spec does not say what happens to stock at that point (for example whether it leaves OEM stock or enters dealer stock).
20. **Anita Rao is not in docs/people.md.** She is the Sales Head (`oem-sales-head` in users.json) and acts in steps 6, 7 and 8. The walkthrough keeps her as stated in the brief. The spec owner needs to add her to people.md.
21. **Step 11 has two people and two screens.** Resolved for the build: the step user is Ganesh and screen N03. Ruby (N13) is named in the "Not defined" alert only, so she is not the acting user (gap 30).
22. **Order rule is a validation.** D29 says total quantity must be in {16, 20, 32, 40} and that non-vehicle orders need a minimum price. This walkthrough does not validate, so the cart shows the total but does not block Place Order. The spec owner needs to confirm this is acceptable.
23. **No row action on O17.** The spec gives O17 type tabs, filters and print only. Nothing defines how a PO is opened from the list, but step 6 needs it. Until the spec says otherwise, the PO number cell links to O20.
24. **D30 tab names are not in the spec.** D30 (PO Detail) is listed as "6 tabs" with no names. Only the Dispatch tab is referred to (step 17), and its fields are not defined beyond O22's transport fields.
25. **O20 tab names are not in the spec.** O20 is also "6 tabs" with no names. The current mock uses Summary, Items, Payments, Production, Dispatch and History, which were invented. They need confirming.
26. **Input controls have no spec action.** The spec defines buttons only. Text, select, radio, date and checkbox controls (for example O19 "Select paid POs", O22 "Ship now" quantity and D29 quantity ±) have no action, so the rule "each control navigates or shows a toast" cannot be applied to them as written.
27. **Stock deduction at step 11: removed.** The -16 and -32 change to raw stock was taken out of the requisition step, because N03 is "Not defined" and the spec has no quantity rule. The seed stock is unchanged and not used by any step now.
28. **Production build has no spec action.** O18 defines "update produced count" only. Nothing in the spec records a finished unit or links produced count to a chassis or to stock, so step 12 changes status only.
29. **Sequence size differs from the brief.** The sequence file had 7 steps, not 11. The 18-step list in the brief is used as written.

## Validator warnings after the 18-step build

- **Expected, from before:** O20 `reject-order` (step 7) and O23 `reject-payment` (step 10). Both are reject buttons this walkthrough does not use.
- **Expected, new (5):** D29 is one screen used by steps 2, 3 and 4, and D30 by steps 5 and 17. The validator checks every step against its screen, so a control that acts in one step warns in the others:
  - `dealer-choose-mu` (step 2): `add-to-cart`, `place-order`. Step 2 is a pass-through, so these controls do nothing there.
  - `dealer-cart` (step 3): `place-order`. Step 3 acts on Add to Cart only.
  - `dealer-place-order` (step 4): `add-to-cart`. Step 4 acts on Review & Place Order only.
  - `dealer-po-detail` (step 5): `accept-delivery`. Step 5 is a pass-through, and the button acts in step 17.

## Gaps from the 18-step build

30. **Ruby is named in the step 11 alert, not the acting user.** The step user is Ganesh (`oem-production-mgr`) and the alert lists N13 for Ruby (`oem-inventory-mgr`). The alert names her from users.json. The spec owner should confirm whether Ruby should be the acting user for N13.
31. **Step 2 (choose MU) has no button.** The Purchase From radio is inert, as agreed, so the step advances on its own after a "chose … as the seller" note. A real choice needs a control that the spec defines.
32. **Step 5 (view the new PO) has no button.** The spec gives D30 no "view" action. The step advances on its own after "opened purchase order".
33. **Step 13 changes the status with no screen action.** The status "Ready for Dispatch" is set when the "Not defined" alert for N04, N05 and N06 is dismissed. No button is defined for this stage in the spec.
34. **Step 9 no longer changes the order status.** The old sequence set "Advance awaiting verification". The brief's status list has no step 9 value, so only the payment status changes there.
35. **Status labels changed to the brief's list.** "Pending", "Approved", "Payment verified", "In production", "Ready for Dispatch", "Dispatched" and "Delivered". The old labels were "Pending OEM approval", "Approved - advance pending" and "Advance paid - ready for production".
36. **Submit & confirm (D32) only toasts.** The spec says it logs the issue and marks the shipment delivered. It is not wired to step 18, which uses Confirm delivery. Report issue would need its own step.
37. **Courier transport is not shown.** O22 offers By Truck and By Parcel only. The spec's "By Courier" variant and its courier fields are left out, as the variant is not in the walkthrough.
38. **Inert controls still toast on change.** The shared form helpers show a toast when an input changes (for example a text field or a select). No value is saved and no state changes, which is what "inert" meant in the brief. The spec owner should confirm this is the intended behaviour.
39. **O20 and O23 show the spec's fields only.** O23 also shows the ledger top-up fields from the spec. Neither screen has tabs, because the spec names none (gaps 24 and 25).
40. **Stock in the seed is not used.** `stock.raw` and `bom` in the seed are no longer read by any step, because the requisition deduction is removed (gap 27). They are kept for later.
41. **Walkthrough engine changes.** To support the above, `walkthrough/src/engine.js` now: resolves `{users.<key>.name}` tokens from users.json, applies `stateChange` on steps with no actions when their Not defined alert is dismissed, and fills tokens in Not defined text. `walkthrough/src/validation.js` checks step-level `stateChange` keys. `walkthrough/src/main.js` bumps the engine cache version from `v=3` to `v=4`. The other three walkthroughs use only text that has no tokens, so their behaviour is unchanged (their files are unchanged, checked by checksum).
42. **Step 3 variant and colour are radio buttons.** The spec calls them chips. They are shown as radio groups (Variant and Colour) above Add to Cart, so the user can pick them. The choices come from the cart's own lines in the seed. A pick only shows a toast and is not saved, and Add to Cart does not use it. The spec owner should confirm whether chips are the intended control.

## Walkthrough notes (not spec gaps)

- D30 report-issue and D32 submit-issue now show a hint when clicked, because the screens are shared with Dealer stock and issues.
