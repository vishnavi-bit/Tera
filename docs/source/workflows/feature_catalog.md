# Tera EV OEM & Dealer Platform — Feature Catalogue

One entry per feature/screen, organized the same way as `docs/EV_App_Screens_Estimation.xlsx` (App → Module → ID), so the two documents cross-reference directly by ID (D##/O##/N##). For the connective, module-level narrative, see `docs/functional_brief.md`. For exact API fields and validation, see `docs/analysis/combined_spec_v2.md`.

**Legend**
- **Type / Mode:** see `docs/functional_brief.md` §2 or the Excel's Legend sheet for the Mode taxonomy (CRUD / C+R / RO / Mirror / Action / Component / Mock).
- **Status — Verified (reference app):** confirmed live on the Tera EV reference OEM/Dealer apps.
- **Status — New requirement:** from `new_features.md` / meeting notes, no reference-app equivalent.

---

## Dealer App

### Global

#### [D00] Header + Notifications Panel
**Type:** Component · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Deep-link notifications, mark all read, language switch.

**Connects to:** notification entity; R9 per-recipient scoping


### Auth

#### [D01] Login
**Type:** Form · **Path:** `/login` · **Mode:** Action · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** User ID (7-char alphanumeric) + password.

**Connects to:** Shared /auth/login with OEM

**Note:** Dealer app stores userId+plaintext password in localStorage for 'remember me' — do NOT replicate (spec §11 Fix list).


#### [D02] Forgot Password
**Type:** Static · **Path:** `/forgot-password` · **Mode:** — · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Static 'contact your OEM' message.


#### [D03] Shop Location Prompt
**Type:** Dialog · **Path:** `after login` · **Mode:** Update · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Lat/long/address, 'use my current location'.

**Connects to:** dealer_profile.shop (F3 allowed field)


### Dashboard

#### [D04] Dashboard
**Type:** Dashboard · **Path:** `/dashboard` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Aggregates: invoices, POs, service, warranty, follow-ups; period filter.

**Connects to:** R1 scoping


### Announcements

#### [D05] Announcements List
**Type:** List · **Path:** `/announcements` · **Mode:** Mirror · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Read-only mirror of OEM announcements targeted to this MU.

**Connects to:** R5; counterpart O15


#### [D06] Announcement View
**Type:** Detail · **Path:** `/announcements/:id` · **Mode:** Mirror · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Full view + download attachment.

**Connects to:** counterpart O16


### CRM / Enquiry

#### [D07] Sales Follow-ups (Enquiry List)
**Type:** List · **Path:** `/enquire/enquire-list` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Filter all/today/week/month/date.

**Connects to:** R1; counterpart O08 (OEM mirror)


#### [D08] Enquiry Add / Edit
**Type:** Form · **Path:** `/enquire/new` · **Mode:** CRUD · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Type (HOT/COLD/WARM), customer type, name, phone, WhatsApp, email, location, note, schedule. No vehicle-of-interest field — only captured via quotation (D12).

**Connects to:** R1


#### [D09] Enquiry Detail
**Type:** Detail · **Path:** `/enquire/:id` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Edit, delete, convert to customer (→ D16).

**Connects to:** R1


#### [D10] Enquiry Follow-up Log
**Type:** Detail + Dialog · **Path:** `/enquire/:id/follow-up` · **Mode:** CRUD · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Subject, note, called by, schedule; close/reopen.

**Connects to:** No OEM counterpart


#### [D11] Enquiry Quotations List
**Type:** List · **Path:** `/enquire/:id/quotation` · **Mode:** RO · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Open, create.

**Connects to:** No OEM counterpart


#### [D12] Enquiry Quotation Create
**Type:** Form + Dialog · **Path:** `/enquire/:id/quotation/new` · **Mode:** C+R · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Product picker (variant+colour required), GST toggle, discount per line, adjustment, T&C, attachments.

**Connects to:** F1 customer price; no OEM counterpart


### Service

#### [D13] Service Follow-ups List
**Type:** List · **Path:** `/enquire/service-follow-up` · **Mode:** RO · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Filter, search by name/phone/email.

**Connects to:** No OEM counterpart


#### [D14] Service Follow-up Detail
**Type:** Detail + Dialog · **Path:** `/enquire/:id/service-followup-detail` · **Mode:** C+R · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Add follow-up.

**Connects to:** No OEM counterpart


#### [D26] Service Price List
**Type:** List + Dialog · **Path:** `/inventory/service-price` · **Mode:** CRUD · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Service name, price.

**Connects to:** No OEM counterpart


#### [D40] Service List
**Type:** List · **Path:** `/service` · **Mode:** RO · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Status filter, open, create.

**Connects to:** R1; counterpart O07 (mirror)


#### [D41] Service Create (Job Card)
**Type:** Form · **Path:** `/customer/:id/service/new` · **Mode:** Create · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Product/chassis, meter reading, job type, free/paid, requirements, condition photos, notes.

**Connects to:** R1


#### [D42] Job Card + Complete Service
**Type:** Detail + Dialog · **Path:** `/customer/:id/service/:id` · **Mode:** Action · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Complete service (opens D20 SERVICE invoice), download/share/print.

**Connects to:** counterpart O07 service/:id


### CRM / Customer

#### [D15] Customers List
**Type:** List · **Path:** `/customer` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Search name/phone/email, create.

**Connects to:** R1; counterpart O07 (mirror)


#### [D16] Customer Add / Edit
**Type:** Form · **Path:** `/customer/new-customer` · **Mode:** CRUD · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Type, name, GST (business), phone/WhatsApp/work, billing+shipping address, PAN/Aadhaar/Licence (>=1 of 3 required with file upload).

**Connects to:** R1, F9 (PII unmasked on OEM side — gap)


#### [D17] Customer Hub: Personal Details
**Type:** Detail (6 tabs) · **Path:** `/customer/:id/personal-details` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Tab shell for personal/vehicle/invoice/payment/service/warranty.

**Connects to:** R1; counterpart O07


#### [D18] Customer Products
**Type:** List + Detail + Dialog · **Path:** `/customer/:id/vehicle-details` · **Mode:** RO + update · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Tabs per product type; search chassis; update registration number.

**Connects to:** R1; counterpart O07


### Sales / Invoice

#### [D19] Customer Invoices List
**Type:** List · **Path:** `/customer/:id/invoice` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Open, + new.

**Connects to:** R1; counterpart O07


#### [D20] Sale Invoice Create
**Type:** Form + Dialogs · **Path:** `/customer/:id/invoice/new` · **Mode:** C+R · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Header (dates, T&C EN+Marathi, attachments) + product picker (stock-checked) + payment link + serial capture (chassis/motor/battery[]/controller/charger + custom fields).

**Connects to:** R1, F1; THIS IS WHERE CHASSIS BINDS TO CUSTOMER; counterpart O48/O09/O29

**Note:** Resolves the 'item-to-vehicle identifier' requirement from meeting notes together with the new Production Completion & Handover screen.


#### [D21] Invoice View
**Type:** Detail (document) · **Path:** `/customer/:id/invoice/:id` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Print.

**Connects to:** counterpart O07 invoice-receipt


### Sales / Payments

#### [D22] Customer Payments List
**Type:** List · **Path:** `/customer/:id/payment` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Open receipt, + new.

**Connects to:** R1; counterpart O07


#### [D23] Customer Payment Create
**Type:** Form · **Path:** `/customer/:id/payment/new` · **Mode:** C+R · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Type (advance/invoice/refund), mode, amount, bank charges, txn ID, link invoice, internal notes.

**Connects to:** R1, F5


### Inventory

#### [D24] Inventory: Vehicle Models
**Type:** List · **Path:** `/inventory/vehicle-model` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Available/sold filter, search.

**Connects to:** R1; counterpart O10


#### [D25] Inventory: Parts
**Type:** List · **Path:** `/inventory/spare-parts` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Search, per product type tabs.

**Connects to:** R1; counterpart O10


#### [D27] Inventory Issues
**Type:** List + Dialog · **Path:** `/inventory/issues` · **Mode:** C+R · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** New issue (type, select spare, title, description, file).

**Connects to:** R1; counterpart O42


### Purchase

#### [D28] Purchases List
**Type:** List · **Path:** `/purchase/all` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** 12-status filter, search, new.

**Connects to:** R1/R2; counterpart O17/O12


#### [D29] Purchase Create (Cart)
**Type:** Wizard · **Path:** `/purchase/new` · **Mode:** C+R · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Choose seller (MU or higher-tier dealer), product+variant+colour picker with live stock check, cart qty, review & place. Order rule: total qty must be in {16,20,32,40}.

**Connects to:** R4, F1, F7; counterpart O20/O30


#### [D30] PO Detail (6 tabs)
**Type:** Detail · **Path:** `/purchase/vehicle/:id` · **Mode:** RO + Action · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Pay, confirm/accept delivery, reject shipment, report issue, print quotation/invoice/checklist.

**Connects to:** R1/R2, F2, F8; counterpart O20 (same tabs + OEM actions)


#### [D32] Shipment Confirm / Reject / Report Issue
**Type:** Dialog · **Path:** `(D30 dispatch tab)` · **Mode:** Action + Create · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Confirm delivery, reject with reason, report issue (also marks delivered).

**Connects to:** counterpart O22/O42


### Purchase / Payments

#### [D31] PO Payment Dialog
**Type:** Dialog · **Path:** `(in D30)` · **Mode:** Create · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Receipt upload (OCR autofills txn/amount/date, locked F4) or manual entry; apply ledger credit tab.

**Connects to:** F4; counterpart O45/O23


### Payments

#### [D33] Payment Ledger
**Type:** List · **Path:** `/purchase/payment-ledger` · **Mode:** RO · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** View only.

**Connects to:** R3; counterpart O46/O47/O14


#### [D34] Ledger Advance
**Type:** Action page · **Path:** `/purchase/ledger-advance` · **Mode:** Action · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Select approved orders, pay from ledger balance.

**Connects to:** R3; counterpart O47


#### [D45] Payments (2 tabs)
**Type:** List · **Path:** `/payments` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Search, status, date range, ledger history.

**Connects to:** R1/R3; counterpart O45/O47


#### [D46] Add Payment (Ledger Top-up)
**Type:** Dialog · **Path:** `(D45)` · **Mode:** Create · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Txn ID, amount, date, note — no proof upload (gap, spec §11).

**Connects to:** counterpart O45 (verify)


### Dealers (seller)

#### [D35] Received Orders / Seller Mgmt
**Type:** List · **Path:** `/purchase/received-orders` · **Mode:** RO · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** View connected buyer dealers.

**Connects to:** R2; counterpart O06


#### [D43] Dealers (Sub-dealers)
**Type:** List · **Path:** `/dealers` · **Mode:** RO · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Type filter, search.

**Connects to:** R2; counterpart O04 (owner)


#### [D44] Orders (as Seller)
**Type:** List + Detail · **Path:** `/orders` · **Mode:** Action · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Approve/reject, verify payment, quote, dispatch — same component family as OEM Orders.

**Connects to:** R2; reuses O17/O20/O22 patterns


### Issues

#### [D36] Issues List
**Type:** List · **Path:** `/issues` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Stage filter, search, open PO.

**Connects to:** R1, F8; counterpart O42


### Warranty

#### [D37] Warranty List
**Type:** List + Dialog · **Path:** `/warranty` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Search; new claim by selecting customer/chassis.

**Connects to:** R1; counterpart O43/O11


#### [D38] Warranty Claim Create
**Type:** Form · **Path:** `/customer/:id/warranty-claims/new` · **Mode:** Create · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Raised to OEM or dealer service team; select vehicle/spare/serial, issue, remarks, up to 10 images.

**Connects to:** R1; counterpart O44


#### [D39] Warranty Claim Detail
**Type:** Detail + Dialogs · **Path:** `/customer/:id/warranty-claims/:id` · **Mode:** RO + Action · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Mark in transit, pay service charge, confirm receipt, report post-receipt issue.

**Connects to:** R1, F8; counterpart O44


### Settings

#### [D47] Settings: Profile
**Type:** Detail + Dialogs · **Path:** `/settings/profile` · **Mode:** RO + limited update · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Org/bank/address fields read-only (F3); dealer may edit password, shop location, documents, photo.

**Connects to:** F3; counterpart O05 (owner)


#### [D48] Settings: Users
**Type:** List · **Path:** `/settings/users` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Search, create, edit dealer staff.

**Connects to:** R1


#### [D49] User Add / Edit
**Type:** Form · **Path:** `/settings/users/new` · **Mode:** CRUD · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Role (Sales Man/Service Man; edit adds Dealer), name, email, phone, password.

**Connects to:** R1, F10


### Reports

#### [D50] Reports
**Type:** Form · **Path:** `/reports` · **Mode:** Action · **Priority:** P2 · **Status:** Verified (reference app)

**What it does:** Dealer/report type/date range — fields largely unconfirmed, hard-coded sample names in reference app.

**Open question:** Scope of real Reports module not defined — confirm what reports are actually needed.


#### [D51] E-Way Bill (mock in reference app)
**Type:** Mock · **Path:** `/e-waybill` · **Mode:** Mock · **Priority:** P2 · **Status:** Verified (reference app)

**What it does:** Superseded — see new 'E-Way Bill (real build)' row; this was a non-functional stub in the reference app.

**Connects to:** Superseded by new feature row

**Note:** Not estimated separately — real E-Way Bill scope now carried by the dedicated feature row.


#### [D52] Delivery Challan (mock)
**Type:** Mock · **Path:** `/delivery-challan` · **Mode:** Mock · **Priority:** P2 · **Status:** Verified (reference app)

**What it does:** Static sample data only in reference app; not elaborated in new_features.md.

**Open question:** Confirm if Delivery Challan is actually needed for v1.


#### [D53] Legacy Dealers List (mock)
**Type:** Mock · **Path:** `/dealer` · **Mode:** Mock · **Priority:** P2 · **Status:** Verified (reference app)

**What it does:** Leftover legacy route; not a real screen.

**Note:** Ignore — leftover artifact in the reference app.


---

## OEM App

### Global

#### [O00] Header + Notifications Panel
**Type:** Component · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Deep-link notifications, mark all read.

**Connects to:** R9


### Auth

#### [O01] Login / Forgot Password
**Type:** Form / Static · **Path:** `/login` · **Mode:** Action · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Shared /auth/login with dealer app.


### Dashboard

#### [O03] Dashboard
**Type:** Dashboard · **Path:** `/dashboard` · **Mode:** RO + edit slogan · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** KPI tiles + widgets; period/state/unit filter; editable slogan.

**Connects to:** R6/R7


### Dealer Management

#### [O04] Dealers List + Map
**Type:** List + Map · **Path:** `/dealers` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Active/inactive, type/state/district filter, map, add, edit, unlock.

**Connects to:** R6/R7/R8


#### [O05] Add / Edit Dealer
**Type:** Form · **Path:** `/dealers/new` · **Mode:** CRUD · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Full onboarding: type, owner, firm, GST, region/zone, MU, password, billing+shipping address, shop location, bank details, logo.

**Connects to:** F3; creates dealer login


#### [O06] Dealer Detail (9 tabs)
**Type:** Detail · **Path:** `/dealers/:id/details` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Profile, connections, ledger top-ups tab shell.

**Connects to:** R6/R7


### Sales (mirror)

#### [O07] Dealer → Customers + Customer Mirror
**Type:** List + Detail (6 tabs) · **Path:** `/dealers/:id/customer-detail` · **Mode:** Mirror · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Read-only view of dealer-owned customer/invoice/payment/service/warranty data.

**Connects to:** R10, F9 (PII unmasked — gap); mirrors D15-D23, D40-D42


#### [O08] Dealer → Enquiries
**Type:** List · **Path:** `/dealers/:id/enquiry-list` · **Mode:** Mirror · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Read-only.

**Connects to:** R10; mirrors D07-D09


#### [O09] Dealer → Vehicle Sold
**Type:** List · **Path:** `/dealers/:id/vehicle-sold` · **Mode:** Mirror · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Read-only.

**Connects to:** R10; mirrors D20/D21


#### [O10] Dealer → Vehicle Stock + Add Stock
**Type:** List + Dialog · **Path:** `/dealers/:id/vehicle-stock` · **Mode:** RO + Create · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Type tabs; 'Add stock to dealer' (product type, product, qty) — OEM pushes stock without a PO.

**Connects to:** R10; mirrors D24/D25


#### [O11] Dealer → Warranty Claims
**Type:** List + Report · **Path:** `/dealers/:id/warranty-claim` · **Mode:** Mirror · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Period filter, claims-by-product chart.

**Connects to:** R10; mirrors D37


#### [O12] Dealer → Purchase Orders
**Type:** List · **Path:** `/dealers/:id/purchase-order` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Status/type filter.

**Connects to:** R6/R7; mirrors D28


#### [O13] Dealer → Pending Stock
**Type:** Report · **Path:** `/dealers/:id/pending-stock` · **Mode:** RO · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Approved minus dispatched.

**Connects to:** R6/R7; mirrors D30 'pending to dispatch'


#### [O14] Dealer → Payment History
**Type:** List · **Path:** `/dealers/:id/payment-history` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** PO credit balance, totals.

**Connects to:** R6/R7; mirrors D33/D45


### Announcements

#### [O15] Announcements List
**Type:** List · **Path:** `/announcements` · **Mode:** RO · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** New, open.

**Connects to:** Role not in permission map — confirm access

**Open question:** Which OEM roles can view/send announcements? Not in the 73-entry role map.


#### [O16] Announcement Create / Edit
**Type:** Form · **Path:** `/announcements/new` · **Mode:** CRUD · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Title, description, attachment (file/table), target (all/selected MU).

**Connects to:** mirrors D05/D06


### Orders

#### [O17] Orders List (+ sub-lists)
**Type:** List · **Path:** `/orders` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Type tabs, 7 status sub-lists, unit/date/status filter.

**Connects to:** R6/R7; mirrors D28


#### [O20] Order Detail (6 tabs)
**Type:** Detail · **Path:** `/orders/order-details/:type/:id` · **Mode:** Action · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Approve/reject, quotation, edit items, assign, dispatch shipment, verify/reject payment, info note, expected date, revert cancel — the hub that ties Orders/Payments/Inventory/Ledger/Issues together.

**Connects to:** R6/R7, F2; counterpart D30


#### [O21] Assign Item
**Type:** Dialog · **Path:** `/orders (dialog)` · **Mode:** Action · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Manufacturing unit, vehicle/variant/colour, notes. No chassis/serial entry at assignment — quantities only.

**Connects to:** R6

**Note:** No chassis binding happens here — ties to the item-identifier gap (spec §8/§11).


#### [O22] Dispatch Shipment
**Type:** Dialog · **Path:** `/orders (dialog)` · **Mode:** Create · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Dispatch from MU, per-line ship quantity, transport details.

**Connects to:** counterpart D32 (confirm/reject)


#### [O24] PO Reject / Info Note / Expected Date
**Type:** Dialog / inline · **Path:** `(O20)` · **Mode:** Action · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Rejection remarks, internal info note (F2, OEM-only), expected dispatch date, revert cancel.


### Orders / Production

#### [O18] Production (Day-wise)
**Type:** List + Action · **Path:** `/orders/production` · **Mode:** Action · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Pick date/unit, update produced count per PO.

**Connects to:** R6, F6


### Orders / Dispatch

#### [O19] Dispatch Plan (Batches)
**Type:** List + Action · **Path:** `/orders/dispatch-plan` · **Mode:** Action · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Combine paid POs into a dispatch batch, revert, print.

**Connects to:** R6, F6


### Orders / Payments

#### [O23] Payment Verify / Reject
**Type:** Action · **Path:** `(O20 / O45)` · **Mode:** Action · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Verify (surplus credited to ledger) or reject with reason.

**Connects to:** R6/R7; counterpart D31


### Products

#### [O25] Products List
**Type:** List · **Path:** `/products` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Status filter, add/edit/delete, 7 product-type tabs.

**Connects to:** ADM only


#### [O26] Product Create / Edit: Vehicle
**Type:** Form · **Path:** `/products/vehicle/new` · **Mode:** CRUD · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Model, type, motor/controller links, HSN/GST, colours, embedded variant details with 5-tier price matrix, tech specs, per-MU availability, purchase limit.

**Connects to:** F1 (5-tier pricing)


#### [O27] Product Create / Edit: Spare, Accessory
**Type:** Form · **Path:** `/products/spare/new` · **Mode:** CRUD · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Vehicle link, vendor/supplier, HSN/GST, dealer+customer price, images, specs, per-MU availability.


#### [O28] Product Create / Edit: Battery/Charger/Motor/Controller
**Type:** Form · **Path:** `/products/battery/new` · **Mode:** CRUD · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Shared template across 4 types; vendor link, HSN/GST, pricing, specs.


#### [O29] Product Detail + Dashboard
**Type:** Detail + Report · **Path:** `/products/vehicle-details/:id` · **Mode:** RO · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Per-model rollup: stock, sales, warranty, issues; stock-by-MU; price matrix.

**Connects to:** Rolls up Inventory/Orders/Sales/Warranty/Issues


### Inventory

#### [O30] Inventory (OEM Stock)
**Type:** List (9 tabs) · **Path:** `/inventory/stock` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Unit/stock filter, search, stock history, reserved stock tabs.

**Connects to:** R6, F6


#### [O31] Inventory List per Product
**Type:** List · **Path:** `/inventory/list/vehicles` · **Mode:** RO + add · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Status (available/locked/delivered/draft), unit filter, add stock link.

**Connects to:** R6


### Manufacturing Unit

#### [O32] Manufacturing Units List
**Type:** List · **Path:** `/manufacturing-unit` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** New, view.

**Connects to:** R6


#### [O33] MU Create / Edit
**Type:** Form · **Path:** `/manufacturing-unit/new` · **Mode:** CRUD · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Name, address, GST, bank details, phone, city, email, lat/long.

**Connects to:** counterpart D30 quotation letterhead


#### [O34] MU View
**Type:** Detail + Action · **Path:** `/manufacturing-unit/view/:id` · **Mode:** RO + Action · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Unit details, connect a dealer, right-hand nav to stock/dispatch-plan/load-plan/containers/production.

**Connects to:** R6


#### [O35] MU Stock
**Type:** Report + Dialogs · **Path:** `/inventory/mu-stock/:unitId` · **Mode:** RO + Create · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Daily stock register, in-transit shipments (add/receive), components needed, reduce stock. The only way stock enters the system.

**Connects to:** R6, F6


#### [O36] MU Dispatch Plan (ETA)
**Type:** Report (calendar) · **Path:** `/manufacturing-unit/dispatch-plan/:id` · **Mode:** RO · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Month calendar of dispatch/build/component-short markers.

**Connects to:** R6


#### [O37] Load Plan
**Type:** Report · **Path:** `/manufacturing-unit/load-plan/:id` · **Mode:** RO · **Priority:** P2 · **Status:** Verified (reference app)

**What it does:** Radius-based load consolidation, recompute.

**Connects to:** R6


#### [O38] Containers
**Type:** List + Dialog · **Path:** `/manufacturing-unit/containers` · **Mode:** CRUD · **Priority:** P2 · **Status:** Verified (reference app)

**What it does:** Name, scope (MU/OEM-wide), min/max load.


### Vendors

#### [O39] Vendors
**Type:** List + Dialog · **Path:** `/vendors` · **Mode:** CRUD · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Name, contact, phone, email, GST, address, active flag, notes.

**Connects to:** Role not keyed — confirm access

**Open question:** Which OEM roles can manage vendors? Not in the role map.


#### [O40] Vendor Procurement
**Type:** Form · **Path:** `/vendors/:id/procurement` · **Mode:** Create · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Needed-vs-in-stock from dispatch demand, order qty/rate input, create PO.

**Connects to:** Where vendor POs are actually raised


### Vendor POs

#### [O41] Vendor POs
**Type:** List + Dialog · **Path:** `/vendor-pos` · **Mode:** C+R + approval · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Create (choose vendor → O40), filter, view. Approval is by email to the OEM approval admin.

**Connects to:** Role not keyed — confirm access

**Open question:** Does the PO document itself get emailed to the vendor, or only the internal approval request?


### Issues

#### [O42] Issues
**Type:** List + Actions · **Path:** `/issues` · **Mode:** Action · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Stage tabs; manager approve/decline; OEM approve/decline; settle with money or replace → mark dispatched.

**Connects to:** F8; counterpart D36/D32


### Warranty

#### [O43] Warranty (Received)
**Type:** List · **Path:** `/warranty` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Status filter; raisedTo=oem queue.

**Connects to:** R6/R7


#### [O44] Warranty Claim Page
**Type:** Detail + Dialogs · **Path:** `/warranty/warranty-receipt/:id` · **Mode:** Action · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Verify/reject, inspection report, service-or-replacement (stock-checked), service charge request/edit/waive/verify, return logistics.

**Connects to:** counterpart D39


### Payments

#### [O45] Payments (All Dealers)
**Type:** List + Action · **Path:** `/payments` · **Mode:** Action · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Search, status, date range, view receipt, verify/reject.

**Connects to:** R6/R7; Role not keyed — confirm access; counterpart D31/D46


### Ledger

#### [O46] Ledgers
**Type:** List + Dialog · **Path:** `/ledgers` · **Mode:** CRUD · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** New ledger (name, note). Shared credit pool — multiple dealers draw from one balance.

**Connects to:** F6; Role not keyed — confirm access


#### [O47] Ledger Detail
**Type:** Detail + Dialogs · **Path:** `/ledgers/:id` · **Mode:** Action · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Edit, add credit/debit (with supporting doc), connect/remove dealer; full movement history.

**Connects to:** F6; counterpart D45 ledger history


### Reports

#### [O48] Vehicle Sold
**Type:** Report · **Path:** `/vehicle-sold` · **Mode:** Mirror · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Search, period filter.

**Connects to:** R6/R7; Role not keyed; mirrors D20


#### [O56] Reports / Warranty-claim / Challan / E-way bill (mocks)
**Type:** Static / Mock · **Path:** `/reports` · **Mode:** Mock · **Priority:** P2 · **Status:** Verified (reference app)

**What it does:** Non-functional stubs in the reference app.

**Connects to:** Superseded for E-Way Bill by new feature row

**Open question:** Confirm real scope for a Reports module beyond Vehicle Sold/Audit Logs.


### Settings

#### [O49] Settings: Profile
**Type:** Detail + Form · **Path:** `/settings/profile` · **Mode:** Update (ADM) · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Approval admin email (editable), GST toggle; org details read-only.


#### [O50] Settings: Operating States
**Type:** Form · **Path:** `/settings/operating-states` · **Mode:** CRUD · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Add/update state list.


#### [O51] Settings: Regions & Zones
**Type:** List + Form · **Path:** `/settings/regions` · **Mode:** CRUD · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Region name+head, zones (name+head, repeatable).

**Connects to:** R8 (region/zone scoping for SRH/SZH not fully confirmed — spec §12)

**Open question:** Is SRH/SZH access actually scoped by region/zone (R8), or only by Assigned Dealers (R7)? Needs a server-side test.


#### [O52] Settings: Users
**Type:** List · **Path:** `/settings/users` · **Mode:** RO · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** Search, create, edit, unlock account.

**Connects to:** ADM only


#### [O53] OEM User Add / Edit
**Type:** Form · **Path:** `/settings/users/new` · **Mode:** CRUD · **Priority:** P0 · **Status:** Verified (reference app)

**What it does:** 15 OEM roles, MU scope, Assigned Dealers (sales roles), device limit, sessions.

**Connects to:** R6/R7 (verbatim 'none ticked = sees no dealers' rule)


#### [O54] Settings: Audit Logs
**Type:** List · **Path:** `/settings/audit-logs` · **Mode:** RO · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** Feature/action/date filters, expandable field diff.

**Connects to:** See also new Purge/Export rows below


#### [O55] Settings: Security
**Type:** Detail + Form · **Path:** `/settings/security` · **Mode:** Action · **Priority:** P1 · **Status:** Verified (reference app)

**What it does:** My devices, logged-in accounts, default device limit, sign-out.


---

## New Features (not in the reference app)

### Vendors

#### [N01] GST Lookup / Auto-fetch from GST Portal
**Type:** Form enhancement · **Mode:** Enhancement · **Priority:** P1 · **Status:** New requirement

**What it does:** Entering a GSTIN auto-fills supplier/vendor (and dealer onboarding) details from the GST portal, instead of manual entry.

**Connects to:** Extends O39/O40 (Vendor) and O05 (Dealer onboarding)

**Open question:** Which GST-portal API/provider? Needs an external integration partner.


### Material Inward

#### [N02] Material Inward — Receiving & QC Check
**Type:** Form / Action · **Mode:** NEW · **Priority:** P0 · **Status:** New requirement

**What it does:** Inventory Executive role. Check received count against PO, report shortfall, QC-check each item (pass/fail), mark scrap. Substantially more granular than the reference app's flat 'Receive' step.

**Connects to:** Extends O35 MU Stock receiving; Material Inward entity is new


### Production

#### [N03] Material Requisition (Against Order / Forecast / Damage)
**Type:** Form · **Mode:** NEW · **Priority:** P0 · **Status:** New requirement

**What it does:** Production Head role requests materials from Inventory for: (1) an order, (2) a forecast, (3) loss/damage replacement.

**Connects to:** Depends on BOM (N08) to know required parts per model


#### [N04] Production Completion & Handover
**Type:** Form / Action · **Mode:** NEW · **Priority:** P0 · **Status:** New requirement

**What it does:** On completing production, capture finished-unit identifiers (chassis, motor, controller, battery) and hand the inventory over. Resolves the 'no screen binds a chassis to a vehicle' gap (spec §8/§11).

**Connects to:** Feeds Inventory (O30/O31) and QC (N05)


### QC

#### [N05] QC Inspection Checklist
**Type:** Form · **Mode:** NEW · **Priority:** P0 · **Status:** New requirement

**What it does:** Yes/No checklist per finished unit before release.

**Connects to:** Gated after Production Completion (N04)


#### [N06] QC Branding / Packaging Requisition
**Type:** Form / Action · **Mode:** NEW · **Priority:** P1 · **Status:** New requirement

**What it does:** QC requests branding/packaging materials from Inventory against a specific finished product; sourced from the BOM.

**Connects to:** Depends on BOM (N08) for branding/packaging line items


### Orders

#### [N07] Despatch — Chassis Validation Gate
**Type:** Action · **Mode:** Enhancement · **Priority:** P0 · **Status:** New requirement

**What it does:** Despatch starts from the invoice; validates the correct chassis number and all identifiers before assigning for dispatch.

**Connects to:** Extends O20/O21/O22; ties to the item-identifier gap


#### [N10] E-Way Bill (real build)
**Type:** Form · **Path:** `/e-waybill` · **Mode:** NEW · **Priority:** P1 · **Status:** New requirement

**What it does:** Full GST-compliant e-way bill generation, replacing the reference app's non-functional mock (D51/O56).

**Connects to:** Supersedes D51/O56


### Production / BOM

#### [N08] BOM Create / Edit
**Type:** Form · **Mode:** NEW · **Priority:** P0 · **Status:** New requirement

**What it does:** Bill of Materials per vehicle model: parts, quantities, images, landing price to OEM.

**Connects to:** Prerequisite for N03, N06, N09


#### [N09] BOM Versioning & Approval Workflow
**Type:** Form / Action · **Mode:** NEW · **Priority:** P1 · **Status:** New requirement

**What it does:** Version history for BOM changes with an approval gate before a new version takes effect.

**Connects to:** Depends on N08

**Open question:** Does every BOM change need versioning, or only material changes? Who is the approver — Production Head, QC, or OEM Admin?


### Dealer Management

#### [N11] RBAC — Dealer & Sub-dealer Role Assignment
**Type:** Form enhancement · **Mode:** Enhancement · **Priority:** P1 · **Status:** New requirement

**What it does:** Formalizes assigning roles to a dealer and its connected sub-dealers (distributor → sub-dealer hierarchy already exists via R2/dealer_connection; this makes role assignment explicit and manageable).

**Connects to:** Extends O05 (Add/Edit Dealer) and O53 (user roles); builds on R2/R7


### Warehouse

#### [N12] Warehouse Location Master
**Type:** Form / List · **Mode:** NEW · **Priority:** P1 · **Status:** New requirement

**What it does:** Define bin/rack/zone locations per manufacturing unit.

**Connects to:** Prerequisite for N13


#### [N13] FIFO Stock Issuance & Location Report
**Type:** Report / Action · **Mode:** NEW · **Priority:** P1 · **Status:** New requirement

**What it does:** Stock issued from the correct (oldest-first) location; current stock-by-location report. Touches core inventory issuance logic across O30/O31/O35.

**Connects to:** Depends on N12; significant change to existing Inventory issuance


### Products

#### [N14] Inventory Type Flag (Internal-use vs Saleable)
**Type:** Form enhancement · **Mode:** Enhancement · **Priority:** P1 · **Status:** New requirement

**What it does:** New field + filter logic: internal-use items are excluded from sales/dealer-facing inventory.

**Connects to:** Extends O25-O28 (Products) and O30/O31 (Inventory)

**Open question:** Terminology to be finalized — client flagged the current naming as a placeholder.


### Settings

#### [N15] Audit Log — Purge / Retention Policy
**Type:** Form / Action enhancement · **Mode:** Enhancement · **Priority:** P1 · **Status:** New requirement

**What it does:** Super-admin-only feature to purge audit log records beyond a configurable retention date.

**Connects to:** Extends O54


#### [N16] Audit Log — Customer Export / Download
**Type:** Action enhancement · **Mode:** Enhancement · **Priority:** P1 · **Status:** New requirement

**What it does:** Customer-facing export/download of their own audit trail.

**Connects to:** Extends O54


### Vendor POs

#### [N17] Auto-email PO to Vendor on Approval
**Type:** Action enhancement · **Mode:** Enhancement · **Priority:** P1 · **Status:** New requirement

**What it does:** Once a vendor PO is approved, automatically email it to the vendor/supplier.

**Connects to:** Extends O41; distinct from the existing internal approval-admin email

**Open question:** What happens if the PO is changed after approval and re-approved — does the vendor get a revised email automatically?


### Orders / Material Inward

#### [N18] Backdated Data Entry Support (PO, Material Inward)
**Type:** Enhancement · **Mode:** Enhancement · **Priority:** P1 · **Status:** New requirement

**What it does:** Allow historical-dated record creation on Purchase Orders and Material Inward, for migrating old/catch-up data.

**Connects to:** Extends O20/O17 and N02


### Communications

#### [N19] WhatsApp — Order / Delivery / Due Notifications (Dealer)
**Type:** Integration · **Mode:** NEW · **Priority:** P0 · **Status:** New requirement

**What it does:** Dealer gets a WhatsApp message when an order is accepted or delivered, and for outstanding dues.

**Connects to:** Confirmed in scope in the client quotation (TCO includes 20k WhatsApp credits)


#### [N20] WhatsApp — Employee Broadcast
**Type:** Integration · **Mode:** NEW · **Priority:** P1 · **Status:** New requirement

**What it does:** Send important operational info to employees via WhatsApp.

**Connects to:** Same WhatsApp integration as N19

