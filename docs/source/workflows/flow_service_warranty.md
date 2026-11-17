# Service Flow — Request → Parts Replacement → Warranty / No-Warranty

IDs reference `docs/feature_catalog.md`. Dealer-owned job card; warranty branch crosses into the OEM app (O44) when raised there.

```mermaid
flowchart TD
    R1["D41 Service Create (Job Card)\nchassis, job type, customer notes"] --> R2["D42 Job Card: Inspect"]
    R2 --> P1{"Parts need replacing?"}
    P1 -- "No" --> C1["D42 Complete Service\n(labor only)"]

    P1 -- "Yes" --> W1{"Part under warranty?"}
    W1 -- "No" --> NW1["D20 Add part as paid line item\n(spare, stock-checked, dealer stock deducted)"]
    NW1 --> C1

    W1 -- "Yes" --> W2{"Raised to OEM or\nDealer's own team?"}
    W2 -- "Dealer team" --> WD1["Dealer runs: inspect → service/replace → return\n(self-contained, no OEM step)"]
    WD1 --> C1

    W2 -- "OEM" --> WO1["D38 Warranty Claim Create\n(chassis, part, issue, photos)"]
    WO1 --> WO2["O44 OEM: Verify → Inspect"]
    WO2 --> WO3{"OEM decision"}
    WO3 -- "Reject" --> WO4["D39 Claim Rejected\n(reason shown to dealer)"]
    WO3 -- "Approve, free" --> WO5["O44 Replace or Service\n(OEM stock deducted, no charge)"]
    WO3 -- "Approve, with charge" --> WO6["O44 Service charge requested"]
    WO6 --> WO7["D39 Dealer Pays Charge"]
    WO7 --> WO8["O44 OEM Verifies Payment"]
    WO8 --> WO5
    WO5 --> WO9["O44 Return logistics → D39 Confirm Receipt"]
    WO9 --> C1

    C1 --> I1["D20 Service Invoice\n(labor from D26 + any non-warranty parts)"]
    I1 --> I2["D23 Payment"]
    I2 --> I3["D21 Invoice View"]
```

**Branch points**
| Decision | Branch A | Branch B |
|---|---|---|
| Parts need replacing? | No → labor-only completion | Yes → warranty check |
| Part under warranty? | No → charged as invoice line item, dealer stock | Yes → warranty claim path |
| Claim raised to? | Dealer's own team — self-contained, no OEM involvement | OEM — full verify/inspect/service workflow (O44) |
| OEM decision on claim | Reject (reason shown) | Approve free, or approve with a service charge to the dealer |

**Side effects, not separate steps:** warranty replacement deducts **OEM** inventory; a non-warranty part deducts **dealer** inventory — different stock pools. Audit log entry on every write. Rejected claims don't block completing the service as a paid job.

**Open question (not resolved by the reference app):** if the OEM charges the dealer a warranty service fee, is that cost passed on to the customer, absorbed by the dealer, or configurable? Worth deciding explicitly — the reference app only shows dealer→OEM payment, not a dealer→customer pass-through rule.
