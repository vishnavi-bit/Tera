# Spec gaps: Dealer order to delivery

Source: docs/requirements/REQ-378 to REQ-387 (req.md and mock.md). The spec has no screen codes, so the mock uses S01 to S06 (listed in mock-data/spec/screens.json).

## Spec gaps

1. **Seller for a dealer order (REQ-378).** The spec says a higher-tier dealer can be the seller, but does not say whether the 16/20/32/40 rule applies the same way. Shown: seller select with a "Not defined" alert (S01). Open in REQ-378.
2. **OCR on receipt upload (REQ-379).** The spec says receipt upload uses OCR to fill transaction, amount and date (D31), and asks whether OCR is in this release. Shown: "Upload receipt" with a "Not defined" alert; fields are entered by hand (S02).
3. **Approver roles (REQ-380).** Sales (Head, Regional, Zonal) approves and Accounts verifies payments; the split is to be confirmed. Shown: "Not defined" step before approval. The tour uses a new sample user, "Sales approver (role to confirm)" (oem-sales), who does not exist in the source.
4. **Chassis at assignment (REQ-385).** The source says no chassis is entered at assignment (O21), but N07 says identifiers are validated before assignment. Shown: "Not defined" step before assignment; the tour assigns without chassis numbers (S04).
5. **Identifiers checked before dispatch (REQ-386).** N07 says "correct chassis number and all identifiers" with no list. Shown: "Not defined" step before dispatch; the tour shows chassis and motor checks (S05).

## Walkthrough notes (not spec gaps)

- The sample stock is 24 at the seller, so the 16-unit order fits. The first screen's sample in REQ-378 shows 4 available, which cannot cover 16 units.
- The tour takes the happy path only. Rejections, the mismatch block, partial dispatch and the dealer ledger are not in the tour.
- Order status values used: Pending, Approved, In production, Dispatched, Delivered. These are sample values chosen for the tour; the spec does not name them.
- Payment status values used: Not submitted, Waiting for verification, Verified.
- Transaction id 8837 and the truck number TN-01-1234 come from the REQ-379 and REQ-386 mocks.
