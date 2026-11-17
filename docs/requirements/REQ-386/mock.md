# Mock: Chassis validation and dispatch shipment

```
+----------------------------------------------+
| Dispatch > PO-1042 > Validate & dispatch     |
+----------------------------------------------+
| Unit            | Chassis  | Motor | Status  |
| CH-2026-00451   |   OK     |  OK   | Ready   |
| CH-2026-00452   |   OK     |  MISMATCH | BLOCKED|
| Transport [ Truck TN-01-1234 ]               |
|                     [ Dispatch ready units ] |
+----------------------------------------------+
```
