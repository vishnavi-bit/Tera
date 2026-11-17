# Gap list: PO exceptions and dispatch documents

Sequence: `sequences/po-exceptions.json`. Seed (sample data): `mock-app/mock-data/seeds/po-exceptions.json` (copied from the Dealer order to dealer delivery sample: PO-2026-0412, Sri Lakshmi EVs, MU Hosur, the OEM setup products). Screens: O24 (new), D30 and O20 (reused), O23 and O22 (reused), D32 (reused, Reject button changed to an action). N26, N10 and N27 have no screen and show "Not defined" cards.

## Spec gaps

1. **The OEM actor for O20 and O24.** The Dealer order to dealer delivery walkthrough shows Anita Rao (Sales Head) on O20. Anita Rao is not in `docs/people.md`, and `docs/people.md` has no Sales Head. This tour uses Charan (Super Admin) on O20 and O24, as an assumption. The two tours therefore differ on the same screen.
2. **The O24 roles are "APPROVE roles".** `docs/people.md` has no such role code. Charan is used (gap 1).
3. **The O24 Remarks field is required.** The spec has the tick. It shows as required, and the [I] marker is not shown.
4. **The spec gives no status names** for Rejected, Reverted, Approved, Payment verified, Dispatched, Shipment rejected or Delivered. The floater uses the labels from the order walkthrough (Pending, Approved, Payment verified, Dispatched, Delivered) and two new labels, Rejected and Shipment rejected. All are assumptions.
5. **The spec does not say what status a rejection sets.** The floater shows Rejected (assumption).
6. **Assumption: the revert follows the rejection.** The spec says "Revert cancelled PO", and it does not say that a rejection cancels the PO. The walkthrough shows the revert after the rejection.
7. **The dealer's view after a rejection.** F8 says the dealer sees stage and outcome only. The spec does not say which stage and outcome labels appear after a rejection. This is the card on step 4 (D30).
8. **The dealer notification for the expected dispatch date** is not defined in the spec. The save date button shows a toast.
9. **The O20 info note is OEM-only (F2).** It is shown on O24 only, and no dealer screen in this tour shows it.
10. **How a rejected PO is re-opened** is not defined. The revert step is the way back (assumption, gap 6).
11. **The re-dispatch quantities** are not defined. The O22 table shows Approved, Shipped and Remaining from the seed, and "Dispatch all remaining" shows a toast. The re-dispatch does not change the shipped count.
12. **N26 "OK to Bill" gate** has no screen. It extends O20 and O23. The card on step 8 (O23) says so. The spec says it replaces dispatch proceeding right after payment verification.
13. **N10 e-way bill** has no screen. It supersedes D51 and O56. The card on step 9 (O22) says so.
14. **N27 PDI checklist** has no screen. It extends N07 and sits before a unit ships. The card on step 12 (O22) says so. It is placed before the re-dispatch, as the spec says (decision C).
15. **D32 Reject.** The spec says Reason is required ("Rejection reason is required") and that the shipment re-opens for re-dispatch. The Reason field and the Reject card already exist on D32. Only the Reject button is changed, from a toast to the `reject-shipment` action, for this tour (decision B). In the Dealer order to dealer delivery and Dealer stock and issues walkthroughs, clicking Reject now shows the hint instead of a toast.
16. **The O24 Approve button is not used.** It shows a toast. Step 6 uses O20's Approve.
17. **The info note and expected dispatch date fields** are in O20's field table, not O24's. They are shown on O24 with the O20 labels (assumption).
18. **The spec describes O24 as a dialog or inline part of O20.** It is shown here as its own screen (assumption). O20 is unchanged.
19. **D51 and D52** (the e-way bill and delivery challan mocks) are not built, as requested.

## Assumptions and decisions (approved)

20. **The 14 steps** are in the approved order: O24 note, date, reject; D30 dealer view (card); O24 revert; O20 approve; O23 verify; O23 N26 card; O22 N10 card; O22 dispatch; D32 reject shipment; O22 N27 card; O22 dispatch again; D32 confirm delivery (end).
21. **Decision A:** Charan (Super Admin) on O20 and O24 (gap 1).
22. **Decision B:** the D32 Reject button is the `reject-shipment` action, used only in this tour. Its other steps are unchanged.
23. **Decision C:** N27 is before the re-dispatch.
24. **Decision D:** one tour of 14 steps.

## Walkthrough notes (not spec gaps)

- O20 is unchanged, so `order-to-production` keeps its O20 warnings.
- D32 changed only in the Reject button. The dealer-stock-and-issues D32 steps now have one more warning each.
- The registry import is bumped to `?v=11` in `router.js`, `apps/everp/mock-app/index.html` and `walkthrough/src/main.js`. D32 is bumped to `?v=7`, and O24 is `?v=1`.
