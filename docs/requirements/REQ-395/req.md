# Dealer: Sale invoice with serial capture

Requirement REQ-395 · Feature FEAT-1358 · Decision DEC-430
Order: 29 of 37 · Depends on: 16 OEM: Production completion and handover, 24 Dealer: Dealer stock view, 28 Dealer: Convert enquiry to customer

## Purpose
Dealer salesman creates a sale invoice for a customer and captures the chassis, motor, battery and controller serials. This binds the vehicle to that customer, which is where traceability reaches the customer sale.

## Behaviour
- The product picker shows dealer stock; a line cannot exceed stock available.
- Serials are captured per line: chassis, motor, battery, controller and charger.
- Saving binds the chassis to the customer; the unit leaves dealer stock.
- A serial already sold to another customer is refused.
- If stock is short, the dealer is directed to a purchase order.

## Acceptance criteria
1. A line cannot exceed dealer stock available.
2. Serials are captured per line.
3. Saving binds the chassis to the customer and reduces dealer stock.
4. A serial already sold to another customer is refused.
5. Short stock routes the dealer to a purchase order.

## Source documents
- docs/source/functional_brief.md sections 2.3, 2.8
- docs/source/workflows/flow_enquiry_to_invoice.md
- docs/source/workflows/feature_catalog.md D20

## Open questions
- Only the invoice total is taken from the product. Are custom serial fields needed (D20 mentions custom fields)?
- The enquiry-to-invoice flow mentions a service-type invoice too; that is story 33.
