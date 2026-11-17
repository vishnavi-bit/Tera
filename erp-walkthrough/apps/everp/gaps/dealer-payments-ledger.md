# Gap list: Dealer payments and ledger

Source of truth: `docs/screen_details.md` (read only). Sequence: `apps/everp/sequences/dealer-payments-ledger.json` (6 steps). Seed (sample data): `apps/everp/mock-app/mock-data/seeds/dealer-payments-ledger.json`. Related: `docs/discussion_dealer_payments_screens.md` (whether D33 / D34 / D45 / D46 overlap). All four dealer screens are built, as the spec lists them, so nothing is lost whichever way that is decided. Actors: Ravi Kumar (Dealer Owner) and Charan (Accounts Manager).

## Spec gaps

1. **D45 tabs.** The spec says "2 tabs" and names neither. The first is shown as "payments". The second shows a "Not defined" alert.
2. **D45 "ledger history".** Listed as a button. The spec does not say whether it opens a screen, a tab or a dialog. Toast only.
3. **D45 columns and filters.** No columns, no status options and no date-range detail. Columns are the walkthrough's own, from D46 and O45 fields. The status filter shows a "Not defined" alert.
4. **D46 shown as a card.** The spec calls it a dialog on D45. It is shown as a page.
5. **D46 landing.** The spec does not say where submit goes. The walkthrough moves on to the OEM.
6. **D46 fields.** Transaction ID, Amount and Payment Date are required, Note optional, and there is no proof upload (as the spec says). Whether the amount has a limit is not defined.
7. **O45 Verify on the row.** The spec lists "verify / reject" and, for ledger top-ups, "verified, note". The walkthrough uses the ledger top-up card (verified, note) to verify. The row's "verify" button shows a toast, as on the earlier O23 screen.
8. **O45 role.** The spec says "Role not keyed — confirm access". Charan (Accounts Manager) is used.
9. **O45 columns.** The spec lists "submitted" and "received" separately. The sample has no separate submitted date, so the payment date is repeated. The receipt is a text placeholder.
10. **Credit after verify.** The spec says the ledger is credited on verify (the toast on surplus payments). It does not say what is credited for a ledger top-up. The walkthrough credits the full top-up amount.
11. **D33 columns.** The spec says "view only" and R3 (the dealer sees only ledgers it is attached to). Columns (ledger, connected dealers, balance) are the walkthrough's own.
12. **D34 verification.** The spec shows order selection and "pay from ledger" but not whether the OEM verifies a ledger payment. The walkthrough marks the advance "Paid from ledger" at once, with no OEM step.
13. **D34 balances.** The spec shows "balance after". The mock does not calculate it. The value is in the seed and has to match by hand.
14. **D34 when balance is too low.** Not defined. Not shown.
15. **O14 content.** The spec says "PO credit balance, totals" and gives no columns. Totals are not shown. The history rows are the walkthrough's own.
16. **O14 counterpart.** The spec says D33 / D45 mirror O14. Which of the two (or both) is not defined.
17. **Ledger sharing (R3).** The sample ledger has one connected dealer. A shared ledger would show other dealers' use of it. Not shown.

## Assumptions

- **A1. Order for the advance.** PO-2026-0412 is the same order as in "Dealer order to dealer delivery", with the same 30% advance of ₹2,97,600.
- **A2. Amounts.** Opening balance ₹1,00,000, top-up ₹2,50,000, so the advance fits the ledger. These are invented.
- **A3. OEM ledger screens.** O46 and O47 (ledger list and detail) were built in OEM setup. They are not used here because the top-up is credited by verification on O45.

## Walkthrough notes (not spec gaps)

- No sample value appears in any `.js` file or in the sequence text. Values come from the seed, which is marked `_sample`.
- Ledger balances change by `copy` from seed values (`ledger.afterTopup`, `ledger.afterAdvance`), because the mock does not calculate.
- Checked at 390px: no sideways overflow and no small tap targets on D45, D46, D33, D34, O45 and O14.
