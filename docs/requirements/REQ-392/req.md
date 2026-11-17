# Dealer: Enquiry capture and follow-ups

Requirement REQ-392 · Feature FEAT-1355 · Decision DEC-427
Order: 26 of 37 · Depends on: 8 Dealer: Dealer staff accounts

## Purpose
Dealer salesman records a customer enquiry (hot, warm or cold) and logs follow-ups. No lead is lost.

## Behaviour
- Salesman creates an enquiry with type, customer type, name, phone, WhatsApp, email, location, note and schedule.
- Salesman logs a follow-up with subject, note, caller and next schedule, and closes or reopens it.
- Enquiries are filtered by all, today, week, month or a date.
- The enquiry has no vehicle field; the vehicle is captured on the quotation.

## Acceptance criteria
1. An enquiry can be created with all listed fields.
2. A follow-up can be logged, closed and reopened.
3. Enquiries can be filtered by all, today, week, month and date.
4. The enquiry has no vehicle field.

## Source documents
- docs/source/functional_brief.md section 2.8
- docs/source/workflows/flow_enquiry_to_invoice.md
- docs/source/workflows/feature_catalog.md D07, D08, D09, D10

## Open questions
- Enquiry can be reopened after closing (D09). Can it be deleted too, and who may?
