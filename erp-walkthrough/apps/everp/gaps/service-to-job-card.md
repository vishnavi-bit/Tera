# Gap list: Service request to job card

Source of truth: `docs/screen_details.md` (read only). Sequence: `apps/everp/sequences/service-to-job-card.json` (5 steps). Seed (sample data): `apps/everp/mock-app/mock-data/seeds/service-to-job-card.json`. Flow: `docs/workflows/flow_service_warranty.md` (first part). Actor: Latha (Dealer - Service).

## Spec gaps

1. **What a service follow-up is.** D13 and D14 exist in the spec, but no rule says how a service follow-up is created or when one is due (for example a free-service reminder). The sample rows give invented reasons ("First free service due", "Battery check due").
2. **D13 columns and filter.** The spec gives "filter, search by name / phone / email" with no filter options and no columns. The filter shows a "Not defined" alert. Columns are the walkthrough's own.
3. **D14 fields.** Subject, Note and Next Follow-Up are marked "?" in the spec. No required markers.
4. **D14 summary.** The spec gives no fields for the top of the page. Customer, mobile, chassis and reason are shown from the sample data.
5. **D14 dialog.** The spec calls it a dialog. It is shown as a card on the page. The "add follow-up" button at the top shows a toast.
6. **D26 reached from the tour (assumption).** The spec path is `/inventory/service-price` under Inventory. The tour goes D14 → D26 → D40 as the flow doc says the price list feeds the SERVICE invoice. No spec control links D14 to D26.
7. **D26 dialog.** The spec says "List + Dialog" with new, edit and delete. The new-price form is shown as a card. Created by and created on are read only, filled by the system.
8. **D26 rules.** Validation text ("Service Name is required", "Price must be a number") is not shown. Whether a price includes GST is not defined.
9. **D40 filter and columns.** The status options are not defined (alert). Columns are the walkthrough's own. "open" is not wired.
10. **D40 roles.** The spec lists D and V, not S. The walkthrough uses Latha (Service), who is also used on D41, as in the earlier service walkthrough.
11. **D41 reached from D40.** The spec path for D41 is under the customer (`/customer/:id/service/new`). The tour reaches it from D40 "create", which is listed in the spec.
12. **D42 end.** The tour stops at the job card. "complete service" opens D20 (SERVICE invoice) and is the start of "Service to warranty claim". The button on D42 has no rule here, so it shows a hint.
13. **D41 and D42 field values.** They are reused as built for the earlier service walkthrough, with their own gaps (see `gaps/service-warranty-claim.md`).

## Walkthrough notes (not spec gaps)

- No sample value appears in any `.js` file or in the sequence text. Values come from the seed, which is marked `_sample`.
- D41 and D42 are the screens built earlier. They read the same seed keys (`service`, `vehicle`, `jobCard`, `customer`).
- Checked at 390px: no sideways overflow and no small tap targets on D13, D14, D26, D40, D41 and D42.
