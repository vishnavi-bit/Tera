# Gap list: Enquiry to invoice

Source of truth: `docs/screen_details.md` (read only). Sequence: `apps/everp/sequences/enquiry-to-invoice.json` (16 steps). Seed (sample data): `apps/everp/mock-app/mock-data/seeds/enquiry-to-invoice.json`. Flow: `docs/workflows/flow_enquiry_to_invoice.md`. Actor: Swati (Dealer - Sales).

## Spec gaps

1. **D07 columns.** The spec names the filter and "new" only. Columns shown (Enquiry, Name, Type, Mobile, Location, Next follow-up, Status) are the walkthrough's own, from the D08 fields.
2. **D07 filter behaviour.** The spec lists all / today / week / month / date, with no date-picker detail. Toast only.
3. **Landing after create (assumption).** D08 does not say where "create" goes. The walkthrough goes to D09, the enquiry detail.
4. **D08 buttons.** The spec lists create, save, delete and convert to customer. create is the add-mode button. The other three are edit-mode and show toasts.
5. **D08 Note requirement.** The spec marks Note "?". Shown without a required marker. Same for the D10 fields Subject, Description and Called by.
6. **D08 hidden fields.** followUpType and followUpDate are set by follow-up logic the spec does not describe. Not shown.
7. **D09 links to D10 and D11 (assumption).** The spec lists edit, delete and convert to customer only. "follow-up" and "quotation" buttons are added so the tour can reach D10 and D11. D10 and D11 have paths under `/enquire/:id/` but no spec control that leads to them.
8. **D09 fields.** The spec gives no field list. The D08 fields are shown read only.
9. **D10 landing and "next follow-up".** D08 says a schedule "creates the next follow-up". The log therefore shows one follow-up already. Whether the first call is logged separately is not defined.
10. **D10 add dialog.** The spec calls it a dialog. It is shown as a card on the page.
11. **D11 columns and open target.** No columns are given. "open" shows a toast, because the spec gives no read-only quotation view.
12. **D12 required markers.** Customer Name, Quotation Date and Expiry are marked "?" in the spec. No required markers shown.
13. **D12 Add Products dialog.** Shown as a toast. The line is pre-filled with the vehicle, variant and colour.
14. **D12 total.** The spec says totals are derived. The mock shows the sum from the seed, not a calculation.
15. **Vehicle chosen on the quotation.** D08 has no vehicle-of-interest field, so the model first appears on D12 (as the spec says). The invoice later uses the same product from the seed.
16. **D16 State options.** The spec gives "36 states / UTs" from an API, not a list. The State select shows the sample state only, with a "Not defined" alert.
17. **D16 conversion landing (assumption).** D09 says convert goes to D16 with enquireId. After create, the walkthrough goes to D17, the customer hub. The spec does not say where create goes.
18. **D16 documents.** At least one of PAN, Aadhar, Licence is required. Only PAN is filled in the sample. Upload controls show a toast.
19. **D17 fields.** The Personal details tab has no field list. The D16 fields are shown read only. Only the payment tab is wired. Other tabs show toasts.
20. **D17 tab for payment (assumption).** The spec lists six tabs. The walkthrough reaches payments through the "payment" tab.
21. **D22 and D19 columns.** No column lists in the spec. Own columns from the D23 and D20 fields.
22. **D23 Advance.** Payment Type Advance is one of three types. The spec does not say how an advance is later applied to an invoice beyond "link". The walkthrough links it on D20 and shows it as paid.
23. **D23 bank charges.** The spec shows a summary of received, charges and total, with no formula. Charges are percent of amount in the mock (0% in the sample).
24. **D23 Invoice and Refund types.** Not walked. "+ Link invoice" and "Refund link" appear only for those types.
25. **D24 and D25 columns.** No column lists. Own columns used. D24's row-open target (`/inventory/vehicle/:id`) has no screen in the spec. A "parts" button on D24 is added so the tour can reach D25.
26. **Stock check on the invoice.** The spec says the product picker is stock-checked and shows "Insufficient Stock!" messages. This is not shown. The walkthrough has stock and checks it by eye on D24.
27. **Which chassis.** The spec says the server validates the chassis against dealer stock and the chassis is bound to the customer on the invoice. The seed uses an available chassis from D24. The binding is not shown beyond the invoice.
28. **Invoice status "Pending".** The flow doc says the invoice stays Pending until paid in full. The spec has no list of invoice statuses. "Pending" comes from the flow doc.
29. **D21 layout.** The spec says only "print". The document layout is the walkthrough's own.
30. **Balance payment.** Not part of this tour. The flow doc has it (D23 linked to the invoice). It would be a follow-on step.

## Assumptions

- **A1. Customer sample.** Kavya Sample is a new invented customer. She is not in `docs/people.md`. Customers are not staff.
- **A2. Advance amount.** The sample advance is ₹5,000. The spec gives no rule for it.
- **A3. N21–N28.** None of these screens belongs in this flow. N26 (OK to Bill) and N27 (PDI) are order and dispatch gates and go into the order walkthrough.
- **A4. OEM mirror (O07, O08, O09).** Not built here. They belong to the walkthrough "OEM monitors a dealer", so they are built once.

## Walkthrough notes (not spec gaps)

- No sample value appears in any `.js` file or in the sequence text. Values come from the seed, which is marked `_sample`.
- D20 (Sale Invoice Create) was built earlier for the service walkthrough. It now also shows the linked payment when the seed has one. The service seed is unchanged.
- Shared styles: tables are wrapped in a scroll container, and below 768px buttons, tabs, inputs and header icons are at least 44px, with 16px input text. Checked at 390px: no sideways overflow on the 14 new screens and D20.
- Validator warnings left as they are: D09 shows both "open-followup" and "convert-customer", which are used at different steps.
