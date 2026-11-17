# Gap list: Manufacturing unit operations

Sequence: `sequences/manufacturing-unit-operations.json`. Seed (sample data): `mock-app/mock-data/seeds/manufacturing-unit-operations.json` (the unit, products, stock and vendor values are copied from the OEM setup, procurement and mirror-views seeds). Screens: O34 and O36 (new); O35 (reused unchanged from the procurement walkthrough).

## Spec gaps

1. **The MU roles are not in `docs/people.md`.** O34 says ADM, DH and DM. Charan (`oem-super-admin`) is used, as an assumption.
2. **The O36 roles are ADM, DH and DM.** `docs/people.md` does not say what DH and DM mean. Dhivyesh (`oem-logistics-mgr`) is used for O36, as an assumption.
3. **The O34 layout is not defined.** The walkthrough shows the O33 fields as an assumption, with the O33 labels as the source. Card on step 1.
4. **The O34 buttons have no stated targets.** edit has no target. MU stock goes to O35 and dispatch plan goes to O36, both by name. load plan and containers are deferred to O37 and O38 and show toasts. production has no target and shows a toast.
5. **"Search any dealer" (dealerId, required)** is shown as a search field. The spec gives "search / select", so the type is not decided. It is shown without a required mark, since the spec gives no required marker here.
6. **"Connect a dealer" has no stated effect** beyond "moves the dealer to this unit; already-connected ones are flagged". The walkthrough shows only the connected flag for Sri Lakshmi EVs. No dealer list is shown (decision C).
7. **O35 Reduce Stock fields are not captured** in the spec. The card on step 3 says so.
8. **O35 spelling.** The spec gives "Colors Breakdown (+ Add Color)", and that spelling is kept here.
9. **The O35 daily register** shows the seven spec columns (model, opening, dispatched, reserved, received, closing, in transit) with seed values only. Reserved is a toast, as on the procurement walkthrough.
10. **F6: the MU stock register and reserved stock by dealer are OEM-only.** Ruby is an OEM user, so both are shown.
11. **O36 marker meanings and date range are not defined.** The calendar shows the seed month. Markers are the spec's dispatch, build and component-short, and no dates or markers are calculated. Card on step 5.
12. **O36 month navigation** has no labels in the spec. The "month navigation" control shows a toast.
13. **O36 weekday headings** (Sun to Sat) are the walkthrough's own, since the spec gives no calendar layout.
14. **R6:** Charan has no MU, so he sees all units. The MU View is shown for MU Hosur, the only unit in the seed.
15. **N21 Unit Asset Register** has no screen. It is "define and track fixed/movable assets per manufacturing unit, with admin-extensible asset-type dropdown". It extends O32 to O34. Card on step 7 (on O34).
16. **O37 Load Plan and O38 Containers are deferred (P2).** Their O34 buttons show toasts. Recorded here as the deferral.
17. **O32 and O33 are not used as screens here.** O33 supplies the field labels for O34. O32 is not part of the flow, which starts at O34.
18. **Sri Lakshmi EVs is the only dealer in the seed,** and it is the only connected one.

## Assumptions and decisions (approved)

19. **The start is O34.** The flow does not need O32 or O33, since the MU is already in the seed.
20. **O35 is one step, reused unchanged** (decision A). It carries the card on Reduce Stock.
21. **Step 1 card on O34** (decision B). The screen stays visible behind the card.
22. **Connected flag next to the dealer search** (decision C). There is no dealer list.
23. **The 7 steps:** O34 card, O34 click MU stock, O35, O34 click dispatch plan, O36, O34 connect a dealer, O34 with the N21 card. A step with a card cannot also carry an action, so the clicks are their own steps.
24. **No floater.** The tour is browse-only and changes nothing. Connecting a dealer does not change any state.

## Walkthrough notes (not spec gaps)

- The shared screens O34, O36 and O35 are used only here (O34 and O36 are new). O35 is unchanged, so the procurement walkthrough keeps its behaviour.
- O34 is used by all five O34 steps. Its buttons have actions in one step each, so the validator reports the other steps' buttons as expected warnings.
- The registry import is bumped to `?v=8` in `router.js`, `apps/everp/mock-app/index.html` and `walkthrough/src/main.js`, so browsers load the new registry.
