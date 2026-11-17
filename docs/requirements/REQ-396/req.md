# Dealer: Customer payment against invoice

Requirement REQ-396 · Feature FEAT-1359 · Decision DEC-431
Order: 30 of 37 · Depends on: 29 Dealer: Sale invoice with serial capture

## Purpose
Dealer salesman records a customer payment against an invoice, so the invoice shows paid or pending.

## Behaviour
- Payment has type (advance, invoice or refund), mode, amount, bank charges, transaction id and internal note.
- A partial payment leaves the invoice pending.
- A full payment sets the invoice to paid.
- The payment is linked to the invoice and listed under the customer.

## Acceptance criteria
1. A payment can be recorded with type, mode, amount, bank charges, transaction id and note.
2. A partial payment leaves the invoice pending.
3. A full payment sets the invoice to paid.
4. The payment appears under the customer.

## Source documents
- docs/source/functional_brief.md sections 2.6, 2.8
- docs/source/workflows/flow_enquiry_to_invoice.md
- docs/source/workflows/feature_catalog.md D22, D23

## Open questions
- Refunds (type) are listed in D23 but no refund rule is given. What is the refund flow?
