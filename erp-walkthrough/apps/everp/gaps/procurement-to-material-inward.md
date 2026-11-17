# Gap list: Procurement to material inward

Sequence: `sequences/procurement-to-material-inward.json`. Seed (sample data): `mock-app/mock-data/seeds/procurement-to-material-inward.json` (copied values from the OEM setup seed: Sample Vendor Hosur, MU Hosur, Sample Motor 48V, Sample Battery 48V 30Ah, Sample Controller 72V). Screens: O39 and O26 (reused), O40, O41 and O35 (new).

## Spec gaps

1. **Vendor roles are unkeyed.** O39, O40 and O41 say "(unkeyed)" or "Role not keyed — confirm access". Suresh (`oem-procurement-mgr`) is used.
2. **The procurement role has no code** in the spec. `docs/people.md` lists Suresh as Procurement Manager. N28 proposes the role, with no fields.
3. **The PO approval is by email**, "by the OEM approval admin, via email" (O41). The spec's section reference for it is not in `screen_details.md`. No approval screen exists. The approval is a card step.
4. **O49's Approval Admin Email is shown with no required mark, because the spec marks it '?'.**
5. **What N17 sends** (the vendor PO by email on approval) is not defined. Re-sending a changed and re-approved PO is an open question in the spec.
6. **The O41 "choose vendor" view** refers to a section that is not in `screen_details.md`. The walkthrough shows the vendor's procurement view (O40) through the create button, as a toast.
7. **No spec link connects a vendor PO to material inward or to an in-transit shipment.** O35 in-transit shipments have no vendor PO field.
8. **O35 in-transit receive and N02 material inward are two receiving paths.** The spec says N02 extends O35 receiving, but does not say how the two relate.
9. **N02's role is "Inventory Executive"**, which `docs/people.md` does not have. Ruby (Inventory Manager, `oem-inventory-mgr`) is used.
10. **The N02 checks are not defined**: the received count against the PO, the shortfall, pass or fail for each item, and scrap.
11. **N08 content** (parts, quantities, images, landing price per vehicle model) has no screen. The walkthrough shows the N08 card on O26.
12. **N09 approver and scope are open.** The spec asks who approves a BOM change (Production Head, QC or OEM Admin) and whether every change needs a version.
13. **O40 "Needed" comes from a dispatch list demand** that no screen shows. The walkthrough shows the seed values without calculation. Net and Amount are not calculated.
14. **O40 "Create PO (n)"**: the spec does not say what n is. The walkthrough reads it from the seed (lineCount).
15. **N25 feeds O40**, but the spec does not say how the reorder reaches the screen.
16. **N18 backdated entry** has no screen. The card sits on O35.
17. **The N08 card step uses Suresh** (assumption). The spec names no role for N08 or N09.

## Assumptions and decisions (approved)

18. **Start at O39 and skip O28.** The vendor and components already exist from OEM setup. O26 appears only as the screen behind the N08 and N09 card.
19. **O35 MU Stock is a new screen** and carries the N02 and N18 cards. Its daily register shows all seven spec columns (model, opening, dispatched, reserved, received, closing, in transit), with seed values only, not calculated. Clicking Reserved shows a toast in place of the dealer breakdown, which the spec describes. Its in-transit form shows the spec's fields: Product, Dispatch Date, Colors Breakdown (+ Add Color) and Notes. The spec spells it "Colors", so that spelling is used. The buttons are as listed in the spec, and each shows a toast.
20. **O41 columns: Type, Amount, MU and Action.** Type, Amount and MU come from the O40 labels, which is an assumption, because O41 names no columns. The row shows once the PO is created.
21. **Approval** is shown by Charan (Super Admin) as an assumption. `docs/people.md` lists him as Accounts Manager and Super Admin Panel Control. It has no "approval admin" role, so this is not a role he holds.
22. **The procurement button on O39 is a walkthrough action.** It was a toast. Changing it to an action shows a hint in the OEM setup walkthrough, which also uses O39 (see walkthrough notes).
23. **The vendor PO status floater** (Not raised, Pending approval, Approved, Received) changes only through stateChange.

## Walkthrough notes (not spec gaps)

- The procurement button leads to the N08 card (O26) and then to O40. The spec gives no link from O39 to O26. The walkthrough follows the first-order flow.
- O39 is shared with the OEM setup walkthrough. The procurement button there now shows a hint when clicked. The OEM setup steps are unchanged.
- Step 6 (O41, Suresh) shows the card "approval by the OEM approval admin, via email, with no approval screen defined". Step 7 (O41, Charan) shows the N17 card, and the floater changes to Approved.
- The O40 "Create PO" button is an action. Its effect is a status change in the floater only.
