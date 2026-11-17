# Customer Flow — Enquiry → Customer → Invoice

IDs reference `docs/feature_catalog.md` (D## dealer). Dealer-owned flow; OEM only sees a read-only mirror throughout (O07/O08/O09).

```mermaid
flowchart TD
    E1["D08 Enquiry Add\nHOT/WARM/COLD"] --> E2["D10 Follow-up Log"]
    E2 --> E3{"Wants a quote?"}
    E3 -- "Yes" --> E4["D12 Quotation Create\n(product+variant+colour, GST)"]
    E4 --> E5{"Converting to customer?"}
    E3 -- "No" --> E5
    E5 -- "Not yet" --> E2
    E5 -- "Lost" --> E6["D09 Enquiry Closed"]
    E5 -- "Yes" --> C1["D16 Customer Add/Edit\n(enquireId carried over)"]

    C1 --> I1["D20 Sale Invoice Create\nproduct picker, stock-checked"]
    I1 --> I2{"Dealer stock available?"}
    I2 -- "No" --> PO["→ see flow_first_order.md\n(dealer raises PO, waits for dispatch)"]
    PO --> I1
    I2 -- "Yes" --> I3["Serials captured on invoice:\nchassis / motor / battery / controller\n(chassis now bound to this customer)"]
    I3 --> I4{"Full payment now?"}
    I4 -- "No" --> I5["D23 Partial Payment\n(invoice stays Pending)"]
    I4 -- "Yes" --> I6["D23 Payment, linked to invoice"]
    I5 --> I7["D21 Invoice View / Print"]
    I6 --> I7
```

**Branch points**
| Decision | No / not yet | Yes |
|---|---|---|
| Wants a formal quote? | skip straight to conversion | D12 Quotation first |
| Ready to convert to customer? | keep logging follow-ups (D10) | D16 Customer Add/Edit |
| Dealer has stock for the invoice items? | divert to Purchase flow (`flow_first_order.md`), return once dispatched | continue to invoice |
| Paid in full at invoice time? | invoice status = Pending, partial payments reduce it | invoice status = Paid |

**Side effects, not separate steps:** Enquiry can be reopened (D09) even after closing · Every invoice/payment write hits the audit log · OEM sees all of this read-only via O07/O09, never create/edit.

**Variant not shown above:** a Service job (D41/D42) also produces a `type=SERVICE` invoice through the same D20 screen, priced from the dealer's Service Price List (D26) instead of the product catalog.
