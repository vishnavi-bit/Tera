# Gap list: OEM warehouse and products

Sequence: `sequences/oem-warehouse-products.json`. Seed (sample data): `mock-app/mock-data/seeds/oem-warehouse-products.json` (product, MU and vendor names copied from the OEM setup and procurement seeds). Screens: O25, O29, O30 and O31 (new); O35, N13 mock and O27 (reused, unchanged).

## Spec gaps

1. **ADM is not in `docs/people.md`.** O25 and O29 are limited to ADM. Charan (`oem-super-admin`) is used, as an assumption.
2. **The inventory roles are not in `docs/people.md`.** O30 says "see INVENTORY_*", and O31 allows ADM, APM, DH and DM. Ruby (`oem-inventory-mgr`) is used, as an assumption.
3. **O25 has no field table.** Its list columns are not defined. Vehicle, Variant, Colour and Status are used, taken from the D29 and O31 labels (assumption).
4. **O25 status filter values** are not defined. The filter shows the "Not defined" card.
5. **O25 add, edit and delete** have no stated effect or target. They show toasts.
6. **O25 product-type tabs** (vehicle, spare, accessory, battery, charger, motor, controller) come from the O25 path. Only the vehicle tab shows rows. The others show toasts.
7. **O29 week, month and year** options are not defined. They show toasts.
8. **O29 report content** (per-model rollup, stock by MU and the price matrix) is not defined. Stock by MU shows the seed values, with the columns Manufacturing Unit, Quantity and Product (assumption, from the O10 and O21 labels).
9. **O29 "purchased vs sold"** has no stated content. Purchased and Sold are shown as sample counts from the seed.
10. **O30 names only two of its nine tabs**: stock history and reserved stock. The seven others are shown as "Not defined" tabs.
11. **O30 unit and stock filter values** are not defined. The unit filter uses the MU name from the seed (assumption).
12. **O30 columns** are not defined. Product, Quantity and Status are used (assumption, from the O31 labels).
13. **O30 search target** is not defined. It shows a toast.
14. **F6: reserved stock by dealer is OEM-only.** The reserved stock tab shows a toast, since the spec gives no detail for it.
15. **R6: MU scoping.** Charan has no MU, so he would see all units. The stock shown is the MU Hosur seed, which is the only MU in the seed.
16. **O31 columns** are not defined. Product, Quantity and Status are used (assumption).
17. **O31 status values** are from the spec: available, locked, delivered and draft.
18. **O31 unit filter values** are not defined. The MU name from the seed is used (assumption).
19. **"Add stock" leads to O35.** The spec gives the link only. It doesn't say what carries over to O35, so O35 is shown as the reused MU stock screen.
20. **The O35 relation to O30 and O31** is only the add stock link. O35 is MU-level, and the spec does not link it to O30.
21. **N12 Warehouse Location Master** has no screen. Its requirement is "define bin, rack or zone locations per manufacturing unit". Its card sits on O35.
22. **N13 FIFO Stock Issuance & Location Report** has no fields, buttons or rules. Its requirement is "stock issued from the correct (oldest-first) location; current stock-by-location report". The N13 mock is registered and is in no sequence. It contains only its page heading, so it is used as the card's host with nothing else shown.
23. **N14 Inventory Type Flag**: the requirement is a new field and a filter, so internal-use items are excluded from dealer-facing inventory. Its terminology is an open question, since the client flagged the current naming as a placeholder. The card sits on O27.
24. **N24 Spare Part Extended Fields**: the requirement is UoM, weight, material, multi-model applicability, purchase cost and price history. The source is the CEO deck (slide 23). The card sits on O27.
25. **O25 to O29 has no spec link.** The walkthrough moves to the product detail as a walkthrough move. The spec names no row link.

## Assumptions and decisions (approved)

26. **Product names** are the OEM setup names throughout (Sample Vehicle Model A, Sample Standard, Sample Red and Sample Blue colours, Sample Motor 48V, Sample Front Panel, and so on). The dealer walkthroughs use "Tera Zip", so **product names differ between walkthroughs**.
27. **The O35 screen is reused unchanged** from the procurement walkthrough. Its seven register columns (model, opening, dispatched, reserved, received, closing, in transit) are the same here.
28. **The N13 mock is the host** for the N13 card (approved). It has only its heading, so no fields, buttons or columns outside the spec are shown.
29. **The N12 card sits on O35** (approved).
30. **The N14 and N24 cards sit on the O27 spare product form** (approved). O27 is reused unchanged.
31. **No floater.** The tour is browse-only and changes nothing.

## Walkthrough notes (not spec gaps)

- The walkthrough's screens are registered with `registry.js?v=7`. The router and the engine import the registry with the same version, so the browser loads the new registry.
- O27 is shared with the OEM setup walkthrough, and O35 with the procurement walkthrough. Neither screen's code changed, so their behaviour is unchanged.
