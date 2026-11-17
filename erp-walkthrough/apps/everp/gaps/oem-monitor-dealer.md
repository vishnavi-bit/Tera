# Gap list: OEM monitors a dealer (mirror views)

Sequence: `sequences/oem-monitor-dealer.json`. Seed (sample data): `mock-app/mock-data/seeds/oem-monitor-dealer.json`. Screens: O04 and O06 (reused, unchanged), O07, O08, O09, O10, O11, O12, O13 and O48 (new).

## Spec gaps

1. **OEM roles are not keyed.** O07 to O13 say "see …" (for example "see DEALER_DETAILS"), and O48 says "(unkeyed)". `docs/people.md` has no role codes. Charan (Super Admin, `oem-super-admin`) is the one actor.
2. **O10 roles are ADM, SZH, APM and DH.** I read ADM as Super Admin (an assumption). SZH, APM and DH are not used.
3. **O06 names three tabs only**: Profile, Connections and Ledger top-ups. The other six have no names and no content. The O06 screen is unchanged and shows "Not defined" for them.
4. **O06 does not say how it leads to the mirrors.** No tab, button or link is defined for it. Step 2 shows the "Not defined" alert.
5. **F9: customer PAN and Aadhaar are shown unmasked.** The spec marks this as a gap. The walkthrough shows the values as the spec says and does not mask them. The values are fake placeholders: PAN `XXXXX0000X` and Aadhaar `0000 0000 0000`.
6. **R10: read-only access through `?dealerProfileID=`** is not modelled. The dealer comes from the seed, not from a URL parameter.
7. **R6: Charan has no manufacturing unit**, so he sees all units ("All units (global)").
8. **R7 does not apply** to Charan, because R7 is for OEM sales users with assigned dealers.
9. **O07 has six tabs but no names.** The names are taken from D17: personal, vehicle, invoice, payment, service and warranty (an assumption). The tab content, apart from personal details, is not defined and shows the "Not defined" alert.
10. **O07 list columns are not defined.** Customer ID, Name, Phone, Email and Status are an assumption (based on the D15 approach).
11. **O07 "open" has no stated target** beyond the customer mirror. It shows the customer's detail below the list.
12. **O08 has no buttons, fields or columns** ("no dedicated input form"). The enquiry columns are an assumption.
13. **O09 has no buttons, fields or columns.** The vehicle-sold columns are an assumption.
14. **O10 add stock to dealer has no stated effect**, no submit control, and no Product options. Step 7 is a pass-through with the "Not defined" alert, as on D27. Product type options are from the spec. Type tabs have no names beyond the product types (an assumption).
15. **O11 claims-by-product chart is not defined**, and neither are the period filter options. The walkthrough shows the claims by product as a table, as its own view of the data (an assumption). The chart shows the "Not defined" alert.
16. **O12 status and type filter options are not defined**, and no columns are given. The columns are the D28 shape (an assumption).
17. **O13 "approved minus dispatched" is a spec calculation.** The mock shows the sample values from the seed and does not calculate. No column names are given. The columns are an assumption.
18. **O48 and O09 both show vehicles sold.** O48 is at `/vehicle-sold` with no dealer ID, so it is read as an OEM-wide report. The walkthrough shows only Sri Lakshmi EVs rows, so no other dealers are invented (an assumption). O48 columns are not defined. The period options (today, month, year, custom) are from the spec.
19. **The moves between screens (steps 3 to 10) have no spec link.** They are walkthrough moves.

## Assumptions and decisions (approved)

20. **Seed reuse.** Customer Kavya Sample (CUS-0103, phone 9000000301), chassis TZ-SAMPLE-0301 and invoice INV-SAMPLE-0001 (₹65,100) are copied from the enquiry-to-invoice seed. The enquiry-to-invoice seed is unchanged.
21. **The "Created" invoice status exists only in the new seed.** The enquiry-to-invoice seed has "Not created", so the new seed is the only place where the invoice is "Created".
22. **Chassis TZ-SAMPLE-0301 shows "Sold"** in O10 stock, because the invoice exists. The other stock rows are copied from the enquiry-to-invoice seed. The available count is 2 in the new seed (the enquiry seed says 3).
23. **Enquiry ENQ-SAMPLE-0003 shows "Converted"** in O08, because the customer and invoice exist. The enquiry seed says "Not created". This status exists only in the new seed.
24. **PO numbers come from the order-to-production seed.** PO-2026-0388, PO-2026-0401 and PO-2026-0412 keep their numbers, quantities and amounts. PO-2026-0412 shows "Delivered" here, while the order-to-production seed says "Not placed". The new status exists only in the new seed.
25. **Payment on the Customer mirror.** The payment record (PAY-SAMPLE-0001, UTR-SAMPLE-0301, ₹5,000) is shown in a card titled "Payment" under the customer details. The spec does not say how the Payment tab shows it, so it is not in a tab.
26. **Pending stock values are sample values from the seed**, including PO-2026-0401 with 4 pending.
27. **Claim CLM-SAMPLE-0001** is a new sample claim for chassis TZ-SAMPLE-0301. All claim values are new and marked `_sample`.
28. **Customer IDs, chassis numbers, invoice numbers and transaction IDs match** across O07, O08, O09, O10, O11, O12, O13 and O48.
29. **No floater state.** The tour is browse-only and has no state changes. The step card still shows the proposed action, because the engine always shows it.

## Walkthrough notes (not spec gaps)

- O04 and O06 are reused without any change. The new seed supplies the dealer data they read (`dealers`, `newDealer` and `lists`).
- O14 is not used in this tour, and it is unchanged.
- The O04 link to the dealer (step 1) uses `goto-O06`, the same pattern as the dealer-setup walkthrough.
