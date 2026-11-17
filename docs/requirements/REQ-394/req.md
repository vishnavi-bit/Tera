# Dealer: Convert enquiry to customer

Requirement REQ-394 · Feature FEAT-1357 · Decision DEC-429
Order: 28 of 37 · Depends on: 26 Dealer: Enquiry capture and follow-ups

## Purpose
Dealer salesman converts an enquiry into a customer record with identity documents, so a sale can be invoiced.

## Behaviour
- Conversion carries the enquiry's details into a new customer record.
- Customer has type, name, GST for business, phone, WhatsApp, billing and shipping address.
- At least one of PAN, Aadhaar or licence is required, with its file upload.
- The customer can then be used on a sale invoice.

## Acceptance criteria
1. Conversion carries the enquiry's details into the customer record.
2. A customer with at least one of PAN, Aadhaar or licence and its file can be saved.
3. A customer without an identity document is refused.
4. The customer can be selected on a sale invoice.

## Source documents
- docs/source/functional_brief.md section 2.8
- docs/source/workflows/flow_enquiry_to_invoice.md
- docs/source/workflows/feature_catalog.md D09, D15, D16

## Open questions
- Customer PII is unmasked on the OEM side (D16, F9 gap). Covered in story 31. Confirm the masking rule.
