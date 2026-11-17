# Dealer: WhatsApp order and delivery messages

Requirement REQ-391 · Feature FEAT-1354 · Decision DEC-426
Order: 25 of 37 · Depends on: 14 OEM: OEM approves order and verifies payment, 21 Dealer: Dealer confirms delivery or reports issue

## Purpose
Dealer receives a WhatsApp message when an order is accepted and when it is delivered.

## Behaviour
- A message is sent to the dealer when the order is accepted.
- A message is sent to the dealer when the order is delivered.
- Each message names the order and links to it.
- A failed send is recorded and does not block the order.

## Acceptance criteria
1. A message is sent on order accepted.
2. A message is sent on order delivered.
3. A failed send is recorded without blocking the order.

## Source documents
- docs/source/functional_brief.md section 2.14
- docs/source/workflows/feature_catalog.md N19
- docs/source/workflows/flow_first_order.md

## Open questions
- Outstanding-due WhatsApp messages (N19) are not in this story. Add them later or here?
- The client quotation includes 20,000 WhatsApp credits (N19). Is the provider and account set up?
