# First Order Flow — Setup → Dealer PO → Manufacture → Dispatch

IDs reference `docs/feature_catalog.md` (D## dealer, O## OEM, N## new). Assumes item is **not in stock** at PO time.

```mermaid
flowchart TD
    subgraph S["0. Setup"]
        S1["O50 Operating States"] --> S2["O51 Regions & Zones"]
        S2 --> S3["O33 Manufacturing Unit"]
        S3 --> S4["O53 Create OEM Users\n(Production/Inventory/QC/Dispatch/Sales)"]
        S3 --> S5["O39 Vendors"]
        S5 --> S6["O28 Products: Components\n(battery/charger/motor/controller)"]
        S6 --> S7["O26 Products: Vehicle + Variants"]
        S7 --> S8["N08 BOM Create/Edit"]
        S8 --> S9["O40/O41 Vendor PO (raw materials)"]
        S9 --> S10["N02 Material Inward\nreceive + QC raw stock"]
    end

    S10 --> D1["O05 Create Dealer\n(Region+Zone+MU)"]
    D1 --> D2["D01 Dealer Login"]

    D2 --> P1["D29 Purchase Create (cart)\nqty must be 16/20/32/40"]
    P1 --> P2{"Stock available?"}
    P2 -- "Yes" --> FAST["O21 Assign → N07 Dispatch Gate → O22 Dispatch"]
    P2 -- "No (this flow)" --> P3["D31 Pay Advance ≥30%"]
    P3 --> P4["O23 OEM Verify Payment\n→ status: production_started"]

    P4 --> M1["N03 Material Requisition\n(against this Order, reads BOM)"]
    M1 --> M2{"Raw stock sufficient?"}
    M2 -- "No" --> S9
    M2 -- "Yes" --> M3["O18 Production (build)"]
    M3 --> M4["N04 Production Completion\ncapture chassis/motor/battery/controller"]
    M4 --> Q1["N05 QC Checklist"]
    Q1 --> Q2{"QC pass?"}
    Q2 -- "No" --> M3
    Q2 -- "Yes" --> Q3["N06 QC Branding/Packaging Requisition"]

    Q3 --> A1["O21 Assign Item\n(MU + serials)"]
    A1 --> A2["N07 Despatch Chassis\nValidation Gate"]
    A2 --> A3["O22 Dispatch Shipment"]
    A3 --> A4["D32 Dealer Confirms Delivery"]
    A4 --> A5["Status: Delivered"]

    P3 -. "N19 WhatsApp: order accepted" .-> P4
    A4 -. "N19 WhatsApp: delivered" .-> A5
```

**Branch points**
| Decision | No | Yes |
|---|---|---|
| Stock available at PO time? | this flow (manufacture) | skip straight to Assign → Dispatch |
| Raw material sufficient for requisition? | loop to Vendor PO / Material Inward | proceed to Production |
| QC pass? | back to Production for rework | proceed to Branding/Packaging → Dispatch |

**Side effects, not separate steps:** Ledger credited on any payment surplus · Audit log entry on every write · WhatsApp notification on order-accepted and delivered.
