# Mock: Material requisition against an order

```
+----------------------------------------------+
| Production > Requisition for PO-1042         |
+----------------------------------------------+
| Part          | Required | Stock | Status    |
| Battery pack  |   16     |  12   | SHORT (4) |
| Motor         |   16     |  20   | OK        |
| Controller    |   16     |  16   | OK        |
| SHORT: [ Raise vendor PO ]                   |
|                    [ Submit requisition ]    |
+----------------------------------------------+
```
