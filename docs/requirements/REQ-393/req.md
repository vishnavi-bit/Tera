# Dealer: Sales quotation

Requirement REQ-393 · Feature FEAT-1356 · Decision DEC-428
Order: 27 of 37 · Depends on: 6 OEM: Spares and components catalogue, 26 Dealer: Enquiry capture and follow-ups

## Purpose
Dealer salesman creates a quotation for an enquiry, with product, variant, colour, GST, discount and terms.

## Behaviour
- Salesman picks a product with variant and colour; the customer price applies.
- GST can be switched on or off; a discount can be given per line.
- Terms, attachments and an adjustment can be added.
- The quotation is listed under the enquiry.

## Acceptance criteria
1. A product with variant and colour can be picked; the customer price applies.
2. GST can be toggled and a per-line discount given.
3. Terms, attachments and an adjustment can be added.
4. The quotation is listed under its enquiry.

## Source documents
- docs/source/functional_brief.md section 2.8
- docs/source/workflows/flow_enquiry_to_invoice.md
- docs/source/workflows/feature_catalog.md D11, D12

## Open questions
- Is the quotation a formal document for the customer, using the manufacturing unit letterhead (O33)? Confirm the output format.
