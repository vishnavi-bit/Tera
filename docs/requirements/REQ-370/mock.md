# Mock: Vendor master and vendor purchase orders

Vendor master (Release 1)

```
+----------------------------------------------+
| Vendors > New                                |
+----------------------------------------------+
| Name [ ____________ ]  Active [x]            |
| Contact [ _________ ]  Phone [ ____________ ]|
| Email [ ___________ ]  GST [ ______________ ]|
| Address [ ___________________________ ]      |
| Notes [ _____________________________ ]      |
|                            [ Save vendor ]   |
+----------------------------------------------+
```

Vendor purchase order (Release 1 by hand; Release 2 adds the shortage row)

```
+----------------------------------------------+
| Vendors > Procurement                        |
+----------------------------------------------+
| Shortage (Release 2: needed vs stock)        |
| Part          | Needed | In stock | Short    |
| Battery pack  |   20   |    6     |   14     |
+----------------------------------------------+
| Vendor [ Choose a vendor v ]                 |
| Receiving unit ID [ ____________ ]           |
| Part ID [ ____________ ]                     |
| Order qty [ 14 ]   Rate [ 250.50 ]           |
|                        [ Create PO ]         |
+----------------------------------------------+
| PO number  | Vendor | Unit | Lines | Total | Status |
| PO-2026-0001 | Acme | U1 | P-9 x 14 @ 250.50 | 3507.00 | draft |
+----------------------------------------------+
```
