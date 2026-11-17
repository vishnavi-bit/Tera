# Gap list: QC and packaging

Sequence: `sequences/qc-and-packaging.json`. Seed (sample data): `mock-app/mock-data/seeds/qc-and-packaging.json` (PO-2026-0412, Tera Zip 60V 30Ah, qty 16 and MU Hosur are copied from the Dealer order to dealer delivery sample; the chassis TZ-SAMPLE-0401 is fake). Screens: N04, N05, N06 and N07, reused unchanged. Each is a heading-only mock with no fields, buttons or labels, so each shows its heading behind a Not defined card.

## Spec gaps

1. **N04, N05, N06 and N07 have no screens.** Each step shows its heading over an empty frame, with a Not defined card on top.
2. **N04 identifiers.** The spec gives no fields for the chassis, motor, controller and battery capture. The seed chassis number is fake sample data.
3. **N05 checklist.** The spec gives no items. It says only "Yes/No checklist per finished unit before release". No items are shown.
4. **N06 requests.** The spec gives no material list. N06 is "sourced from the BOM", and the BOM (N08) has no screen. The card names the BOM only.
5. **QC ownership.** `docs/people.md` lists Ganesh as Production Manager, Quality Control Manager and PDI Manager. The spec has no role codes for these. Ganesh (`oem-production-mgr`) is used for N04, N05 and N06, as an assumption. Dhivyesh (`oem-logistics-mgr`) is used for N07.
6. **O21 placement conflict.** `docs/workflows/flow_first_order.md` puts O21 Assign Item after QC and before N07. The order walkthrough (Dealer order to dealer delivery) puts O21 before production. This tour ends at N07 and does not include O21. The conflict is recorded, not resolved.
7. **"Ready for Dispatch" is not defined in the spec.** The order walkthrough sets this status at N04. This tour shows no floater and no status.
8. **The rework loop is not built.** `flow_first_order.md` sends a failed QC check back to production. The loop is not in `docs/screen_details.md`, so it is recorded here and not built.
9. **The order walkthrough shows N04, N05 and N06 as one combined card.** This tour shows them as three separate cards, with the same card wording as the combined card. The duplication is on purpose.
10. **Ruby (Inventory Manager)** is named in the N06 card text only, read from the user data, as the N03 card does.
11. **Screen name spelling.** The N07 heading reads "Despatch - Chassis Validation Gate", with a hyphen. The spec reads "Despatch — Chassis Validation Gate", with a dash. The heading comes from the existing N07 module, which the order walkthrough also uses, so it is not changed here.
12. **No floater and no status.** Every step is a card and nothing changes.

## Assumptions and decisions (approved)

13. **Separate tour, four steps.** N04 (Ganesh), N05 (Ganesh), N06 (Ganesh, with Ruby named in the text), N07 (Dhivyesh, end). No step has an action, so each card is its own step.
14. **End at N07** (decision 1). O21 is not included.
15. **Ganesh for N04, N05 and N06** (assumption, decision 3).
16. **Rework loop not built** (decision 4).
17. **Card wording matches the order walkthrough's combined card** (decision 5): the names come from the user data, and each card reads "Not defined in screen_details.md, so this stage cannot be shown."

## Walkthrough notes (not spec gaps)

- N04, N05, N06 and N07 are reused unchanged. Their registry entries are not changed, so the registry version does not change.
- The order walkthrough's N04, N05, N06 and N07 steps are unchanged.
