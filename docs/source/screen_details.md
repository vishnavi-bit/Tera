# Tera EV OEM & Dealer Platform — Screen Detail (Buttons, Fields, Business Logic)

Deeper than `docs/feature_catalog.md`: every button, every form field (label, underlying API field, type, required/optional, validation), and the business rule behind it, for each screen. Field tables and RLS/FLS rule text are transcribed directly from `docs/analysis/combined_spec_v2.md` §5/§6/§7/§2 — that remains the authoritative source if anything here looks abridged.

**Reading this:**
- **RLS/FLS codes** (R1–R10, F1–F10) are expanded inline under Business logic — no need to cross-reference the spec separately.
- Screens with no dedicated field table (plain lists, read-only mirrors, static pages) say so explicitly rather than being left blank.
- The **New Features** section (N##) covers requirements with no reference-app screen to transcribe from — their buttons/fields are marked **proposed, not yet speced**, since no UI exists yet to describe.

---

## Dealer App

### Global

#### [D00] Header + Notifications Panel
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `(global)` · **Type:** Component · **Mode:** RO · **Roles:** D S V

**Buttons / Actions:** open (deep-link, deletes), mark all read, Add New (no effect), language

**Fields:** No dedicated input form — this is a component screen. Display/column content: Deep-link notifications, mark all read, language switch.

**Business logic / rules:**
- **R9** — Notifications per recipient org (`/notifications/dealer` vs `/notifications/oem`)
- **Counterpart:** O00
- **Dependency note:** notification entity; R9 per-recipient scoping


### Auth

#### [D01] Login
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/login` · **Type:** Form · **Mode:** Action · **Roles:** public

**Buttons / Actions:** sign in, remember me, forgot link

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| User ID | userId | text | ✔ | alphanumeric, exactly 7 chars (placeholder "eg. D001") | dealer D000002; OEM OEM0001 |
| Password | password | password | ✔ | show / hide toggle | — |
| Remember me | rememberMe | checkbox | — | — | dealer app stores userId + **plaintext password** in localStorage; don't replicate |

**Business logic / rules:**
- **Counterpart:** O01 (same `/auth/login`)
- **Dependency note:** Shared /auth/login with OEM


#### [D02] Forgot Password
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/forgot-password` · **Type:** Static · **Mode:** — · **Roles:** public

**Buttons / Actions:** back to login ("contact your OEM")

**Fields:** No dedicated input form — this is a static screen. Display/column content: Static 'contact your OEM' message.

**Business logic / rules:**
- **Counterpart:** OEM resets via O05 / O53


#### [D03] Shop Location Prompt
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `after login` · **Type:** Dialog · **Mode:** Update · **Roles:** D

**Buttons / Actions:** save current location, not now

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Latitude | latitude | number | — | from browser geolocation ("Use my current location") | `PUT /accounts/me/shop-location` |
| Longitude | longitude | number | — | — | — |
| Address | address | text | — | optional | — |

**Business logic / rules:**
- **F3** — Dealer profile (org, GST, bank, addresses, MU, region / zone, type) is OEM-owned and read-only to dealer. Dealer may edit only password, shop location, photo and business documents.
- **Counterpart:** O05 shop location
- **Dependency note:** dealer_profile.shop (F3 allowed field)


### Dashboard

#### [D04] Dashboard
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/dashboard` · **Type:** Dashboard · **Mode:** RO · **Roles:** D S V

**Buttons / Actions:** period filter, drill links

**Fields:** No dedicated input form — this is a dashboard screen. Display/column content: Aggregates: invoices, POs, service, warranty, follow-ups; period filter.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O03 (all dealers), O06 header
- **Dependency note:** R1 scoping


### Announcements

#### [D05] Announcements List
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/announcements` · **Type:** List · **Mode:** Mirror · **Roles:** D S V

**Buttons / Actions:** view

**Fields:** No dedicated input form — this is a list screen. Display/column content: Read-only mirror of OEM announcements targeted to this MU.

**Business logic / rules:**
- **R5** — Dealer sees announcements targeted to **all MUs or its MU**
- **Counterpart:** O15
- **Dependency note:** R5; counterpart O15


#### [D06] Announcement View
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/announcements/:id` · **Type:** Detail · **Mode:** Mirror · **Roles:** D S V

**Buttons / Actions:** full screen, download

**Fields:** No dedicated input form — this is a detail screen. Display/column content: Full view + download attachment.

**Business logic / rules:**
- **R5** — Dealer sees announcements targeted to **all MUs or its MU**
- **Counterpart:** O16
- **Dependency note:** counterpart O16


### CRM / Enquiry

#### [D07] Sales Follow-ups (Enquiry List)
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/enquire/enquire-list` · **Type:** List · **Mode:** RO · **Roles:** D S

**Buttons / Actions:** filter (all / today / week / month / date), new

**Fields:** No dedicated input form — this is a list screen. Display/column content: Filter all/today/week/month/date.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O08 (mirror)
- **Dependency note:** R1; counterpart O08 (OEM mirror)


#### [D08] Enquiry Add / Edit
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/enquire/new, in-place edit` · **Type:** Form · **Mode:** CRUD · **Roles:** D S

**Buttons / Actions:** create, save, delete, convert to customer

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Enquiry Type | enquireType | radio | ✔ | HOT / COLD / WARM | — |
| Customer Type | customerType | radio | ✔ | business / individual_customer | — |
| Title | namePrefix | select | ✔ | Mr / Mrs / Miss / Dr | — |
| First Name | firstName | text | ✔ | "Please enter a First Name" | — |
| Last Name | lastName | text | ✔ | — | — |
| Mobile Number | phone | tel | ✔ | `^[0-9]{10}$` | no mobile-prefix check |
| WhatsApp | whatsappNumber | tel | — | 10 digits | — |
| Alternate Phone | alternatePhone | tel | — | 10 digits | — |
| Email | email | email | — | email format | — |
| Location | location | text | ✔ | — | — |
| Subject | subject | text | — | — | — |
| Note | note | textarea | ? | validator present in module [C] | — |
| Make Schedule For Call Back | makeSchedule | checkbox | — | reveals Schedule | — |
| Schedule | schedule | datetime | ✔ if checked | — | creates the next follow-up |
| (hidden) | followUpType, followUpDate | — | [C] | — | set by follow-up logic |

**No vehicle-of-interest field.** The model is captured only through a quotation (D12).

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O08 (read)
- **Dependency note:** R1


#### [D09] Enquiry Detail
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/enquire/:id` · **Type:** Detail · **Mode:** RO · **Roles:** D S

**Buttons / Actions:** edit, delete, convert to customer (→ D16 with enquireId)

**Fields:** No dedicated input form — this is a detail screen. Display/column content: Edit, delete, convert to customer (→ D16).

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O08
- **Dependency note:** R1


#### [D10] Enquiry Follow-up Log
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/enquire/:id/follow-up` · **Type:** Detail + Dialog · **Mode:** CRUD · **Roles:** D S

**Buttons / Actions:** add, edit, close, reopen

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Subject | subject | text | ? | — | — |
| Description | note | textarea | ? | — | — |
| Called by | scheduledBy | text / select | ? | — | — |
| Make Schedule For Call Back | makeSchedule | checkbox | — | — | — |
| Schedule | schedule | datetime | ✔ if checked | — | — |

Actions: Close Follow Up, Reopen Follow Up.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Dependency note:** No OEM counterpart


#### [D11] Enquiry Quotations List
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/enquire/:id/quotation` · **Type:** List · **Mode:** RO · **Roles:** D S

**Buttons / Actions:** open, create

**Fields:** No dedicated input form — this is a list screen. Display/column content: Open, create.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Dependency note:** No OEM counterpart


#### [D12] Enquiry Quotation Create
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/enquire/:id/quotation/new` · **Type:** Form + Dialog · **Mode:** C+R · **Roles:** D S

**Buttons / Actions:** add products (picker), create, attach

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Customer Name | name | text | ? | prefilled | — |
| Add GST | addGst | checkbox / toggle | — | — | — |
| Quotation Date | quotationDate | date | ? | — | — |
| Due / Expiry Date | expiryDate | date | ? | — | — |
| Items → Add Products dialog | items[] | picker | ✔ | search name / part code; **variant ✔ and colour ✔ for vehicles** ("Colour (dealer stock)"); "Select a colour for this panel spare" | — |
| per line: Rate / Quantity / Discount / Discount Amount / SGST / CGST / Total | items[].… | number / ro | — | discount % or ₹ | totals derived |
| Adjustment | adjustment | number | — | — | — |
| Terms & conditions | termsAndConditions | textarea | — | — | — |
| Attach File(s) to Estimate | attachments | file | — | — | `PUT …/quotations/:id/attachments` |

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **F1** — Each variant has 5 prices: Distributor, Divisional Distributor, District Dealer, Area Dealer, Customer. A dealer sees only **its tier** (on PO) and **Customer** (on sale). Spares and components have Dealer + Customer price.
- **Dependency note:** F1 customer price; no OEM counterpart


### Service

#### [D13] Service Follow-ups List
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/enquire/service-follow-up` · **Type:** List · **Mode:** RO · **Roles:** D S

**Buttons / Actions:** filter, search by name / phone / email

**Fields:** No dedicated input form — this is a list screen. Display/column content: Filter, search by name/phone/email.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Dependency note:** No OEM counterpart


#### [D14] Service Follow-up Detail
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/enquire/:id/service-followup-detail` · **Type:** Detail + Dialog · **Mode:** C+R · **Roles:** D S

**Buttons / Actions:** add follow-up

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Subject | subject | text | ? | "Enter subject" | — |
| Note | note | textarea | ? | "Enter note" | — |
| Next Follow-Up | schedule | datetime | ? | — | — |

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Dependency note:** No OEM counterpart


#### [D26] Service Price List
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/inventory/service-price` · **Type:** List + Dialog · **Mode:** CRUD · **Roles:** D S

**Buttons / Actions:** new, edit, delete

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Service Name | serviceName | text | ✔ | "Service Name is required" | — |
| Price | price | number | ✔ | "Price must be a number" | — |
| (ro) | createdBy, createdOn | ro | — | — | — |

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Dependency note:** No OEM counterpart


#### [D40] Service List
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/service; tab /customer/:id/service` · **Type:** List · **Mode:** RO · **Roles:** D V

**Buttons / Actions:** status filter, open, create

**Fields:** No dedicated input form — this is a list screen. Display/column content: Status filter, open, create.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O07 service (mirror)
- **Dependency note:** R1; counterpart O07 (mirror)


#### [D41] Service Create (Job Card)
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/customer/:id/service/new` · **Type:** Form · **Mode:** Create · **Roles:** D V

**Buttons / Actions:** create service

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Product type | productType | radio | ✔ | Vehicle / Warranty products | — |
| Select product | inventoryId | search | ✔ | "Search vehicle name or chasis no" | — |
| Chasis Number | chasisNo | ro | — | — | — |
| Type of service | — | ro | — | service number (auto) | — |
| Meter Reading | meterReading | text | ✔ | — | — |
| Job Type | job | select | ✔ | Maintenance / Repeated / Accident | — |
| Service Type | isFreeService | select | ✔ | Paid Service / Free Service | — |
| Customer Requirement | remark[] | text, repeatable | ✔ | "+ Add Remarks" | — |
| Vehicle Condition | productCondition[] | file, drag-drop | — | images | — |
| Customer Notes | customerNotes | textarea | ✔ | — | — |

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O07
- **Dependency note:** R1


#### [D42] Job Card + Complete Service
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/customer/:id/service/:id` · **Type:** Detail + Dialog · **Mode:** Action · **Roles:** D V

**Buttons / Actions:** complete service (→ D20 SERVICE invoice), download pdf, share, print

**Fields:**

| Label | API field | Type | Req | Notes |
|---|---|---|---|---|
| Mileage up to | — | number | ? | — |
| Job Type | — | select | ? | — |
| RSA / On Site | — | select / checkbox | ? | — |
| Service Type | — | select | ? | — |
| Customer Notes | — | textarea | ? | — |
| Requested Rectification | — | text, list | ? | — |
| Additional Work (+ Add More) | — | text, list | ? | — |
| Done | done | checkbox per line | — | — |

On success it opens D20 with `type=SERVICE`, priced from D26.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O07 service/:id
- **Dependency note:** counterpart O07 service/:id


### CRM / Customer

#### [D15] Customers List
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/customer` · **Type:** List · **Mode:** RO · **Roles:** D S V

**Buttons / Actions:** search (name / phone / email), create

**Fields:** No dedicated input form — this is a list screen. Display/column content: Search name/phone/email, create.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O07 (mirror)
- **Dependency note:** R1; counterpart O07 (mirror)


#### [D16] Customer Add / Edit
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/customer/new-customer, /customer/:id/edit` · **Type:** Form · **Mode:** CRUD · **Roles:** D S V

**Buttons / Actions:** create, save, delete (menu)

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Customer Type | customerType | radio | ✔ | individual_customer / business | business reveals GST |
| Title | namePrefix | select | ✔ | Mr / Miss / Mrs / Dr | — |
| First Name | firstName | text | ✔ | — | `name` composed "prefix first last" |
| Last Name | lastName | text | ✔ | — | — |
| Customer Email | email | text | — | email format | — |
| GST Number | gstNumber | text | — | business only | — |
| Mobile | phone | text | ✔ | `^[0-9]{10}$` | — |
| Work | workPhone | text | — | 10 digits | — |
| WhatsApp | whatsappNumber | text | — | 10 digits | — |
| Billing: Country | billingAddress.country | select | ✔ | India / Nepal | — |
| Billing: State | billingAddress.state | select | ✔ | 36 states / UTs (`GET /general/states`) | — |
| Billing: Address | billingAddress.address | textarea | ✔ | — | — |
| Billing: City | billingAddress.city | text | ✔ | — | — |
| Billing: Pincode | billingAddress.pincode | text | ✔ | `^[0-9]{6}$` | — |
| Shipping (same 5 fields) | shippingAddress.* | — | ✔ | "Copy Billing Address here" | — |
| PAN No + Upload Proof | documents[pan].documentNumber, file | text + file | ✔ **≥1 of 3** | file: PDF / image, drag-drop | "Please provide at least one document: PAN, Aadhar, or Licence" |
| Aadhar No + Upload Proof | documents[aadhar].… | text + file | ✔ ≥1 of 3 | `^\d{12}$` | — |
| Licence No + Upload Proof | documents[licence].… | text + file | ✔ ≥1 of 3 | alphanumeric | — |
| (hidden) | enquireId | number | — | set when converting from enquiry | — |

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **F9** — **Gap:** OEM sees customer PII (PAN / Aadhaar numbers, phone) unmasked
- **Counterpart:** O07 (read)
- **Dependency note:** R1, F9 (PII unmasked on OEM side — gap)


#### [D17] Customer Hub: Personal Details
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/customer/:id/personal-details` · **Type:** Detail (6 tabs) · **Mode:** RO · **Roles:** D S V

**Buttons / Actions:** edit, delete, switch tab

**Fields:** No dedicated input form — this is a detail (6 tabs) screen. Display/column content: Tab shell for personal/vehicle/invoice/payment/service/warranty.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O07 `/customers/:id/customer-personal-details`
- **Dependency note:** R1; counterpart O07


#### [D18] Customer Products
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/customer/:id/vehicle-details/**` · **Type:** List + Detail + Dialog · **Mode:** RO + update reg. no. · **Roles:** D S V

**Buttons / Actions:** tabs vehicle / motor / battery / charger / controller / spare & accessory; search chassis; update registration no.

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Registration Number | vehicleRegNumber | text | ✔ | alphabets + numbers only, max 13 | — |

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O07 customer-vehicle-details
- **Dependency note:** R1; counterpart O07


### Sales / Invoice

#### [D19] Customer Invoices List
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/customer/:id/invoice` · **Type:** List · **Mode:** RO · **Roles:** D S V

**Buttons / Actions:** open, + new

**Fields:** No dedicated input form — this is a list screen. Display/column content: Open, + new.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O07 customer-invoice
- **Dependency note:** R1; counterpart O07


#### [D20] Sale Invoice Create
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/customer/:id/invoice/new (also '?type=SERVICE&serviceId=')` · **Type:** Form + Dialogs · **Mode:** C+R · **Roles:** D S V

**Buttons / Actions:** product picker (stock-checked), add vehicle serials, add payment (link), create

**Fields:**

**Header:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Customer Name | name | text | ✔ | prefilled | — |
| Invoice Date | invoiceDate | date | ✔ | — | — |
| Due Date | dueDate | date | ✔ | — | — |
| (hidden) | invoiceType | — | ✔ | VEHICLE / SERVICE / … | SERVICE when opened from D42 with `serviceId` |
| Adjustment | adjustment | number | — | — | — |
| Terms & conditions | termsAndConditions | textarea | — | — | invoice prints EN + Marathi warranty T&C |
| Attachments | attachments | file | — | — | — |
| Payment Records → + Add Payment | payments[] | picker | — | lists **existing** customer payments to link | create payment first in D23 |

**+ Add Item: "Select Product" dialog:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Item type | itemType | radio | ✔ | Vehicle / Spare / Accessory / Motor / Battery / Controller / Charger | — |
| Search product | — | text | — | — | — |
| Product card → Add, qty ± | items[].productId, quantity | button / number | ✔ | shows colour, variant, net rate, GST %, incl. price | stock check: "Insufficient Stock! Vehicle: n, Battery: n, Charger: n", "This variant/colour combination is not available in stock" |

**Per line:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| HSN, Rate | HSN, rate | ro | — | from product | — |
| Discount | discount, discountType | number + toggle | — | % or ₹ | — |
| Discount Amount, SGST %/amt, CGST %/amt, Amount | — | ro | — | derived | — |

**Vehicle line → "Add Vehicle Detail" (serials):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Chassis No | itemDetails.chasisNumber | text | ✔ | free text; **server validates** against dealer stock ("Serial number error" summary) | **this is where chassis is bound to customer** |
| Motor No | motorNumber | text | ✔ | — | — |
| Battery No 1..n | batteryNumbers[] | text | ✔ | count = variant batteryQuantity | — |
| Controller No | controllerNumber | text | ✔ | — | — |
| Charger No | chargerNumber | text | ✔ | — | — |
| + Add Extra Field | customFields[{key, value}] | text pairs | — | defaults offered: Converter No, Colour, Product No, Part code | — |

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **F1** — Each variant has 5 prices: Distributor, Divisional Distributor, District Dealer, Area Dealer, Customer. A dealer sees only **its tier** (on PO) and **Customer** (on sale). Spares and components have Dealer + Customer price.
- **Counterpart:** O48 Vehicle Sold; O09; O29 "sold to customers"
- **Dependency note:** R1, F1; THIS IS WHERE CHASSIS BINDS TO CUSTOMER; counterpart O48/O09/O29


#### [D21] Invoice View
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/customer/:id/invoice/:id` · **Type:** Detail (document) · **Mode:** RO · **Roles:** D S V

**Buttons / Actions:** print

**Fields:** No dedicated input form — this is a detail (document) screen. Display/column content: Print.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O07 invoice-receipt
- **Dependency note:** counterpart O07 invoice-receipt


### Sales / Payments

#### [D22] Customer Payments List
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/customer/:id/payment` · **Type:** List · **Mode:** RO · **Roles:** D S V

**Buttons / Actions:** open receipt, + new

**Fields:** No dedicated input form — this is a list screen. Display/column content: Open receipt, + new.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O07 customer-payment
- **Dependency note:** R1; counterpart O07


#### [D23] Customer Payment Create
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/customer/:id/payment/new` · **Type:** Form · **Mode:** C+R · **Roles:** D S V

**Buttons / Actions:** link invoice, create

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Payment Type | paymentType | select | ✔ | Advance / Invoice / Refund | Invoice reveals "+ Link invoice" |
| Customer Name | customerName | text | ✔ | prefilled | — |
| Payment Date | paymentDate | date | ✔ | — | — |
| Payment Mode | paymentMode | select | ✔ | Cash / Card / Upi / Cheque / Net Banking | enum also has LEDGER (PO use) |
| Amount | amount | text (number) | ✔ | — | — |
| Bank Charges (%) | bankCharges | text (number) | ✔ | — | summary shows received / charges / total |
| Transaction ID | transactionId | text | ✔ | — | required even for cash |
| + Link invoice | invoiceIds[] | picker | ✔ if type = Invoice | — | — |
| Refund link | refund ref | picker | ✔ if type = Refund [C] | — | — |
| Notes | notes | textarea | — | "Internal use. Not visible to customer" (F5) | — |
| Attachments | — | file | — | `PUT …/payments/:id/attachments` [C] | — |

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **F5** — Customer-payment Notes are "internal use, not visible to customer"; not printed
- **Counterpart:** O07 (read)
- **Dependency note:** R1, F5


### Inventory

#### [D24] Inventory: Vehicle Models
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/inventory/vehicle-model → /inventory/vehicle/:id` · **Type:** List · **Mode:** RO · **Roles:** D S

**Buttons / Actions:** available / sold filter, search

**Fields:** No dedicated input form — this is a list screen. Display/column content: Available/sold filter, search.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O10 (+ manual add)
- **Dependency note:** R1; counterpart O10


#### [D25] Inventory: Parts
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/inventory/{spare-parts, accessory, battery, charger, motor, controller}` · **Type:** List · **Mode:** RO · **Roles:** D S

**Buttons / Actions:** search

**Fields:** No dedicated input form — this is a list screen. Display/column content: Search, per product type tabs.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O10
- **Dependency note:** R1; counterpart O10


#### [D27] Inventory Issues
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/inventory/issues` · **Type:** List + Dialog · **Mode:** C+R · **Roles:** D S

**Buttons / Actions:** new issue

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Type | type | radio | ? | Spare / Accessory | — |
| Select Spare | — | select | ? | Motor / Battery / Controller / Accessories | — |
| Title | title | text | ? | — | — |
| Description | description | textarea | ? | — | — |
| File | — | file | — | preview | — |

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O42
- **Dependency note:** R1; counterpart O42


### Purchase

#### [D28] Purchases List
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/purchase/{all, vehicle, warranty, spares-accessories}` · **Type:** List · **Mode:** RO · **Roles:** D

**Buttons / Actions:** filter (12 statuses), search, new

**Fields:** No dedicated input form — this is a list screen. Display/column content: 12-status filter, search, new.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **R2** — Distributor also sees POs where it is **seller** (`sellerDealerId` = own) and its connected buyer dealers
- **Counterpart:** O17 / O12
- **Dependency note:** R1/R2; counterpart O17/O12


#### [D29] Purchase Create (Cart)
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/purchase/new → /purchase/new/{vehicle, warranty, spares-accessories}; edit /purchase/edit-order/:poId` · **Type:** Wizard · **Mode:** C+R (edit while editable) · **Roles:** D

**Buttons / Actions:** choose source, add to cart, qty ±, clear, review & place

**Fields:**

| Step / label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Purchase From (sheet) | sellerDealerId | radio | ✔ | Manufacturing Unit (= OEM, null) / higher-tier dealer (`/purchase-order/available-sellers`) | — |
| Payee banner | — | ro | — | MU name, A/C no, IFSC | — |
| Search | — | text | — | — | — |
| Product card: variant chip | items[].variantId | chip | ✔ | e.g. WBC / 60V43AH | shows "N in stock" (F7) |
| Product card: colour chip | items[].colour | chip | ✔ | "Please select a colour for this item"; "No stock for this colour" | — |
| ADD / Add to Cart | items[] | button | — | stock check vs OEM / seller / per-colour frame stock | — |
| Cart: quantity ± / ✕ / Clear | items[].quantity | number | ✔ | ≥ 1; ≤ available | — |
| Cart totals | — | ro | — | product count, total qty, grand total | — |
| **Order rule** | — | — | ✔ | total qty ∈ **{16, 20, 32, 40}**; non-vehicle orders need a minimum total price | — |
| Review & Place Order dialog | — | confirm | — | line items + totals | — |
| (derived) | POType | — | ✔ | vehicle / spare_accessory / warranty_products, from cart mix | — |
| (fixed) | shipmentMode | — | — | "full" | — |

**Business logic / rules:**
- **R4** — Dealer catalogue shows only products **active for its MU**; "Purchase limit" shows selected dealer types only a share of stock
- **F1** — Each variant has 5 prices: Distributor, Divisional Distributor, District Dealer, Area Dealer, Customer. A dealer sees only **its tier** (on PO) and **Customer** (on sale). Spares and components have Dealer + Customer price.
- **F7** — Dealer sees OEM stock only as "N in stock" (availability check), reduced if Purchase limit applies
- **Counterpart:** O20 order detail; O30 reserved stock; O18 / O19
- **Dependency note:** R4, F1, F7; counterpart O20/O30


#### [D30] PO Detail (6 tabs)
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/purchase/{vehicle, spare, accessory, warranty}/:id` · **Type:** Detail · **Mode:** RO + Action · **Roles:** D

**Buttons / Actions:** pay, confirm / accept delivery, reject shipment, report issue, print / share quotation & invoice, print checklist

**Fields:** No dedicated input form — this is a detail screen. Display/column content: Pay, confirm/accept delivery, reject shipment, report issue, print quotation/invoice/checklist.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **R2** — Distributor also sees POs where it is **seller** (`sellerDealerId` = own) and its connected buyer dealers
- **F2** — OEM "PO info note" is internal: "only OEM staff see this"
- **F8** — Issue review notes and OEM approval steps are shown to dealer only as **stage + outcome**
- **Counterpart:** **O20** (same tabs + OEM actions)
- **Dependency note:** R1/R2, F2, F8; counterpart O20 (same tabs + OEM actions)


#### [D32] Shipment Confirm / Reject / Report Issue
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `(D30 dispatch tab)` · **Type:** Dialog · **Mode:** Action + Create · **Roles:** D

**Buttons / Actions:** confirm delivery, reject (reason), report issue (submit & confirm)

**Fields:**

**Report issue** → `POST /purchase-order/:id/issues`:

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Product | POItemId, productId, productType | select | ✔ | shipment lines incl. "Battery ·" and "Charger ·" lines | — |
| Serial / Chassis No | serial | text | — | — | — |
| What is the issue? | description | textarea | ✔ | "Describe the issue before submitting" | — |
| Photos or videos | media[] | file (image / *, video / *), multiple | — | — | — |

Button "Submit & confirm" logs the issue **and** marks the shipment delivered.

**Reject shipment** → `PUT /purchase-order/shipments/:id/reject`:

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Reason | reason | textarea | ✔ | "Rejection reason is required" | re-opens for re-dispatch |

**Confirm delivery:** `PUT /purchase-order/shipments/:id/deliver`, no fields.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O22, O42
- **Dependency note:** counterpart O22/O42


### Purchase / Payments

#### [D31] PO Payment Dialog
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `(in D30)` · **Type:** Dialog · **Mode:** Create · **Roles:** D

**Buttons / Actions:** upload receipt (OCR), manual entry, apply ledger, submit

**Fields:**

**Tab "Receipt":**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Upload payment receipt | file → `/payments/scan` | file (image) | ✔ unless manual | OCR reads txn ID, amount, date | usage quota `/payments/scan/usage` |
| Transaction ID (read) | transactionId | ro | ✔ | **locked** (F4) | — |
| Amount (read) | receivedAmount | ro | ✔ | locked | — |
| Payment date (read) | date | ro | — | locked | — |
| "Enter details manually" → Transaction ID | transactionId | text | ✔ | "Enter both the transaction ID and the amount" | note auto-suffixed "[Entered manually — receipt could not be read]" |
| Amount paid (₹) | receivedAmount | number | ✔ | — | — |
| Use for this order (₹) | amount | number | ✔ | ≤ due; surplus → ledger after verification | — |
| Note | note | text | — | "(optional)" | — |
| (hidden) | atachment | url | — | scanned receipt URL | — |

**Tab "Ledger":**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Amount to apply (₹) | poCreditApplied | number | ✔ | ≤ ledger balance | `amount: 0` |
| Note | note | text | — | — | — |

**Business logic / rules:**
- **F4** — PO-payment values read by receipt OCR (txn ID, amount, date) are locked: "cannot be edited"
- **Counterpart:** O45, O23
- **Dependency note:** F4; counterpart O45/O23


### Payments

#### [D33] Payment Ledger
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/purchase/payment-ledger` · **Type:** List · **Mode:** RO · **Roles:** D

**Buttons / Actions:** —

**Fields:** No dedicated input form — this is a list screen. Display/column content: View only.

**Business logic / rules:**
- **R3** — Dealer sees balance only of ledger(s) it is **attached to**; a ledger can be shared by several dealers
- **Counterpart:** O46 / O47, O14
- **Dependency note:** R3; counterpart O46/O47/O14


#### [D34] Ledger Advance
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/purchase/ledger-advance` · **Type:** Action page · **Mode:** Action · **Roles:** D

**Buttons / Actions:** select approved orders, pay from ledger

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Approved orders awaiting advance | orderIds[] | checkbox list | ✔ | — | shows ledger balance, selected advance, balance after |

**Business logic / rules:**
- **R3** — Dealer sees balance only of ledger(s) it is **attached to**; a ledger can be shared by several dealers
- **Counterpart:** O47
- **Dependency note:** R3; counterpart O47


#### [D45] Payments (2 tabs)
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/payments` · **Type:** List (2 tabs) · **Mode:** RO · **Roles:** D

**Buttons / Actions:** search, status, date range, add payment, ledger history

**Fields:** No dedicated input form — this is a list (2 tabs) screen. Display/column content: Search, status, date range, ledger history.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **R3** — Dealer sees balance only of ledger(s) it is **attached to**; a ledger can be shared by several dealers
- **Counterpart:** O45, O47
- **Dependency note:** R1/R3; counterpart O45/O47


#### [D46] Add Payment (Ledger Top-up)
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `(D45)` · **Type:** Dialog · **Mode:** Create · **Roles:** D

**Buttons / Actions:** submit for verification

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Transaction ID | transactionId | text | ✔ | "Exactly as it appears on your bank record" | **no proof upload** |
| Amount (₹) | amount | number | ✔ | — | — |
| Payment Date | date | date | ✔ | — | — |
| Note | note | text | — | "Optional" | — |

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O45 (verify)
- **Dependency note:** counterpart O45 (verify)


### Dealers (seller)

#### [D35] Received Orders / Seller Mgmt
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/purchase/received-orders, /purchase/seller-management` · **Type:** List · **Mode:** RO · **Roles:** D

**Buttons / Actions:** —

**Fields:** No dedicated input form — this is a list screen. Display/column content: View connected buyer dealers.

**Business logic / rules:**
- **R2** — Distributor also sees POs where it is **seller** (`sellerDealerId` = own) and its connected buyer dealers
- **Counterpart:** O06 connections
- **Dependency note:** R2; counterpart O06


#### [D43] Dealers (Sub-dealers)
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/dealers` · **Type:** List · **Mode:** RO · **Roles:** D

**Buttons / Actions:** type filter, search

**Fields:** No dedicated input form — this is a list screen. Display/column content: Type filter, search.

**Business logic / rules:**
- **R2** — Distributor also sees POs where it is **seller** (`sellerDealerId` = own) and its connected buyer dealers
- **Counterpart:** O04 (owner)
- **Dependency note:** R2; counterpart O04 (owner)


#### [D44] Orders (as Seller)
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/orders (detail compiled)` · **Type:** List + Detail · **Mode:** Action · **Roles:** D

**Buttons / Actions:** approve / reject, verify payment, quote, dispatch

**Fields:** No dedicated input form — this is a list + detail screen. Display/column content: Approve/reject, verify payment, quote, dispatch — same component family as OEM Orders.

**Business logic / rules:**
- **R2** — Distributor also sees POs where it is **seller** (`sellerDealerId` = own) and its connected buyer dealers
- **Counterpart:** **same components as O17 / O20 / O22**
- **Dependency note:** R2; reuses O17/O20/O22 patterns


### Issues

#### [D36] Issues List
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/issues` · **Type:** List · **Mode:** RO · **Roles:** D

**Buttons / Actions:** stage filter, search, open PO

**Fields:** No dedicated input form — this is a list screen. Display/column content: Stage filter, search, open PO.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **F8** — Issue review notes and OEM approval steps are shown to dealer only as **stage + outcome**
- **Counterpart:** O42
- **Dependency note:** R1, F8; counterpart O42


### Warranty

#### [D37] Warranty List
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/warranty; tab /customer/:id/warranty-claims` · **Type:** List + Dialog · **Mode:** RO · **Roles:** D V

**Buttons / Actions:** search; + → select customer by chassis

**Fields:** No dedicated input form — this is a list + dialog screen. Display/column content: Search; new claim by selecting customer/chassis.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O43, O11
- **Dependency note:** R1; counterpart O43/O11


#### [D38] Warranty Claim Create
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/customer/:id/warranty-claims/new` · **Type:** Form · **Mode:** Create · **Roles:** D V

**Buttons / Actions:** claim warranty

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Raised to | raisedTo | radio | ✔ | OEM / Dealer (service team) | dealer path = dealer runs the workflow |
| Product type | productType | radio | ✔ | Vehicle / Warranty products | — |
| Customer Name | customerName | ro | — | — | — |
| Select Vehicle | vehicleChasisNo → inventoryId, chasisNumber, vehicleId, variantId | select | ✔ | customer's **paid** invoices: "model (variant) · chassis · colour" | — |
| Chassis, Variant, Colour, Motor no, Controller no, Charger no, Battery no(s) | — | ro | — | from invoice serials | — |
| Select Spare | selectedVehicleSpare → itemDetails.spareType | select | ✔ | Battery / Controller / Motor / Charger | — |
| Select serial number(s) | spareSerialSelector → itemDetails.itemNo | checkbox list | ✔ | serials already on an active claim are locked | "No serial number found on the invoice…" |
| Issue | issue | select | ✔ | Not Working / Run Very slow / Other | — |
| Still Warranty | itemDetails.warenty | ro date | ✔ | computed end date | — |
| Remarks | remarks | textarea | ✔ | — | — |
| Claim images | warrantyImages[] | file image / * | — | ≤ 10 files, ≤ 5 MB each; images only | — |
| Warranty-products mode: search | productId, partCode | search | ✔ | name, part code, type, invoice # | — |

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Counterpart:** O44
- **Dependency note:** R1; counterpart O44


#### [D39] Warranty Claim Detail
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/customer/:id/warranty-claims/:id` · **Type:** Detail + Dialogs · **Mode:** RO + Action · **Roles:** D V

**Buttons / Actions:** mark in transit, pay service charge, confirm receipt, report post-receipt issue, print receipt

**Fields:**

| Action | Fields | Req | Validation |
|---|---|---|---|
| Mark in transit (`PUT …/status/inTransit`) | company, contactNumber, trackingId | ✔ ✔ ✔ | contact = 10 digits, no letters |
| Pay service charge (`POST /warranty/oem/:id/cost/payment`) | amount, transactionId, proof file [I] | ✔ | — |
| Confirm received | — | — | sets dealer_received |
| Report post-receipt issue (`POST /warranty/oem/:id/issue`) | description, media [I] | ✔ | — |

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **F8** — Issue review notes and OEM approval steps are shown to dealer only as **stage + outcome**
- **Counterpart:** **O44**
- **Dependency note:** R1, F8; counterpart O44


### Settings

#### [D47] Settings: Profile
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/settings/profile` · **Type:** Detail + Dialogs · **Mode:** RO + limited update · **Roles:** D S V

**Buttons / Actions:** change password, shop location save, upload documents, profile photo

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Latitude | latitude | number | — | from browser geolocation ("Use my current location") | `PUT /accounts/me/shop-location` |
| Longitude | longitude | number | — | — | — |
| Address | address | text | — | optional | — |

| Section / label | API field | Type | Req | Notes |
|---|---|---|---|---|
| All org / address / bank / login fields | dealer_profile.* | ro | — | F3: "contact OEM Admin" |
| Change password | password, confirmPassword | password | ✔ ✔ | must match; `PUT /accounts/users/:id/password` |
| Shop location | latitude, longitude, address | number / text | — | "Use my current location" |
| Documents: GST Certificate, PAN Card, Aadhaar, Dealership Agreement | attachments | file (PDF / image) | — | `PUT /accounts/dealers/:id/attachments` |
| Profile photo | — | file | — | `app-profile-upload` |

**Business logic / rules:**
- **F3** — Dealer profile (org, GST, bank, addresses, MU, region / zone, type) is OEM-owned and read-only to dealer. Dealer may edit only password, shop location, photo and business documents.
- **Counterpart:** O05 (owner)
- **Dependency note:** F3; counterpart O05 (owner)


#### [D48] Settings: Users
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/settings/users` · **Type:** List · **Mode:** RO · **Roles:** D

**Buttons / Actions:** search, create, edit

**Fields:** No dedicated input form — this is a list screen. Display/column content: Search, create, edit dealer staff.

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **Dependency note:** R1


#### [D49] User Add / Edit
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/settings/users/new, /settings/users/edit/:id` · **Type:** Form · **Mode:** CRUD · **Roles:** D

**Buttons / Actions:** submit, change password

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| User Role | role | select | ✔ | add: Sales Man / Service Man; **edit adds Dealer** | — |
| First Name | firstName | text | ✔ | — | — |
| Last Name | lastName | text | ✔ | — | — |
| Email ID | email | email | ✔ | — | — |
| Contact | phone | text | ✔ | — | — |
| Password | password | password | ✔ (add) | — | — |
| Confirm Password | confirmPassword | password | ✔ (add) | must match | — |
| Status (edit) | isActive | select | ✔ | Active / InActive | — |
| Change Password (edit) | — | button | — | — | — |

**Business logic / rules:**
- **R1** — Dealer user sees only rows with `dealerProfileID` = own dealer
- **F10** — Dealer staff edit form exposes a "Dealer" role option that the add form doesn't. Owner role is assignable only on edit.
- **Dependency note:** R1, F10


### Reports

#### [D50] Reports
**Priority:** P2 · **Status:** Verified (reference app)

**Path:** `/reports (URL only)` · **Type:** Form · **Mode:** Action · **Roles:** D S V

**Buttons / Actions:** download

**Fields:**

| Label | API field | Type | Req | Options |
|---|---|---|---|---|
| Select Dealer | dealerName | select | ? | hard-coded sample names |
| Report Type | reportType | select | ? | Purchase Orders / Warranty Claim |
| From Date / To Date | fromDate, toDate | date | ? | — |

---

## 7. Field specifications: OEM app

**Business logic / rules:**
- **Counterpart:** O56 (in progress)


#### [D51] E-Way Bill (mock in reference app)
**Priority:** P2 · **Status:** Verified (reference app)

**Path:** `/e-waybill, /new-e-waybill` · **Type:** Mock · **Mode:** Mock · **Roles:** D

**Buttons / Actions:** —

**Fields:** No dedicated input form — this is a mock screen. Display/column content: Superseded — see new 'E-Way Bill (real build)' row; this was a non-functional stub in the reference app.

**Business logic / rules:**
- **Counterpart:** O56 mock
- **Dependency note:** Superseded by new feature row


#### [D52] Delivery Challan (mock)
**Priority:** P2 · **Status:** Verified (reference app)

**Path:** `/delivery-challan, /new-delivery-challan` · **Type:** Mock · **Mode:** Mock · **Roles:** D

**Buttons / Actions:** —

**Fields:** No dedicated input form — this is a mock screen. Display/column content: Static sample data only in reference app; not elaborated in new_features.md.

**Business logic / rules:**
- **Counterpart:** O56 mock


#### [D53] Legacy Dealers List (mock)
**Priority:** P2 · **Status:** Verified (reference app)

**Path:** `/dealer` · **Type:** Mock · **Mode:** Mock · **Roles:** D

**Buttons / Actions:** —

**Fields:** No dedicated input form — this is a mock screen. Display/column content: Leftover legacy route; not a real screen.


---

## OEM App

### Global

#### [O00] Header + Notifications Panel
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `(global)` · **Type:** Component · **Mode:** RO · **Roles:** all

**Buttons / Actions:** open (deep-link), mark all read

**Fields:** No dedicated input form — this is a component screen. Display/column content: Deep-link notifications, mark all read.

**Business logic / rules:**
- **R9** — Notifications per recipient org (`/notifications/dealer` vs `/notifications/oem`)
- **Counterpart:** D00
- **Dependency note:** R9


### Auth

#### [O01] Login / Forgot Password
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/login, /forgot-password` · **Type:** Form / Static · **Mode:** Action · **Roles:** public

**Buttons / Actions:** sign in

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| User ID | userId | text | ✔ | alphanumeric, exactly 7 chars (placeholder "eg. D001") | dealer D000002; OEM OEM0001 |
| Password | password | password | ✔ | show / hide toggle | — |
| Remember me | rememberMe | checkbox | — | — | dealer app stores userId + **plaintext password** in localStorage; don't replicate |

**Business logic / rules:**
- **Counterpart:** D01


### Dashboard

#### [O03] Dashboard
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/dashboard ('?unit=')` · **Type:** Dashboard · **Mode:** RO + edit slogan · **Roles:** all but PH, PM

**Buttons / Actions:** period, state, unit filter, edit slogan

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Period | period / dateRange | select | — | This Day / This Month / This Year / Custom Date | — |
| State | state | select | — | All States + operating states | — |
| Unit | unit | select | — | All units / each MU | — |
| Edit (slogan) | dashboardSlogan | text | — | — | `PATCH /accounts/oem/dashboard-slogan` |

**KPIs:** no. of dealers, vehicles sold, vehicle stock, pending orders, PO by model, vehicle sales, warranty, top warranty dealers, top selling vehicle, top dealers by purchases.

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **R7** — OEM sales user sees **only dealers ticked in "Assigned Dealers"** (their POs, payments, details); none ticked = no dealers
- **Counterpart:** D04
- **Dependency note:** R6/R7


### Dealer Management

#### [O04] Dealers List + Map
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/dealers` · **Type:** List + map · **Mode:** RO · **Roles:** see DEALERS_LIST

**Buttons / Actions:** active / inactive, type / state / district filter, map, add, edit, unlock

**Fields:** No dedicated input form — this is a list + map screen. Display/column content: Active/inactive, type/state/district filter, map, add, edit, unlock.

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **R7** — OEM sales user sees **only dealers ticked in "Assigned Dealers"** (their POs, payments, details); none ticked = no dealers
- **R8** — Region / zone heads attached to regions / zones; dealers carry `regionId` / `zoneId`, so likely scoping for SRH / SZH
- **Counterpart:** D43 (seller view), D47
- **Dependency note:** R6/R7/R8


#### [O05] Add / Edit Dealer
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/dealers/new, /dealers/:id/edit` · **Type:** Form · **Mode:** CRUD · **Roles:** ADM

**Buttons / Actions:** create new dealer, save

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| User Type | dealerType | radio | ✔ | Distributor / Divisional Distributor / District Dealer / Area Dealer | sets price tier (F1) and seller |
| Owner Name: title | namePrefix | select | ✔ | Mr. / Miss. / Mrs. | — |
| Owner first / last name | firstName, lastName | text | ✔ | — | — |
| Firm Name | orgName | text | ✔ | — | — |
| GST No | gstNo | text | ✔ | — | — |
| Org Email ID | orgEmail | text | ✔ | — | — |
| Org Contact | contact | text | ✔ | — | — |
| Joining Date | joiningDate | date | ✔ | — | — |
| State | state | select | — | operating states | drives District |
| District | district | select | — | "Select a state first" | — |
| Area | area | text | — | — | — |
| Select Region | regionId | select | ✔ | regions (O51) | — |
| Select Zone | zoneId | select | ✔ | zones of region | — |
| Manufacturing Unit | manufacturingUnitId | select | — | None / MU list | dealer's seller and letterhead |
| Password | password | password | ✔ | — | creates dealer login (D00000n auto) |
| Organization Logo | logo | file image / * | — | 240×240 px, ≤ 1 MB | shown on PDFs / emails |
| Billing: Country, State, Address, City, Pincode | billingAddress.* | select / text | ✔ all | — | — |
| Shipping: same (+ Copy Billing) | shippingAddress.* | — | ✔ all | — | — |
| Shop Location: Latitude, Longitude, Address | latitude, longitude, address | number / textarea | — | — | — |
| Bank: Account Type | bankDetails.accountType | radio | ✔ | Current / Saving | — |
| Beneficiary Name | bankDetails.beneficiaryName | text | ✔ | — | — |
| Bank Name | bankDetails.bankName | text | ✔ | — | — |
| Account Number | bankDetails.accountNumber | text | ✔ | — | — |
| Re-enter Account Number | bankDetails.confirmAccount | text | ✔ | must match | — |
| IFSC | bankDetails.IFSC | text | ✔ | — | — |

**Dealer list row actions:** Edit, Unlock Account (suspended).

**Business logic / rules:**
- **F3** — Dealer profile (org, GST, bank, addresses, MU, region / zone, type) is OEM-owned and read-only to dealer. Dealer may edit only password, shop location, photo and business documents.
- **Counterpart:** D47 (read-only)
- **Dependency note:** F3; creates dealer login


#### [O06] Dealer Detail (9 tabs)
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/dealers/:id/details` · **Type:** Detail (9 tabs) · **Mode:** RO · **Roles:** see DEALER_DETAILS

**Buttons / Actions:** edit, switch tab

**Fields:** No dedicated input form — this is a detail (9 tabs) screen. Display/column content: Profile, connections, ledger top-ups tab shell.

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **R7** — OEM sales user sees **only dealers ticked in "Assigned Dealers"** (their POs, payments, details); none ticked = no dealers
- **Counterpart:** D47, D35
- **Dependency note:** R6/R7


### Sales (mirror)

#### [O07] Dealer → Customers + Customer Mirror
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/dealers/:id/customer-detail; /customers/:id/*` · **Type:** List + Detail (6 tabs) · **Mode:** **Mirror** · **Roles:** see DEALER_DETAILS_CUSTOMER_LIST

**Buttons / Actions:** search, open

**Fields:** No dedicated input form — this is a list + detail (6 tabs) screen. Display/column content: Read-only view of dealer-owned customer/invoice/payment/service/warranty data.

**Business logic / rules:**
- **R10** — OEM reads all dealer CRM data **read-only** through `?dealerProfileID=`
- **F9** — **Gap:** OEM sees customer PII (PAN / Aadhaar numbers, phone) unmasked
- **Counterpart:** D15–D23, D40–D42
- **Dependency note:** R10, F9 (PII unmasked — gap); mirrors D15-D23, D40-D42


#### [O08] Dealer → Enquiries
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/dealers/:id/enquiry-list` · **Type:** List · **Mode:** **Mirror** · **Roles:** see …_ENQUIRY_LIST

**Buttons / Actions:** —

**Fields:** No dedicated input form — this is a list screen. Display/column content: Read-only.

**Business logic / rules:**
- **R10** — OEM reads all dealer CRM data **read-only** through `?dealerProfileID=`
- **Counterpart:** D07–D09
- **Dependency note:** R10; mirrors D07-D09


#### [O09] Dealer → Vehicle Sold
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/dealers/:id/vehicle-sold` · **Type:** List · **Mode:** **Mirror** · **Roles:** see …_VEHICLE_SOLD

**Buttons / Actions:** —

**Fields:** No dedicated input form — this is a list screen. Display/column content: Read-only.

**Business logic / rules:**
- **R10** — OEM reads all dealer CRM data **read-only** through `?dealerProfileID=`
- **Counterpart:** D20 / D21
- **Dependency note:** R10; mirrors D20/D21


#### [O10] Dealer → Vehicle Stock + Add Stock
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/dealers/:id/vehicle-stock` · **Type:** List + Dialog · **Mode:** RO + Create · **Roles:** ADM SZH APM DH

**Buttons / Actions:** type tabs, **add stock to dealer**

**Fields:**

| Label | API field | Type | Req | Options |
|---|---|---|---|---|
| Product type | productType | select | ✔ | Vehicle / Spare / Accessory / Battery / Charger / Motor / Controller |
| Product | productId | select | ✔ | — |
| Quantity | quantity | number | ✔ | — |

**Business logic / rules:**
- **R10** — OEM reads all dealer CRM data **read-only** through `?dealerProfileID=`
- **Counterpart:** D24 / D25
- **Dependency note:** R10; mirrors D24/D25


#### [O11] Dealer → Warranty Claims
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/dealers/:id/warranty-claim` · **Type:** List + Report · **Mode:** Mirror · **Roles:** see …_WARRANTY_CLAIM

**Buttons / Actions:** period filter, claims by product

**Fields:** No dedicated input form — this is a list + report screen. Display/column content: Period filter, claims-by-product chart.

**Business logic / rules:**
- **R10** — OEM reads all dealer CRM data **read-only** through `?dealerProfileID=`
- **Counterpart:** D37
- **Dependency note:** R10; mirrors D37


#### [O12] Dealer → Purchase Orders
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/dealers/:id/purchase-order` · **Type:** List · **Mode:** RO · **Roles:** see …_PO

**Buttons / Actions:** status / type filter

**Fields:** No dedicated input form — this is a list screen. Display/column content: Status/type filter.

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **R7** — OEM sales user sees **only dealers ticked in "Assigned Dealers"** (their POs, payments, details); none ticked = no dealers
- **Counterpart:** D28
- **Dependency note:** R6/R7; mirrors D28


#### [O13] Dealer → Pending Stock
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/dealers/:id/pending-stock` · **Type:** Report · **Mode:** RO · **Roles:** see …_PO

**Buttons / Actions:** —

**Fields:** No dedicated input form — this is a report screen. Display/column content: Approved minus dispatched.

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **R7** — OEM sales user sees **only dealers ticked in "Assigned Dealers"** (their POs, payments, details); none ticked = no dealers
- **Counterpart:** D30 "pending to dispatch"
- **Dependency note:** R6/R7; mirrors D30 'pending to dispatch'


#### [O14] Dealer → Payment History
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/dealers/:id/payment-history` · **Type:** List · **Mode:** RO · **Roles:** see …_PAYMENT_HISTORY

**Buttons / Actions:** —

**Fields:** No dedicated input form — this is a list screen. Display/column content: PO credit balance, totals.

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **R7** — OEM sales user sees **only dealers ticked in "Assigned Dealers"** (their POs, payments, details); none ticked = no dealers
- **Counterpart:** D33 / D45
- **Dependency note:** R6/R7; mirrors D33/D45


### Announcements

#### [O15] Announcements List
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/announcements` · **Type:** List · **Mode:** RO · **Roles:** (unkeyed)

**Buttons / Actions:** new, open

**Fields:** No dedicated input form — this is a list screen. Display/column content: New, open.

**Business logic / rules:**
- **Counterpart:** D05
- **Dependency note:** Role not in permission map — confirm access


#### [O16] Announcement Create / Edit
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/announcements/new, /announcements/:id/edit` · **Type:** Form · **Mode:** CRUD · **Roles:** (unkeyed)

**Buttons / Actions:** create, edit, stop

**Fields:**

| Label | API field | Type | Req | Options / validation |
|---|---|---|---|---|
| Title | title | text | ? | — |
| Description | description | textarea | ? | — |
| Attachment | attachmentType + file / table | radio + file / grid | — | None / File (Image / PDF / Video) / Table |
| Target Dealers | targetType (+ muIds) | select | ? | All Manufacturing Units / Selected Manufacturing Unit |

**Business logic / rules:**
- **Counterpart:** D06
- **Dependency note:** mirrors D05/D06


### Orders

#### [O17] Orders List (+ sub-lists)
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/orders, /orders/{full-payment-pending, partial-dispatch, dispatched, delivered, dispatched-delivered, advance-payment-pending}` · **Type:** List · **Mode:** RO · **Roles:** see ORDERS_LIST_*

**Buttons / Actions:** type tabs, unit / date / status filter, print

**Fields:** No dedicated input form — this is a list screen. Display/column content: Type tabs, 7 status sub-lists, unit/date/status filter.

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **R7** — OEM sales user sees **only dealers ticked in "Assigned Dealers"** (their POs, payments, details); none ticked = no dealers
- **Counterpart:** D28
- **Dependency note:** R6/R7; mirrors D28


#### [O20] Order Detail (6 tabs)
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/orders/order-details/:productType/:id; edit /orders/edit-order/:poId` · **Type:** Detail · **Mode:** Action · **Roles:** see ORDERS_DETAILS

**Buttons / Actions:** approve / reject, create quotation, edit items, assign, dispatch shipment, verify / reject payment, info note, expected dispatch date, revert cancel, print

**Fields:**

| Label | API field | Type | Req | Notes |
|---|---|---|---|---|
| Add PO info note | infoNote | textarea | — | `PUT /purchase-order/:id/info`; OEM-only (F2) |
| Expected dispatch date | expectedDispatchDate | date | — | `PUT /purchase-order/:id/expected-dispatch-date`; notifies dealer |
| Edit items (edit order) | items[].approvedQty, properties | number | — | `PUT /purchase-order/:id/items`, `…/items/:itemId/properties` |
| Create Quotation (seller tier, [C]) | dealer, due date, lines (qty, rate, discount, SGST / CGST), adjustment, T&C | form | — | `POST /purchase-order-quotations` |

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **R7** — OEM sales user sees **only dealers ticked in "Assigned Dealers"** (their POs, payments, details); none ticked = no dealers
- **F2** — OEM "PO info note" is internal: "only OEM staff see this"
- **Counterpart:** **D30**
- **Dependency note:** R6/R7, F2; counterpart D30


#### [O21] Assign Item
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `(O20)` · **Type:** Dialog · **Mode:** Action · **Roles:** ASSIGN roles

**Buttons / Actions:** assign

**Fields:**

| Label | API field | Type | Req | Notes |
|---|---|---|---|---|
| Manufacturing Unit | manufacturingUnitId | select | ✔ | — |
| (ro) Total qty, Approved qty, Vehicle, Variant, Colour | — | ro | — | mixed colour allowed |
| Notes | remarks | textarea | — | — |

**No chassis or serial entry at assignment.** Quantities only.

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **Dependency note:** R6


#### [O22] Dispatch Shipment
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `(O20)` · **Type:** Dialog · **Mode:** Create · **Roles:** DISPATCH roles

**Buttons / Actions:** dispatch (n units), dispatch all remaining

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Dispatch from Manufacturing Unit | muId | select | ✔ | MU list | — |
| Per line: Approved / Shipped / Remaining | — | ro | — | — | — |
| Per line: Ship now | items[].quantity | number | ✔ (≥1 line) | ≤ remaining; "Dispatch all remaining" | button shows "Dispatch (n units)" |
| Transport Type | transportType | radio | ? | By Truck / By Parcel (courier variant: By Courier) | — |
| Transport Company Name | companyName | text | ? | — | — |
| Company Number | companyNumber | text | ? | — | — |
| Tracking ID | trackingId | text | ? | — | — |
| Driver Number | driverNumber | text | ? | — | — |
| Vehicle No | vehicleNo | text | ? | — | — |
| Courier Name / Number / Parcel Tracking ID | courierName, courierNumber, parcelTrackingId | text | ? | courier variant [C] | — |
| Transport Date | transportDate | date | ? | — | — |
| Expected Dispatch / Delivery Date | deliveryDate | date | ? | — | — |
| Payment Status | paymentStatus | select | ? | Paid / Unpaid [C] | — |

Batteries and chargers travel with vehicles automatically.

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **Counterpart:** D32 (confirm / reject)
- **Dependency note:** counterpart D32 (confirm/reject)


#### [O24] PO Reject / Info Note / Expected Date
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `(O20)` · **Type:** Dialog / inline · **Mode:** Action · **Roles:** APPROVE roles

**Buttons / Actions:** reject (remarks), save note, save date

**Fields:**

| Label | API field | Type | Req |
|---|---|---|---|
| Reason for Rejection → Remarks | note | textarea | ✔ [I] |
| Approve | — | button | — |
| Revert cancelled PO | — | button | — |

**Business logic / rules:**
- **F2** — OEM "PO info note" is internal: "only OEM staff see this"
- **Counterpart:** D30


### Orders / Production

#### [O18] Production (Day-wise)
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/orders/production` · **Type:** List + Action · **Mode:** Action · **Roles:** ORDERS_LIST_VEHICLE roles

**Buttons / Actions:** pick date / unit, update produced count

**Fields:**

| Label | API field | Type | Req | Notes |
|---|---|---|---|---|
| Date | date | date picker | — | production date = expected dispatch − 1 day |
| Unit | — | select | — | — |
| Per PO: produced count / production status | progress | number / select | — | shows "0 / 16 vehicles produced" |

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **F6** — OEM-only fields: ledger tally, reserved stock by dealer, production status / plan, MU stock register, dispatch batch / token, vendor data, audit trail (section 9)
- **Counterpart:** D30 banner only
- **Dependency note:** R6, F6


### Orders / Dispatch

#### [O19] Dispatch Plan (Batches)
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/orders/dispatch-plan, /orders/dispatch-batch/:batchId` · **Type:** List + Action · **Mode:** Action · **Roles:** see ORDERS_LIST_DISPATCH

**Buttons / Actions:** combine paid POs into batch, revert, print

**Fields:**

| Label | API field | Type | Req | Notes |
|---|---|---|---|---|
| Filters (unit, dates) | — | — | — | — |
| Select paid POs | poIds[] | checkbox | ✔ | combine into dispatch batch |

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **F6** — OEM-only fields: ledger tally, reserved stock by dealer, production status / plan, MU stock register, dispatch batch / token, vendor data, audit trail (section 9)
- **Dependency note:** R6, F6


### Orders / Payments

#### [O23] Payment Verify / Reject
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `(O20 Payment tab, O45)` · **Type:** Action · **Mode:** Action · **Roles:** (ORDERS_PAYMENT_VERIFY)

**Buttons / Actions:** verify, reject (reason)

**Fields:**

| Action | Fields | Req | Notes |
|---|---|---|---|
| Verify | — | — | toast "Payment of ₹X on PO verified — ₹Y credited to the dealer's ledger" (surplus) |
| Reject | reason | ✔ | dealer resubmits |
| Ledger top-up verify | verified, note | — | `PUT /ledger-topups/:id/verify` |

**Payments list columns:** order, dealer, transaction ID, used for order, received, payment date, submitted, note, receipt (image), status, action.

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **R7** — OEM sales user sees **only dealers ticked in "Assigned Dealers"** (their POs, payments, details); none ticked = no dealers
- **Counterpart:** D31
- **Dependency note:** R6/R7; counterpart D31


### Products

#### [O25] Products List
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/products/{vehicle, spare, accessory, battery, charger, motor, controller}` · **Type:** List · **Mode:** RO · **Roles:** ADM

**Buttons / Actions:** status filter, add, edit, delete

**Fields:** No dedicated input form — this is a list screen. Display/column content: Status filter, add/edit/delete, 7 product-type tabs.

**Business logic / rules:**
- **Counterpart:** D29 catalogue
- **Dependency note:** ADM only


#### [O26] Product Create / Edit: Vehicle
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/products/vehicle/new, /products/vehicle/:id/edit` · **Type:** Form · **Mode:** CRUD · **Roles:** ADM

**Buttons / Actions:** add colour, add variant, add spec, create

**Fields:**

| Section / label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Vehicle Model | productName | text | ✔ | — | — |
| Type | wheels | select | ✔ | 2 Wheeler / 3 Wheeler / 4 Wheeler | — |
| Motor | motorId | select | — | motor products | — |
| Controller | controllerId | select | — | controller products | — |
| Registration | isRegistrationVehicle | select | ✔ | Yes / No | — |
| HSN No | HSN | text | ✔ | — | — |
| CGST (%) | cgst | text | ✔ | — | — |
| SGST (%) | sgst | text | ✔ | — | — |
| Product Image | images | file image / * | — | 240×240 preferred, ≤ 5 MB | — |
| Colour: Name + Code (repeat) | colourName, colourCode | text + colour picker | — | "Add Colour" | — |
| Variant (repeat): Name | variants[].name | text | ✔ | "+ Add Variant" | — |
| Without Battery & Charger (WBC) | isWBC | checkbox | — | — | — |
| Charger | chargerProductId | select | — | hidden if WBC | — |
| Battery | batteryProductId | select | — | — | — |
| Battery Qty | batteryQuantity | number | — | — | — |
| Price: Distributor | price.distributor | text ₹ | ✔ | — | F1 |
| Price: Divisional Distributor | price.divisionalDistributor | text ₹ | ✔ | — | — |
| Price: District Dealer | price.districtDealer | text ₹ | ✔ | — | — |
| Price: Area Dealer | price.areaDealer | text ₹ | ✔ | — | — |
| Price: Customer Price | price.customer | text ₹ | ✔ | — | MRP on sale invoice |
| Technical Specs (+ Add Field) | specs[{key, value}] | text pairs | — | — | — |
| Available from: per MU | activeUnits[] | checkbox per MU | — | — | R4 |
| Purchase limit | purchaseLimit | checkbox + dealer types / share | — | "Show selected dealer types only a share of the available stock" | — |

**Business logic / rules:**
- **F1** — Each variant has 5 prices: Distributor, Divisional Distributor, District Dealer, Area Dealer, Customer. A dealer sees only **its tier** (on PO) and **Customer** (on sale). Spares and components have Dealer + Customer price.
- **Counterpart:** D29, D20 picker
- **Dependency note:** F1 (5-tier pricing)


#### [O27] Product Create / Edit: Spare, Accessory
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/products/{spare, accessory}/new, edit` · **Type:** Form · **Mode:** CRUD · **Roles:** ADM

**Buttons / Actions:** create

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Vehicle | vehicleId | select | ✔ | vehicle products | compatibility |
| Spare Name / Accessory Name | spareName / productName | text | ✔ | — | — |
| Is Panel / Painted Part? (spare) | isPanel | checkbox | — | creates one spare per colour of the model | — |
| Parts Code | partCode | text | — | — | — |
| Vendor / Supplier (spare) | vendorId | select | — | None / vendors | links to O40 procurement |
| Category, Brand (accessory) [C] | category, brand | text / select | — | — | — |
| HSN Code | HSN | text | ✔ | — | — |
| CGST / SGST | cgst, sgst | text | — | — | — |
| Dealer Price | dealerPrice | text ₹ | — | single dealer price (not tiered) | — |
| Customer Price | customerPrice | text ₹ | — | — | — |
| Image | images | file | — | — | — |
| Additional specs | specs[] | key / value | — | — | — |
| Available from per MU, Purchase limit | — | checkbox | — | as 7.12 | — |

**Business logic / rules:**
- **F1** — Each variant has 5 prices: Distributor, Divisional Distributor, District Dealer, Area Dealer, Customer. A dealer sees only **its tier** (on PO) and **Customer** (on sale). Spares and components have Dealer + Customer price.
- **Counterpart:** D29 (spares), D20


#### [O28] Product Create / Edit: Battery/Charger/Motor/Controller
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/products/{battery, charger, motor, controller}/new, edit` · **Type:** Form · **Mode:** CRUD · **Roles:** ADM

**Buttons / Actions:** create

**Fields:**

| Label | API field | Type | Req | Notes |
|---|---|---|---|---|
| {Battery / Charger / Motor / Controller} Name | productName | text | ✔ | — |
| HSN No | HSN | text | ✔ | — |
| Vendor / Supplier | vendorId | select | — | — |
| CGST / SGST | cgst, sgst | text | — | — |
| Dealer Price / Customer Price | dealerPrice, customerPrice | text ₹ | — | — |
| Image | images | file | — | — |
| Additional specs | specs[{key, value}] | text pairs | — | voltage, capacity, warranty km / months / type as custom fields [I]; dealer screens show Motor Type, Voltage, Capacity, Warranty (KM / M / Type), Battery Type, Life Cycle |
| Available from per MU, Purchase limit | — | checkbox | — | — |

**Business logic / rules:**
- **F1** — Each variant has 5 prices: Distributor, Divisional Distributor, District Dealer, Area Dealer, Customer. A dealer sees only **its tier** (on PO) and **Customer** (on sale). Spares and components have Dealer + Customer price.
- **Counterpart:** D29 (warranty products)


#### [O29] Product Detail + Dashboard
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/products/vehicle-details/:id` · **Type:** Detail + Report · **Mode:** RO · **Roles:** ADM

**Buttons / Actions:** week / month / year, purchased vs sold

**Fields:** No dedicated input form — this is a detail + report screen. Display/column content: Per-model rollup: stock, sales, warranty, issues; stock-by-MU; price matrix.

**Business logic / rules:**
- **Dependency note:** Rolls up Inventory/Orders/Sales/Warranty/Issues


### Inventory

#### [O30] Inventory (OEM Stock)
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/inventory/stock (+ stock history, reserved stock)` · **Type:** List (9 tabs) · **Mode:** RO · **Roles:** see INVENTORY_*

**Buttons / Actions:** unit / stock filter, search

**Fields:** No dedicated input form — this is a list (9 tabs) screen. Display/column content: Unit/stock filter, search, stock history, reserved stock tabs.

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **F6** — OEM-only fields: ledger tally, reserved stock by dealer, production status / plan, MU stock register, dispatch batch / token, vendor data, audit trail (section 9)
- **Counterpart:** D29 "N in stock"
- **Dependency note:** R6, F6


#### [O31] Inventory List per Product
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/inventory/list/{vehicles, spare, accessory}/…` · **Type:** List · **Mode:** RO + add · **Roles:** ADM APM DH DM

**Buttons / Actions:** status (available / locked / delivered / draft), unit, add stock (→ O35)

**Fields:** No dedicated input form — this is a list screen. Display/column content: Status (available/locked/delivered/draft), unit filter, add stock link.

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **Dependency note:** R6


### Manufacturing Unit

#### [O32] Manufacturing Units List
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/manufacturing-unit` · **Type:** List · **Mode:** RO · **Roles:** ADM DH DM

**Buttons / Actions:** new, view

**Fields:** No dedicated input form — this is a list screen. Display/column content: New, view.

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **Dependency note:** R6


#### [O33] MU Create / Edit
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/manufacturing-unit/new, /manufacturing-unit/edit/:id` · **Type:** Form · **Mode:** CRUD · **Roles:** ADM

**Buttons / Actions:** create, save, use current location

**Fields:**

| Label | API field | Type | Req | Options / validation |
|---|---|---|---|---|
| Unit Name | unitName | text | ✔ | — |
| State | state | select | ✔ | 36 states / UTs + Nepal |
| Production Unit Head | userID | select | — | OEM_PRODUCTION_HEAD users ("No unit head") |
| Address | address | textarea | ✔ | — |
| GST No | gstNo | text | ✔ | — |
| Account No | accountNumber | text | ✔ | — |
| IFSC Code | ifscCode | text | — | — |
| A/c Holder Name | accountHolderName | text | — | — |
| Bank Branch | bankBranch | text | — | — |
| Phone No | phoneNo | text | ✔ | — |
| City | city | text | ✔ | — |
| Email | email | email | ✔ | — |
| Pincode | pincode | text | ✔ | — |
| Latitude / Longitude | latitude, longitude | number | — | "Use my current location" |

**Capacity and working calendar (separate):** `GET/PUT /manufacturing_unit/oem/:id/capacity`, `/working-calendar` [C].

**Business logic / rules:**
- **Counterpart:** D30 quotation letterhead
- **Dependency note:** counterpart D30 quotation letterhead


#### [O34] MU View
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/manufacturing-unit/view/:id` · **Type:** Detail · **Mode:** RO + Action · **Roles:** ADM DH DM

**Buttons / Actions:** edit, MU stock, dispatch plan, load plan, containers, production, **connect a dealer**

**Fields:**

| Label | API field | Type | Req | Notes |
|---|---|---|---|---|
| Search any dealer | dealerId | search / select | ✔ | moves the dealer to this unit; already-connected ones are flagged |

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **Dependency note:** R6


#### [O35] MU Stock
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/inventory/mu-stock/:unitId` · **Type:** Report + Dialogs · **Mode:** RO + Create · **Roles:** ADM APM DH DM

**Buttons / Actions:** date, daily register, in-transit (add, edit, receive), components needed, reduce stock

**Fields:**

**Add In-Transit Shipment** → `POST /manufacturing_unit/oem/:id/in-transit`:

| Label | API field | Type | Req | Notes |
|---|---|---|---|---|
| Product | productId | select | ✔ | — |
| Dispatch Date | dispatchDate | date | ? | — |
| Colors Breakdown (+ Add Color) | colours[{colour, qty}] | select + number, repeat | ? | — |
| Notes | notes | textarea | — | — |

**Other MU stock actions:**
- **Receive:** `PUT …/in-transit/:id/receive`, with received colours.
- **Reduce Stock:** `POST …/reduce-stock`; fields not captured [C].

**Daily Stock Register:** model, opening, dispatched, reserved, received, closing, in transit. Auto-computed; clicking Reserved shows a dealer breakdown.

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **F6** — OEM-only fields: ledger tally, reserved stock by dealer, production status / plan, MU stock register, dispatch batch / token, vendor data, audit trail (section 9)
- **Dependency note:** R6, F6


#### [O36] MU Dispatch Plan (ETA)
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/manufacturing-unit/dispatch-plan/:id` · **Type:** Report (calendar) · **Mode:** RO · **Roles:** ADM DH DM

**Buttons / Actions:** month navigation

**Fields:** No dedicated input form — this is a report (calendar) screen. Display/column content: Month calendar of dispatch/build/component-short markers.

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **Dependency note:** R6


#### [O37] Load Plan
**Priority:** P2 · **Status:** Verified (reference app)

**Path:** `/manufacturing-unit/load-plan/:id` · **Type:** Report · **Mode:** RO · **Roles:** ADM DH DM

**Buttons / Actions:** radius km, recompute

**Fields:**

| Label | API field | Type | Req |
|---|---|---|---|
| Radius km | radiusKm | number | — |
| Recompute | — | button | — |

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **Dependency note:** R6


#### [O38] Containers
**Priority:** P2 · **Status:** Verified (reference app)

**Path:** `/manufacturing-unit/containers(/:id)` · **Type:** List + Dialog · **Mode:** CRUD · **Roles:** ADM DH DM

**Buttons / Actions:** new, edit, delete

**Fields:**

| Label | API field | Type | Req | Notes |
|---|---|---|---|---|
| Name | name | text | ? | e.g. "Truck 20ft" |
| Manufacturing Unit ID | manufacturingUnitId | number | — | blank = OEM-wide |
| Min Load Qty | minLoad | number | ? | — |
| Max Load Qty | maxLoad | number | ? | — |

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"


### Vendors

#### [O39] Vendors
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/vendors` · **Type:** List + Dialog · **Mode:** CRUD · **Roles:** (unkeyed)

**Buttons / Actions:** add, edit, delete, procurement

**Fields:**

| Label | API field | Type | Req |
|---|---|---|---|
| Name | name | text | ✔ |
| Contact Person | contactPerson | text | — |
| Phone | phone | text | — |
| Email | email | text | — |
| GST No | gstNo | text | — |
| Address | address | text | — |
| City | city | text | — |
| State | state | text | — |
| Pincode | pincode | text | — |
| Active | isActive | checkbox | — |
| Notes | notes | textarea | — |

**Business logic / rules:**
- **Dependency note:** Role not keyed — confirm access


#### [O40] Vendor Procurement
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/vendors/:id/procurement` · **Type:** Form · **Mode:** Create · **Roles:** (unkeyed)

**Buttons / Actions:** set order qty / rate, create PO

**Fields:**

| Column / field | API field | Type | Req | Notes |
|---|---|---|---|---|
| Product, Type, Needed, In stock, Net | — | ro | — | needed = from dispatch list demand |
| Order Qty | lines[].orderQty | number | ✔ for PO lines | — |
| Rate | lines[].rate | number | ✔ | — |
| Amount | — | ro | — | — |
| MU | muId | select | ? | — |
| Create PO (n) | — | button | — | creates vendor_purchase_order (pending approval) |

**Business logic / rules:**
- **Dependency note:** Where vendor POs are actually raised


### Vendor POs

#### [O41] Vendor POs
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/vendor-pos` · **Type:** List + Dialog · **Mode:** C+R + approval · **Roles:** (unkeyed)

**Buttons / Actions:** create (choose vendor → O40), filter, view

**Fields:**

| Label | API field | Type | Req | Notes |
|---|---|---|---|---|
| Choose vendor | vendorId | select | ✔ | "You'll be taken to the vendor's procurement view" (→ 7.21) |

Approval is by the OEM approval admin, via email (7.27).

**Business logic / rules:**
- **Dependency note:** Role not keyed — confirm access


### Issues

#### [O42] Issues
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/issues` · **Type:** List + Actions · **Mode:** Action · **Roles:** IM SVH ADM

**Buttons / Actions:** stage tabs, approve / decline (manager), approve / decline (OEM), settle with money, replace → mark dispatched

**Fields:**

| Action | Endpoint | Fields | Req |
|---|---|---|---|
| Manager approve / decline | `PUT /purchase-order/issues/:id/manager-review` | decision, note (decline reason) | reason ✔ on decline |
| OEM approve / decline | `PUT /purchase-order/issues/:id/oem-review` | decision, reason | reason ✔ on decline |
| Settle with money | `PUT /purchase-order/issues/:id/resolution {type:"money", amount, transactionId}` | Compensation amount (₹), Transaction ID | ✔ ✔ |
| Replace | `…/resolution {type:"replacement"}` | — | — |
| Mark replacement dispatched | `PUT /purchase-order/issues/:id/replacement-dispatch` | — | — |
| Mark resolved / reject claim | `PUT /purchase-order/issues/:id/resolve`, `/purchase-order/:id/issue/reject` | reason | ✔ on reject |

**Issues list columns:** order, dealer, product, serial / chassis, issue, media, stage, reported, action.

**Business logic / rules:**
- **F8** — Issue review notes and OEM approval steps are shown to dealer only as **stage + outcome**
- **Counterpart:** D36, D32
- **Dependency note:** F8; counterpart D36/D32


### Warranty

#### [O43] Warranty (Received)
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/warranty (raisedTo = oem)` · **Type:** List · **Mode:** RO · **Roles:** WARRANTY roles

**Buttons / Actions:** status filter

**Fields:** No dedicated input form — this is a list screen. Display/column content: Status filter; raisedTo=oem queue.

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **R7** — OEM sales user sees **only dealers ticked in "Assigned Dealers"** (their POs, payments, details); none ticked = no dealers
- **Counterpart:** D37
- **Dependency note:** R6/R7


#### [O44] Warranty Claim Page
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/warranty/warranty-receipt/:id` · **Type:** Detail + Dialogs · **Mode:** Action · **Roles:** WARRANTY roles

**Buttons / Actions:** verify / reject, inspection report, service or replacement, request / edit / waive service charge, verify / reject dealer payment, return details

**Fields:**

**Claim page sections:**
- **Dealer & summary:** dealer ID, name, model / variant, claim received, warranty until.
- **OEM review.**
- **Workflow:** verify, inspect, service, return.
- **Customer & claim.**
- **Claimed item:** spare, brand, item no.
- **Issue & coverage.**
- **Dealer claim photos.**
- **Replacement details:** warranty type, product name / no., replacement ID (OEM / dealer), inventory source, claimed date.
- **Dealer issue report (post-receipt).**

| Dialog | Fields | Req | Options / validation |
|---|---|---|---|
| Verify / Reject | reason (on reject) | ✔ on reject | "Please provide a reason for rejection" |
| Inspection | inspection report (file / notes) | ? | "Inspection Reports" |
| Service / Replacement | service (radio Service / Replacement), remark, item_id (replacement stock line), replacement serial / product #, serviceOn (date) | ✔ choice | replacement blocked if stock unavailable ("Switch to Service"); replacement qty deducted at Returning |
| Ask cost from dealer | amount (₹), notes for dealer | ✔ amount | blocks service / replacement until dealer pays and OEM verifies |
| Service charge controls | edit amount, waive charge, verify payment, reject payment (reason) | reason ✔ on reject | shows dealer transaction ID + amount |
| Return / complete | company, contactNumber, transport, trackingNo, payment, date, attachments | ✔ company, ✔ contact, ✔ tracking | contact = 10 digits, no letters; transport Road / Water / Air Wave / Train; payment Paid / Unpaid; file ≤ 5 MB |
| Post-receipt issue: accept | — | — | "Accepting will ask the dealer to send the product back for re-service" |

**Business logic / rules:**
- **Counterpart:** **D39**
- **Dependency note:** counterpart D39


### Payments

#### [O45] Payments (All Dealers)
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/payments` · **Type:** List + Action · **Mode:** Action · **Roles:** (unkeyed)

**Buttons / Actions:** search, status, date range, view receipt, verify / reject

**Fields:**

| Action | Fields | Req | Notes |
|---|---|---|---|
| Verify | — | — | toast "Payment of ₹X on PO verified — ₹Y credited to the dealer's ledger" (surplus) |
| Reject | reason | ✔ | dealer resubmits |
| Ledger top-up verify | verified, note | — | `PUT /ledger-topups/:id/verify` |

**Payments list columns:** order, dealer, transaction ID, used for order, received, payment date, submitted, note, receipt (image), status, action.

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **R7** — OEM sales user sees **only dealers ticked in "Assigned Dealers"** (their POs, payments, details); none ticked = no dealers
- **Counterpart:** D31, D46
- **Dependency note:** R6/R7; Role not keyed — confirm access; counterpart D31/D46


### Ledger

#### [O46] Ledgers
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/ledgers` · **Type:** List + Dialog · **Mode:** CRUD · **Roles:** (unkeyed)

**Buttons / Actions:** new ledger, search

**Fields:**

| Label | API field | Type | Req | Notes |
|---|---|---|---|---|
| Name | name | text | ✔ | "Ledger name is required"; e.g. "South Region Pool" |
| Note | note | textarea | — | optional |

**List columns:** name, members, balance, tally; header total held + tally.

**Business logic / rules:**
- **F6** — OEM-only fields: ledger tally, reserved stock by dealer, production status / plan, MU stock register, dispatch batch / token, vendor data, audit trail (section 9)
- **Counterpart:** D33 / D45 balance
- **Dependency note:** F6; Role not keyed — confirm access


#### [O47] Ledger Detail
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/ledgers/:id` · **Type:** Detail + Dialogs · **Mode:** Action · **Roles:** (unkeyed)

**Buttons / Actions:** edit, add credit, add debit, connect / remove dealer

**Fields:**

| Action | Fields | Req | Notes |
|---|---|---|---|
| Edit | name, note | ✔ name | — |
| Add credit | amount, note, supporting document | ✔ amount | doc: PDF / image / doc ≤ 25 MB; "Every connected dealer can spend what you add" |
| Add debit | amount, note, document | ✔ amount | "That is more than this ledger holds" |
| Connect / remove dealer | dealerId | ✔ | — |

**Ledger detail sections:**
- **Open purchase orders:** order, dealer, status, ledger used.
- **Connected dealers.**
- **History:** type, date, dealer, user, reference, ± amount, balance after.

**Business logic / rules:**
- **F6** — OEM-only fields: ledger tally, reserved stock by dealer, production status / plan, MU stock register, dispatch batch / token, vendor data, audit trail (section 9)
- **Counterpart:** D45 ledger history
- **Dependency note:** F6; counterpart D45 ledger history


### Reports

#### [O48] Vehicle Sold
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/vehicle-sold` · **Type:** Report · **Mode:** **Mirror** · **Roles:** (unkeyed)

**Buttons / Actions:** search, period (today / month / year / custom)

**Fields:** No dedicated input form — this is a report screen. Display/column content: Search, period filter.

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **R7** — OEM sales user sees **only dealers ticked in "Assigned Dealers"** (their POs, payments, details); none ticked = no dealers
- **Counterpart:** D20
- **Dependency note:** R6/R7; Role not keyed; mirrors D20


#### [O56] Reports / Warranty-claim / Challan / E-way bill (mocks)
**Priority:** P2 · **Status:** Verified (reference app)

**Path:** `/reports, /warranty-claim, /delivery-challan, /e-waybill` · **Type:** Static / Mock · **Mode:** Mock · **Roles:** —

**Buttons / Actions:** —

**Fields:** No dedicated input form — this is a static / mock screen. Display/column content: Non-functional stubs in the reference app.

**Business logic / rules:**
- **Counterpart:** D50–D52
- **Dependency note:** Superseded for E-Way Bill by new feature row


### Settings

#### [O49] Settings: Profile
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/settings/profile` · **Type:** Detail + Form · **Mode:** Update (ADM) · **Roles:** PROFILE

**Buttons / Actions:** save approval email, GST toggle, change password

**Fields:**

| Label | API field | Type | Req | Notes |
|---|---|---|---|---|
| Is GST Needed? | isGstNeeded | toggle | — | ADM only (GST_BUTTON) |
| Approval Admin Email | approvalAdminEmail | email | ? | vendor-PO approvals emailed here; only OEM admin can change |
| Org, GST, created, country, state, location, address, currency, tax ID, language, time zone | — | ro | — | "contact DMS Admin" |
| Change Password | password, confirmPassword | password | ✔ | — |


#### [O50] Settings: Operating States
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/settings/operating-states` · **Type:** Form · **Mode:** CRUD · **Roles:** ADM

**Buttons / Actions:** add state, update states

**Fields:**

| Label | API field | Type | Req |
|---|---|---|---|
| State (repeat, + Add State) | state[] | select | ✔ ≥1 |


#### [O51] Settings: Regions & Zones
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/settings/regions, /settings/regions/new, /settings/regions/:id` · **Type:** List + Form · **Mode:** CRUD · **Roles:** ADM

**Buttons / Actions:** create region & zone, add zone, edit, delete

**Fields:**

| Label | API field | Type | Req | Notes |
|---|---|---|---|---|
| Region Name | regionName | text | ✔ | — |
| Region Head | managerId | select | — | OEM users |
| Zone Name (repeat, "+ One More Zone") | zones[].name | text | ✔ | — |
| Zone Head | zones[].managerId | select ("Select Manager") | — | — |

**List columns:** region ID, name, head, zones, dealers, created on, status.

**Business logic / rules:**
- **R8** — Region / zone heads attached to regions / zones; dealers carry `regionId` / `zoneId`, so likely scoping for SRH / SZH
- **Dependency note:** R8 (region/zone scoping for SRH/SZH not fully confirmed — spec §12)


#### [O52] Settings: Users
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `/settings/users` · **Type:** List · **Mode:** RO · **Roles:** ADM

**Buttons / Actions:** search, create, edit, unlock account

**Fields:** No dedicated input form — this is a list screen. Display/column content: Search, create, edit, unlock account.

**Business logic / rules:**
- **Dependency note:** ADM only


#### [O53] OEM User Add / Edit
**Priority:** P0 · **Status:** Verified (reference app)

**Path:** `(O52)` · **Type:** Form / Dialog · **Mode:** CRUD · **Roles:** ADM

**Buttons / Actions:** create, submit, change password, sign out devices, assign dealers

**Fields:**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| User Role | role | select | ✔ | 15 OEM roles (section 2.1) | — |
| Manufacturing Unit | manufacturingUnitId | select | — | "All units (global)" or one MU | R6 |
| First Name | firstName | text | ✔ | 3–30 chars | — |
| Last Name | lastName | text | ✔ | ≥ 1 char | — |
| Email ID | email | email | ✔ | valid email | — |
| Contact | phone | text | ✔ | 10 digits | — |
| Password / Confirm (add) | password, confirmPassword | password | ✔ | must match | — |
| Status (edit) | isActive | select | ✔ | Active / InActive | — |
| Assigned Dealers (sales roles, edit) | dealerIds[] | multi-select checklist | — | "This sales user can view ONLY the dealers ticked here… With none selected the user sees no dealers" | R7 |
| Device limit (edit) | deviceLimit | number | — | blank = OEM default; 0 = unlimited | — |
| Devices & sessions (edit) | — | table + action | — | device, IP, last active, signed in; sign out | — |

**List columns:** user ID, name, role, role category, contact, email, failed login attempts, status, action (unlock account).

**Business logic / rules:**
- **R6** — OEM user with `manufacturingUnitId` set sees only that MU's dealers, POs and stock; blank = "All units (global)"
- **R7** — OEM sales user sees **only dealers ticked in "Assigned Dealers"** (their POs, payments, details); none ticked = no dealers
- **Dependency note:** R6/R7 (verbatim 'none ticked = sees no dealers' rule)


#### [O54] Settings: Audit Logs
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/settings/audit-logs` · **Type:** List · **Mode:** RO · **Roles:** ADM

**Buttons / Actions:** feature / action / date filters, expand diff

**Fields:** No dedicated input form — this is a list screen. Display/column content: Feature/action/date filters, expandable field diff.

**Business logic / rules:**
- **Dependency note:** See also new Purge/Export rows below


#### [O55] Settings: Security
**Priority:** P1 · **Status:** Verified (reference app)

**Path:** `/settings/security` · **Type:** Detail + Form · **Mode:** Action · **Roles:** ADM (others: own devices)

**Buttons / Actions:** sign out other devices / everywhere, default device limit

**Fields:**

| Label | API field | Type | Req | Notes |
|---|---|---|---|---|
| My devices | — | list | — | sign out other devices / everywhere |
| Default device limit | deviceLimit | number | — | ADM; logged-in accounts table: account, role, devices, limit, last active |

---


---

## New Features (not in the reference app)

### Vendors

#### [N01] GST Lookup / Auto-fetch from GST Portal
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Form enhancement · **Mode:** Enhancement

**Purpose (proposed):** Typing a GSTIN fetches legal name, trade name, address, state, registration status and fills the form, so these are not typed by hand.

**Proposed roles:** Super Admin, Procurement Mgr (vendors); Super Admin (dealer onboarding) · **Proposed path:** `Inside O39/O40 vendor form and O05 dealer form`

**Buttons / Actions (proposed):** Fetch details (next to GSTIN), Use fetched values, Edit manually (unlocks fields), Clear

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| GSTIN | `gstin` | text | ✔ | 15 chars, pattern 2 digits + PAN + 1Z + check char; state code (first 2 digits) must match chosen state | Check digit validated before calling the API |
| Legal name | `legalName` | text | — | filled from portal, read-only until "Edit manually" | Maps to vendor/dealer name |
| Trade name | `tradeName` | text | — | filled from portal | — |
| Address | `address` | text | — | filled from portal (building, street, city, pincode) | Maps to billing address |
| State / code | `state` | select | — | derived from GSTIN | Drives CGST+SGST vs IGST (Tera invoice: Tamil Nadu 33 = CGST/SGST) |
| Registration status | `gstStatus` | badge | — | Active / Cancelled / Suspended | Block save when Cancelled (rule below) |
| Last fetched | `fetchedAt` | datetime | — | read-only | Audit |

**Business logic / rules:**
- **Depends on / extends:** Extends O39/O40 (Vendor) and O05 (Dealer onboarding)
- **Open question:** Which GST-portal API/provider? Needs an external integration partner.
- **Proposed rule:** Never overwrite a field the user already edited unless they confirm "Use fetched values".
- **Proposed rule:** Cancelled or suspended GSTIN: show a warning and block saving a new dealer or vendor.
- **Proposed rule:** If the provider is down or times out, show "Could not reach GST portal" and let the user continue manually.
- **Proposed rule:** Fetched data is a snapshot; no auto-refresh.
- **Proposed rule:** Rate limit: one fetch per GSTIN per minute per user.
- **Open question (proposed):** Which GST-portal API/provider? (already open in the spec)
- **Open question (proposed):** Should PAN and the legal name from the portal be locked after fetch?
- **Proposal sources:** Spec N01; Tera invoice shows GSTIN 33AAMCT1837D1ZH and buyer GSTIN 33BFAPD8510E1Z5.


#### [N23] Vendor — Extended Profile (bank, contacts, status, payment terms, warranty)
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Form enhancement · **Mode:** Enhancement

**Purpose (proposed):** Adds bank, contacts, status, payment terms and warranty terms to the vendor.

**Proposed roles:** Super Admin, Procurement Mgr · **Proposed path:** `/vendors/:id (tabs on O39 form)`

**Buttons / Actions (proposed):** Save, Add contact, Remove contact, Block vendor, Unblock (admin only), Add warranty tier

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Bank name | `bankName` | text | — | — | — |
| Account holder | `bankAccountName` | text | — | — | Tera invoice prints "Account Name" |
| Account number | `bankAccountNo` | text | — | 9-18 digits | Mask in list views |
| Account type | `bankAccountType` | select | — | Current / Savings / CC | — |
| IFSC | `ifsc` | text | — | 4 letters + 0 + 6 alphanumeric | Tera invoice: UTIB0000123 |
| Branch | `branch` | text | — | — | — |
| Contacts (repeatable grid) | `contacts[]` | grid | — | name, designation, phone, email, primary (one only) | At least one primary when any row exists |
| Website | `website` | url | — | valid URL | — |
| Status | `status` | select | ✔ | Active / Inactive / Blocked | Default Active |
| Status reason | `statusReason` | text | — | required when Inactive or Blocked | — |
| Payment modes | `paymentModes[]` | multiselect | — | Cash, Cheque, NEFT/RTGS, UPI, Credit | — |
| Payment terms (days) | `paymentTermsDays` | number | — | 0-180 | "Due on Receipt" = 0 (Tera invoice) |
| Parts warranty (months) | `warrantyMonths` | select | — | 15 / 18 / 24 | Spec: tiers 15/18/24 |
| Product warranty list | `productWarranty[]` | grid | — | product, months, terms | — |
| Freight | `freight` | select | — | Included / Excluded | Tera invoice: "Transportation cost additional" |

**Business logic / rules:**
- **Depends on / extends:** Extends O39
- **Note:** From ERP_changes_ceo.pptx slide 16. Bundles several related fields into one form enhancement rather than splitting into many tiny rows.
- **Proposed rule:** Blocked vendors cannot be selected on a new vendor PO (O41); existing POs are not cancelled.
- **Proposed rule:** Only Super Admin may unblock; unblocking needs a reason and is audited.
- **Proposed rule:** Only one primary contact; deleting the primary forces choosing another.
- **Proposed rule:** Bank fields are PII-like: visible to Super Admin and Procurement Mgr only (new F-rule proposed).
- **Open question (proposed):** Who besides Super Admin may change bank details (maker-checker)?
- **Proposal sources:** Spec N23 (ERP_changes_ceo slide 16); bank block layout from the Tera invoice.


### Material Inward

#### [N02] Material Inward — Receiving & QC Check
**Priority:** P0 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Form / Action · **Mode:** NEW

**Purpose (proposed):** Receive goods against a vendor PO, count against the PO, QC each item, record shortfall and scrap, then post accepted quantity to MU stock (O35).

**Proposed roles:** Inventory Executive, Inventory Manager (approve) · **Proposed path:** `/mu/:muId/inward/new, /inward/:id`

**Buttons / Actions (proposed):** Select PO, Add line / scan item, Mark pass, Mark fail, Mark scrap, Report shortfall, Save draft, Post to stock, Print GRN

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Vendor PO | `vendorPoId` | select | ✔ | only Approved / Part-received POs of this MU | — |
| Inward date | `inwardDate` | date | ✔ | default today; past dates only via N18 | — |
| Vendor invoice no. | `vendorInvoiceNo` | text | ✔ | — | — |
| Vendor invoice date | `vendorInvoiceDate` | date | ✔ | — | — |
| Transporter / vehicle no. | `vehicleNo` | text | — | — | — |
| Lines: part | `lines[].productId` | select | ✔ | from PO lines | — |
| Ordered qty | `lines[].orderedQty` | number | — | read-only from PO | — |
| Previously received | `lines[].receivedQty` | number | — | read-only | — |
| Received now | `lines[].qty` | number | ✔ | 0 to (ordered - received) unless over-receipt allowed | — |
| Passed | `lines[].passQty` | number | ✔ | — | — |
| Failed | `lines[].failQty` | number | ✔ | — | — |
| Scrap | `lines[].scrapQty` | number | ✔ | passed+failed+scrap must equal received now | — |
| Fail reason | `lines[].failReason` | text | — | required if failed or scrap > 0 | — |
| Photos | `lines[].photos[]` | file | — | up to 5 per line | — |
| Remarks | `remarks` | textarea | — | — | — |

**Business logic / rules:**
- **Depends on / extends:** Extends O35 MU Stock receiving; Material Inward entity is new
- **Proposed rule:** Shortfall = ordered - (received + now); shown in red, PO stays Part-received.
- **Proposed rule:** Only passed quantity increases MU stock. Failed goes to a "Quarantine" bucket; scrap writes off with a reason.
- **Proposed rule:** Over-receipt beyond a tolerance (proposed 0%) needs Inventory Manager approval.
- **Proposed rule:** Posted inward cannot be edited; corrections via a reversal entry.
- **Proposed rule:** Serial-tracked parts (battery, motor, controller) need one serial per piece.
- **Open question (proposed):** Is over-receipt ever allowed? What tolerance?
- **Open question (proposed):** Does a failed line trigger a debit note to the vendor in this release?
- **Proposal sources:** Spec N02 and gaps/procurement-to-material-inward.md.


### Production

#### [N03] Material Requisition (Against Order / Forecast / Damage)
**Priority:** P0 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Form · **Mode:** NEW

**Purpose (proposed):** Production asks Inventory for parts, prefilled from the BOM, for an order, a forecast, or loss/damage replacement.

**Proposed roles:** Production Head (request), Inventory Manager (issue) · **Proposed path:** `/production/requisitions/new`

**Buttons / Actions (proposed):** Load BOM, Add part, Remove line, Submit, Save draft, Cancel request

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Reason | `reason` | select | ✔ | Against order / Forecast / Damage replacement | — |
| Order | `orderId` | select | — | required when reason = order | — |
| Forecast period | `forecastPeriod` | month | — | required when reason = forecast | — |
| Vehicle model + variant | `modelId` | select | ✔ | drives BOM | — |
| Units to build | `units` | number | ✔ | >= 1 | BOM qty x units |
| BOM version | `bomVersionId` | select | ✔ | defaults to the Approved version (N09) | — |
| Lines: part | `lines[].productId` | select | ✔ | — | — |
| Required qty | `lines[].requiredQty` | number | ✔ | BOM x units, editable only for Damage | — |
| Available | `lines[].available` | number | — | live MU stock | — |
| Needed by | `neededBy` | date | ✔ | — | — |
| Damage note / photos | `damageNote` | textarea | — | required when reason = damage | — |

**Business logic / rules:**
- **Depends on / extends:** Depends on BOM (N08) to know required parts per model
- **Proposed rule:** Lines whose required qty exceeds available stock are flagged "Short" and can feed N25 reorder.
- **Proposed rule:** Damage requisitions need a note and a photo.
- **Proposed rule:** A requisition moves Requested, Issued (full or part), Closed; issue itself follows FIFO (N13).
- **Proposed rule:** Cannot request against an order that is not Approved.
- **Open question (proposed):** Can Production edit BOM quantities on an order requisition or only on Damage?
- **Proposal sources:** Spec N03; depends on N08.


#### [N04] Production Completion & Handover
**Priority:** P0 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Form / Action · **Mode:** NEW

**Purpose (proposed):** When a batch is built, capture each finished unit's identifiers and hand it to QC then Inventory. This is the screen that first binds a chassis to a vehicle.

**Proposed roles:** Production Manager (oem-production-mgr), Inventory Manager (receives) · **Proposed path:** `/production/complete, /production/units/:chassisNo`

**Buttons / Actions (proposed):** Select order / batch, Add unit, Scan / enter identifiers, Remove unit, Import CSV, Submit for QC, Hand over to inventory

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Order / batch | `orderId` | select | ✔ | only In-production | — |
| Model + variant | `variantId` | read-only | — | from order | — |
| Units completed | `unitsDone` | number | ✔ | <= remaining on order | — |
| Per unit: chassis no. | `units[].chassisNo` | text | ✔ | unique across all units; 17 chars (Tera sample ME9ECETEJ26499002) | Barcode scan allowed |
| Per unit: motor no. | `units[].motorNo` | text | ✔ | unique | Jitendra sample: 00W60VLM22G12226 |
| Per unit: controller no. | `units[].controllerNo` | text | ✔ | unique | Sample: JMT...F18721 |
| Per unit: battery no.(s) | `units[].batteryNo[]` | text list | ✔ | unique; count per model (1 or more) | Sample: TK-6034-16CW-C-008452 |
| Per unit: charger no. | `units[].chargerNo` | text | — | unique when present | Tera model sold "Without Battery & Charger" |
| Per unit: colour | `units[].colour` | select | ✔ | from variant colours | Sample: RED |
| Production date | `productionDate` | date | ✔ | <= today | — |
| Remarks | `remarks` | textarea | — | — | — |

**Business logic / rules:**
- **Depends on / extends:** Feeds Inventory (O30/O31) and QC (N05)
- **Proposed rule:** Every identifier must be unique across the whole system; duplicates are rejected with the unit that already uses it.
- **Proposed rule:** Units cannot be handed over until N05 QC passes; status Built then QC pending.
- **Proposed rule:** Handover posts the unit to Inventory (O30/O31) as In stock and creates the unit record.
- **Proposed rule:** Models sold without battery/charger have those fields optional (model flag).
- **Proposed rule:** Chassis cannot be edited after handover; fix via an authorised correction (audited).
- **Open question (proposed):** Chassis number format (VIN 17 chars?) and who generates it: factory stamp or the system?
- **Open question (proposed):** How many battery numbers per model?
- **Proposal sources:** Spec N04; Tera invoice (chassis in Notes); Jitendra invoice (battery, controller, motor, chassis per unit).


### QC

#### [N05] QC Inspection Checklist
**Priority:** P0 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Form · **Mode:** NEW

**Purpose (proposed):** Yes/No checklist per finished unit; a unit is released only when all mandatory items pass.

**Proposed roles:** Quality Control Manager (Ganesh per people.md) · **Proposed path:** `/qc/inspect/:chassisNo`

**Buttons / Actions (proposed):** Mark all Yes, Save, Pass unit, Fail unit (send to rework), Attach photo, Print QC sheet

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Chassis no. | `chassisNo` | read-only | — | from N04 | — |
| Checklist version | `templateId` | read-only | — | per model | — |
| Item (rows) | `items[].label` | text | — | e.g. frame welds, paint, brakes, lights, horn, throttle, display, motor run, controller, battery fit, charger, tyre pressure, fasteners torque | Template maintained by admin |
| Result | `items[].result` | Yes / No / N/A | ✔ | N/A only for non-applicable items | — |
| Mandatory | `items[].mandatory` | flag | — | read-only | — |
| Remark | `items[].remark` | text | — | required when No | — |
| Photo | `items[].photo` | file | — | optional | — |
| Inspector | `inspectorId` | read-only | — | logged-in user | — |
| Inspected on | `inspectedAt` | datetime | — | auto | — |
| Overall result | `overall` | Pass / Fail | ✔ | Pass only if no mandatory No | — |

**Business logic / rules:**
- **Depends on / extends:** Gated after Production Completion (N04)
- **Proposed rule:** Fail sends the unit back to Production with the failed items listed; re-inspection creates a new inspection record, the old one stays.
- **Proposed rule:** Pass moves the unit to QC passed and unlocks N06 and Inventory.
- **Proposed rule:** Inspector cannot be the user who completed production of the same unit (segregation).
- **Open question (proposed):** Please supply the actual checklist items per model, the draft above is generic.
- **Open question (proposed):** Should the rework loop be built now? (gaps/qc-and-packaging.md item 8)
- **Proposal sources:** Spec N05; gaps/qc-and-packaging.md.


#### [N06] QC Branding / Packaging Requisition
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Form / Action · **Mode:** NEW

**Purpose (proposed):** QC requests branding and packaging materials for a finished product from Inventory, using the BOM branding/packaging lines.

**Proposed roles:** Quality Control Manager (request), Inventory Manager (issue) · **Proposed path:** `/qc/packaging-requisition/new`

**Buttons / Actions (proposed):** Select unit(s), Load branding & packaging lines, Edit qty, Submit, Cancel

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Finished product / units | `unitIds[]` | multiselect | ✔ | units at QC passed | — |
| BOM version | `bomVersionId` | read-only | — | from N08/N09 | — |
| Lines: item | `lines[].productId` | select | ✔ | category Branding or Packaging only | Stickers, decals, carton, foam, manual, etc. |
| Qty per unit | `lines[].qtyPerUnit` | number | — | from BOM | — |
| Total qty | `lines[].qty` | number | ✔ | = qtyPerUnit x units | — |
| Needed by | `neededBy` | date | ✔ | — | — |
| Remarks | `remarks` | textarea | — | — | — |

**Business logic / rules:**
- **Depends on / extends:** Depends on BOM (N08) for branding/packaging line items
- **Proposed rule:** Lines come only from the BOM; adding a non-BOM item needs a reason.
- **Proposed rule:** Issue is FIFO (N13); the requisition closes when all lines are issued.
- **Proposed rule:** Cannot be raised for units not yet QC passed.
- **Open question (proposed):** Is branding/packaging a separate item category in Products, or flagged inside Accessories?
- **Proposal sources:** Spec N06; depends on N08.


### Orders

#### [N07] Despatch — Chassis Validation Gate
**Priority:** P0 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Action · **Mode:** Enhancement

**Purpose (proposed):** Starting from the invoice, check that each unit assigned to the order carries the right chassis and all identifiers before dispatch is allowed.

**Proposed roles:** Logistics Manager (oem-logistics-mgr) · **Proposed path:** `/orders/:id/despatch`

**Buttons / Actions (proposed):** Scan chassis, Validate all, Fix mismatch (reassign via O21), Proceed to PDI (N27), Proceed to dispatch (O22)

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Invoice no. | `invoiceNo` | read-only | — | e.g. INV26-27-TEV0001 | From the invoice |
| Order / dealer | `orderId` | read-only | — | — | — |
| Per line: model | `lines[].model` | read-only | — | Tera invoice: KAT LX 3.0 | — |
| Expected chassis | `lines[].expectedChassis` | read-only | — | from invoice notes / O21 | — |
| Scanned chassis | `lines[].scannedChassis` | text | ✔ | must equal expected | — |
| Motor / controller / battery | `lines[].ids` | text | ✔ | scanned, must match unit record (N04) | — |
| Result | `lines[].result` | badge | — | Match / Mismatch / Missing | — |

**Business logic / rules:**
- **Depends on / extends:** Extends O20/O21/O22; ties to the item-identifier gap
- **Proposed rule:** All units must be Match to continue; one Mismatch blocks the whole dispatch.
- **Proposed rule:** A chassis already dispatched or assigned to another order is rejected.
- **Proposed rule:** Needs N26 (OK to Bill) = Billed and N27 PDI = Pass before O22 is enabled.
- **Proposed rule:** Each validation attempt is audited with user and time.
- **Open question (proposed):** Is validation done per unit by scan or by typing? (assume scan with manual fallback)
- **Proposal sources:** Spec N07; Tera invoice (Chassis Number in Notes).


#### [N10] E-Way Bill (real build)
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `/e-waybill` · **Type:** Form · **Mode:** NEW

**Purpose (proposed):** Generate a GST-compliant e-way bill from the invoice and dispatch details, replacing the D51/O56 mock. Fields follow the sample e-way bill in docs/input.

**Proposed roles:** Logistics Manager, Accounts · **Proposed path:** `/orders/:id/e-waybill`

**Buttons / Actions (proposed):** Fetch from invoice, Generate e-way bill, Extend validity, Cancel e-way bill, Print / download, Update vehicle (Part-B)

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Supply type | `supplyType` | select | ✔ | Outward / Inward | Sample: Outward Supply |
| Transaction type | `transactionType` | select | ✔ | Regular / Bill To-Ship To / Bill From-Dispatch From | Sample: Bill To - Ship To |
| Document type / no. / date | `docType, docNo, docDate` | — | ✔ | Tax Invoice | Sample: EV/999/22-23, 27-Mar-23 |
| IRN, Ack no., Ack date | `irn, ackNo, ackDate` | text | — | from e-invoice | Sample prints all three |
| From (supplier) GSTIN | `fromGstin` | text | ✔ | — | — |
| Dispatch from address | `dispatchFrom` | text | ✔ | — | — |
| To (buyer) GSTIN | `toGstin` | text | ✔ | — | — |
| Ship to address | `shipTo` | text | ✔ | — | — |
| Goods: HSN | `items[].hsn` | text | ✔ | 8 digits | Sample 87149100; Tera invoice 87032420 |
| Goods: description, qty, unit, taxable value, tax rate | `items[]` | — | ✔ | — | — |
| Total taxable / CGST / SGST / IGST / other | `totals` | number | — | auto | — |
| Transport mode | `mode` | select | ✔ | Road / Rail / Air / Ship | Sample: 1 - Road |
| Approx distance (km) | `distanceKm` | number | ✔ | — |  Sample: 696 km |
| Transporter ID / name | `transporterId, transporterName` | text | — | Transporter ID is 15-char GSTIN | Sample: EKTA LOGISTICS |
| Vehicle no. | `vehicleNo` | text | ✔ | pattern like NL01AF5733 | Part-B |
| Generated by / on | `generatedBy, generatedAt` | auto | — | — | — |
| Valid upto | `validUpto` | datetime | — | auto from distance (1 day per 200 km) | Sample: 31-Mar-23 11:59 PM |
| E-way bill no. | `ewbNo` | read-only | — | 12 digits | Sample: 221568053022 |

**Business logic / rules:**
- **Depends on / extends:** Supersedes D51/O56
- **Proposed rule:** E-way bill is mandatory when consignment value exceeds the GST threshold; screen warns otherwise.
- **Proposed rule:** Validity: 1 day per 200 km (rounded up); extension allowed only near expiry, with reason.
- **Proposed rule:** Cancel allowed within 24 hours if not verified in transit.
- **Proposed rule:** Dispatch (O22) shows the e-way bill number and blocks departure when required and missing.
- **Proposed rule:** Provider integration (GSP) credentials kept in Settings > Security (O55).
- **Open question (proposed):** Which GSP/API provider for e-way and e-invoice (IRN)?
- **Open question (proposed):** Is e-invoice (IRN) in scope with this?
- **Proposal sources:** Spec N10; e-way bill page of "EV 999 MIC ELECTRONICS- BIKEWO.pdf".


#### [N26] Accounts — 'OK to Bill' Gate
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Action enhancement · **Mode:** Enhancement

**Purpose (proposed):** Accounts explicitly confirms billing after payment verification (O23). Dispatch cannot release the unit until this is done.

**Proposed roles:** Accounts (Finance) user · **Proposed path:** `/orders/:id/ok-to-bill`

**Buttons / Actions (proposed):** OK to Bill, Hold (with reason), Generate invoice, View payments

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Order | `orderId` | read-only | — | — | — |
| Dealer | `dealerId` | read-only | — | — | — |
| Order value | `orderTotal` | read-only | — | incl. GST | — |
| Verified payments | `verifiedTotal` | read-only | — | from O23 | Tera invoice shows "Payment Made" and "Balance Due" |
| Balance due | `balance` | read-only | — | — | — |
| Invoice no. | `invoiceNo` | auto | — | series INVyy-yy-TEVnnnn | From the Tera invoice numbering |
| Invoice date | `invoiceDate` | date | ✔ | default today | — |
| Terms | `terms` | select | ✔ | Due on Receipt / Net N days | — |
| Hold reason | `holdReason` | text | — | required for Hold | — |

**Business logic / rules:**
- **Depends on / extends:** Extends O20/O23
- **Note:** From ERP_changes_ceo.pptx slide 36.
- **Proposed rule:** Enabled only when payment is verified (O23) per the dealer's credit rule.
- **Proposed rule:** On OK to Bill the invoice is generated (CGST+SGST or IGST by place of supply) and the order becomes Billed.
- **Proposed rule:** Hold keeps dispatch locked and notifies the Logistics Manager.
- **Proposed rule:** Only Accounts users may click OK to Bill (separate from Verify, to keep two steps).
- **Open question (proposed):** Can a dealer with credit/ledger balance be billed before full payment?
- **Open question (proposed):** Invoice number series rules (financial-year reset)?
- **Proposal sources:** Spec N26 (slide 36); Tera invoice format.


#### [N27] PDI (Pre-Delivery Inspection) Checklist
**Priority:** P0 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Form · **Mode:** NEW

**Purpose (proposed):** Checklist at dispatch confirming PDI parts and packing before the unit ships. Different from N05, which gates production completion.

**Proposed roles:** PDI Manager (Ganesh per people.md), Logistics Mgr · **Proposed path:** `/dispatch/:orderId/pdi/:chassisNo`

**Buttons / Actions (proposed):** Mark all Yes, Save, Pass PDI, Fail PDI, Print PDI sheet

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Chassis no. | `chassisNo` | read-only | — | from assigned unit (O21) | — |
| Order / dealer | `orderId` | read-only | — | — | — |
| Items (rows) | `items[].label` | text | — | PDI parts present (mirrors, key, charger, tool kit, manual, warranty card), packing intact, no transit damage, battery charged level, tyre pressure | Template per model |
| Result | `items[].result` | Yes / No / N/A | ✔ | — | — |
| Remark | `items[].remark` | text | — | required on No | — |
| Photos | `photos[]` | file | — | up to 5 | — |
| Overall | `overall` | Pass / Fail | ✔ | — | — |
| Inspector / time | `inspectorId, at` | auto | — | — | — |

**Business logic / rules:**
- **Depends on / extends:** Extends N07 Despatch Chassis Validation Gate
- **Note:** From ERP_changes_ceo.pptx slide 36.
- **Proposed rule:** Dispatch (O22) is blocked for a unit until PDI = Pass.
- **Proposed rule:** Fail returns the unit to Reserved with the failed items; re-PDI creates a new record.
- **Proposed rule:** Sits after N26 OK to Bill and as part of N07.
- **Open question (proposed):** Exact PDI items and who owns the checklist template.
- **Proposal sources:** Spec N27 (ERP_changes_ceo slide 36).


### Production / BOM

#### [N08] BOM Create / Edit
**Priority:** P0 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Form · **Mode:** NEW

**Purpose (proposed):** Bill of Materials per vehicle model/variant: parts, quantities, images and landing price to the OEM. Basis for N03, N06 and N09.

**Proposed roles:** Production Head, Super Admin · **Proposed path:** `/production/bom/new, /production/bom/:id`

**Buttons / Actions (proposed):** Add part, Remove part, Duplicate BOM, Upload image, Save draft, Submit for approval, Print

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Model | `modelId` | select | ✔ | from Products (O26) | — |
| Variant | `variantId` | select | ✔ | one BOM per variant | — |
| BOM code | `bomCode` | text | ✔ | unique, e.g. BOM-KATLX30 | — |
| Version | `version` | read-only | — | auto (N09) | — |
| Effective from | `effectiveFrom` | date | ✔ | — | — |
| Lines: part | `lines[].productId` | select | ✔ | any Spare/Component/Branding/Packaging product | — |
| Category | `lines[].category` | select | ✔ | Frame, Electrical, Battery, Motor, Branding, Packaging, Other | — |
| Qty per unit | `lines[].qty` | number | ✔ | > 0 | — |
| UoM | `lines[].uom` | select | ✔ | Nos, Kg, Set, Metre | From N24 |
| Image | `lines[].image` | file | — | png/jpg, 2 MB | — |
| Landing price (OEM) | `lines[].landingPrice` | money | ✔ | >= 0, excl. GST | OEM-only; hidden from dealers (F1) |
| Total BOM cost | `totalCost` | read-only | — | sum(qty x price) | — |
| Notes | `notes` | textarea | — | — | — |

**Business logic / rules:**
- **Depends on / extends:** Prerequisite for N03, N06, N09
- **Proposed rule:** A part appears once per BOM; duplicates are rejected.
- **Proposed rule:** Landing price is visible to OEM Production/Finance roles only.
- **Proposed rule:** Only an Approved BOM version can be used by N03/N06.
- **Proposed rule:** Editing an Approved BOM creates a new draft version (N09), the old one stays in use until approval.
- **Open question (proposed):** Are sub-assemblies (nested BOM) needed or is a flat list enough?
- **Open question (proposed):** Where does landing price come from: last PO price, or typed by hand?
- **Proposal sources:** Spec N08.


#### [N09] BOM Versioning & Approval Workflow
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Form / Action · **Mode:** NEW

**Purpose (proposed):** Keep a history of BOM versions and require approval before a new version takes effect.

**Proposed roles:** Production Head (submit), Approver (open Q), Super Admin · **Proposed path:** `/production/bom/:id/versions`

**Buttons / Actions (proposed):** Submit for approval, Approve, Reject (reason), Compare versions, Restore as new draft, Retire version

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Version no. | `version` | read-only | — | v1, v2... | — |
| Status | `status` | badge | — | Draft / Pending approval / Approved / Rejected / Retired | — |
| Change summary | `changeNote` | textarea | ✔ | required on submit | — |
| Submitted by / on | `submittedBy, at` | auto | — | — | — |
| Approver | `approverId` | select | ✔ | role chosen by owner | — |
| Decision remark | `decisionRemark` | textarea | — | required on Reject | — |
| Effective from | `effectiveFrom` | date | ✔ | on approval | — |

**Business logic / rules:**
- **Depends on / extends:** Depends on N08
- **Open question:** Does every BOM change need versioning, or only material changes? Who is the approver — Production Head, QC, or OEM Admin?
- **Proposed rule:** Exactly one Approved version per variant is active at a time.
- **Proposed rule:** Approving a version retires the previous one from its effective date; requisitions already issued keep their version.
- **Proposed rule:** Submitter cannot approve their own version.
- **Proposed rule:** Compare shows added, removed and changed lines with quantity and price deltas.
- **Open question (proposed):** Does every BOM change need versioning or only material changes? (spec open question)
- **Open question (proposed):** Who approves: Production Head, QC, or OEM Admin? (spec open question)
- **Proposal sources:** Spec N09.


### Dealer Management

#### [N11] RBAC — Dealer & Sub-dealer Role Assignment
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Form enhancement · **Mode:** Enhancement

**Purpose (proposed):** Make role assignment explicit for a dealer, its staff and its connected sub-dealers.

**Proposed roles:** Super Admin (OEM), Dealer owner (for own staff and sub-dealers) · **Proposed path:** `In O05 dealer form and O53 user form; new tab "Roles & Hierarchy" on O06`

**Buttons / Actions (proposed):** Assign role, Remove role, Connect sub-dealer, Disconnect sub-dealer, Save

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Dealer type | `dealerType` | select | ✔ | Dealer / Distributor / Sub-dealer | — |
| Parent dealer | `parentDealerId` | select | — | required for Sub-dealer | R2 connection |
| Sub-dealers | `subDealers[]` | grid | — | connected dealers and status | — |
| User | `userId` | select | ✔ | — | — |
| Roles | `roles[]` | multiselect | ✔ | Dealer (owner), Sales Man, Service Man, Accounts (proposed) | Existing: Sales Man / Service Man / Dealer |
| Scope | `scope` | select | ✔ | Own dealer only / Own + sub-dealers (read-only) | Sub-dealer data visible upward read-only |
| Active | `active` | toggle | ✔ | — | — |

**Business logic / rules:**
- **Depends on / extends:** Extends O05 (Add/Edit Dealer) and O53 (user roles); builds on R2/R7
- **Proposed rule:** A sub-dealer's data is visible to its parent read-only; parents cannot edit it.
- **Proposed rule:** Only the owner role can assign roles to staff; staff cannot assign roles.
- **Proposed rule:** A sub-dealer has one parent at a time (R2).
- **Proposed rule:** Role change is audited and takes effect at next login.
- **Open question (proposed):** Is "Accounts" a new dealer-side role, or are only Sales/Service/Owner needed?
- **Open question (proposed):** Can a sub-dealer also have sub-dealers (depth limit)? See clarification_dealer_hierarchy_subdealers.md.
- **Proposal sources:** Spec N11; docs/clarification_dealer_hierarchy_subdealers.md.


### Warehouse

#### [N12] Warehouse Location Master
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Form / List · **Mode:** NEW

**Purpose (proposed):** Define zones, racks and bins for each manufacturing unit so stock can be placed and found.

**Proposed roles:** Inventory Manager, Super Admin · **Proposed path:** `/mu/:muId/locations`

**Buttons / Actions (proposed):** Add location, Edit, Deactivate, Bulk import (CSV), Print location labels

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Manufacturing unit | `muId` | select | ✔ | — | — |
| Zone | `zone` | text | ✔ | e.g. A, Cold, Battery cage | — |
| Rack | `rack` | text | — | — | — |
| Bin | `bin` | text | — | — | — |
| Location code | `code` | auto | ✔ | MU-ZONE-RACK-BIN, unique | — |
| Type | `type` | select | ✔ | Saleable / Internal-use / Quarantine / Scrap | Matches N14 and N02 quarantine |
| Capacity | `capacity` | number | — | units | — |
| Active | `active` | toggle | ✔ | — | — |

**Business logic / rules:**
- **Depends on / extends:** Prerequisite for N13
- **Proposed rule:** Code is unique within an MU.
- **Proposed rule:** A location with stock cannot be deactivated.
- **Proposed rule:** Quarantine and Scrap locations are never issued to dealers.
- **Open question (proposed):** Does capacity need to be enforced, or only informational?
- **Proposal sources:** Spec N12.


#### [N13] FIFO Stock Issuance & Location Report
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Report / Action · **Mode:** NEW

**Purpose (proposed):** Issue stock oldest-first from the correct location and report current stock by location.

**Proposed roles:** Inventory Manager, Inventory Executive · **Proposed path:** `/mu/:muId/stock-by-location, issue dialog on requisitions and orders`

**Buttons / Actions (proposed):** Issue (FIFO suggested), Override location (with reason), Export, Filter

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Product | `productId` | select | ✔ | — | — |
| Quantity to issue | `qty` | number | ✔ | <= available | — |
| Suggested pick (read-only) | `picks[]` | grid | — | location, lot/receipt date, qty — oldest first | — |
| Override reason | `overrideReason` | text | — | required if the pick differs | — |
| Report columns | — | — | — | Product, Location, Lot date, On-hand, Reserved, Available, Age (days) | Filters: MU, product, location, age |
| Serial no(s) | `serials[]` | text list | — | for serial-tracked items | — |

**Business logic / rules:**
- **Depends on / extends:** Depends on N12; significant change to existing Inventory issuance
- **Proposed rule:** Default pick order is by inward date (oldest first), then location code.
- **Proposed rule:** Reserved stock (assigned to an order) is excluded from issuance for other uses.
- **Proposed rule:** Override is allowed to Inventory Manager only and audited.
- **Proposed rule:** Quarantine, Scrap and Internal-use (N14) locations are excluded from dealer-facing availability.
- **Open question (proposed):** FIFO by receipt date or by manufacturing date for batteries?
- **Proposal sources:** Spec N13; depends on N12.


### Products

#### [N14] Inventory Type Flag (Internal-use vs Saleable)
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Form enhancement · **Mode:** Enhancement

**Purpose (proposed):** Flag products as Saleable or Internal-use; internal-use items never appear in dealer-facing inventory or purchase carts.

**Proposed roles:** Super Admin, Inventory Manager · **Proposed path:** `Field on O26-O28 product forms; filter on O30/O31`

**Buttons / Actions (proposed):** Toggle on product form, Filter by type (inventory lists)

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Inventory type | `inventoryType` | select | ✔ | Saleable / Internal-use (names are placeholders) | Default Saleable |
| Where shown | — | — | — | Product forms, OEM inventory lists, product list column | — |
| Filter | `type filter` | select | — | All / Saleable / Internal-use | — |

**Business logic / rules:**
- **Depends on / extends:** Extends O25-O28 (Products) and O30/O31 (Inventory)
- **Open question:** Terminology to be finalized — client flagged the current naming as a placeholder.
- **Proposed rule:** Internal-use products are excluded from D24/D25, the purchase cart (D29) and quotations (D12).
- **Proposed rule:** Switching an item with dealer reservations to Internal-use is blocked.
- **Proposed rule:** BOM lines (N08) may use either type.
- **Open question (proposed):** Final terminology (spec open question).
- **Proposal sources:** Spec N14.


#### [N24] Spare Part — Extended Fields (UoM, weight, material, multi-model, purchase cost, price history)
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Form enhancement · **Mode:** Enhancement

**Purpose (proposed):** Add procurement and physical attributes, multi-model applicability and a price-change history to spare parts.

**Proposed roles:** Super Admin, Procurement Mgr · **Proposed path:** `Extra section in O27 spare form`

**Buttons / Actions (proposed):** Add model, Remove model, Add price revision, View history

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Supplier part number | `supplierPartNo` | text | — | — | — |
| UoM | `uom` | select | ✔ | Nos / Kg / Set / Metre | — |
| Weight | `weight` | number | — | kg, 3 decimals | — |
| Material | `material` | select | — | Metal / Mixed metal / Plastic / ABS | — |
| Applicable models | `modelIds[]` | multiselect | ✔ | one or more (today O27 allows one) | — |
| Purchase cost (excl. GST) | `purchaseCost` | money | — | separate from sale price | OEM-only (F1) |
| Freight | `freight` | select | — | Included / Excluded | — |
| Price revisions | `priceHistory[]` | grid | — | date, old, new, reason, proof file; latest 10 kept | Tera invoice: "Rate" separate from tax |

**Business logic / rules:**
- **Depends on / extends:** Extends O27
- **Note:** From ERP_changes_ceo.pptx slide 23.
- **Proposed rule:** Purchase cost is never shown to dealers.
- **Proposed rule:** Each price change must carry a proof attachment; history keeps the last 10 revisions.
- **Proposed rule:** Removing a model that has open orders for that part is blocked.
- **Open question (proposed):** Is the "last 10 revisions" limit a display limit or are older ones deleted?
- **Proposal sources:** Spec N24 (slide 23).


### Settings

#### [N15] Audit Log — Purge / Retention Policy
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Form / Action enhancement · **Mode:** Enhancement

**Purpose (proposed):** Set how long audit rows are kept and purge older ones.

**Proposed roles:** Super Admin only · **Proposed path:** `/settings/audit-logs/retention`

**Buttons / Actions (proposed):** Save retention, Preview purge, Purge now, Download before purge

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Retention period | `retentionMonths` | number | ✔ | minimum 12 (proposed) | — |
| Purge records older than | `purgeBefore` | date | ✔ | <= today minus retention | — |
| Records affected | `count` | read-only | — | from preview | — |
| Confirm text | `confirm` | text | ✔ | type PURGE | Prevents accidents |
| Reason | `reason` | text | ✔ | — | — |

**Business logic / rules:**
- **Depends on / extends:** Extends O54
- **Proposed rule:** Super Admin only; the purge itself writes one non-deletable audit row.
- **Proposed rule:** Preview is mandatory before Purge now.
- **Proposed rule:** Offer an export of the rows before purge (N16).
- **Proposed rule:** Rows tied to open warranty/legal holds are skipped.
- **Open question (proposed):** Minimum retention allowed by policy/legal?
- **Open question (proposed):** Automatic scheduled purge or manual only?
- **Proposal sources:** Spec N15.


#### [N16] Audit Log — Customer Export / Download
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Action enhancement · **Mode:** Enhancement

**Purpose (proposed):** Let a customer organisation download its own audit trail.

**Proposed roles:** Customer admin (the OEM/dealer account owner) · **Proposed path:** `Export button on O54 audit list`

**Buttons / Actions (proposed):** Export CSV, Export PDF, Choose date range, Choose columns

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| From / To | `dateFrom, dateTo` | date | ✔ | range <= 12 months per export | — |
| Entity type | `entity` | select | — | All / Orders / Payments / Users / ... | — |
| User | `userId` | select | — | — | — |
| Format | `format` | select | ✔ | CSV / PDF | — |
| Columns | `columns[]` | multiselect | — | time, user, entity, action, before, after, IP | — |

**Business logic / rules:**
- **Depends on / extends:** Extends O54
- **Proposed rule:** An export contains only the requester's own tenant data (RLS).
- **Proposed rule:** PII fields in before/after values are masked unless the role allows.
- **Proposed rule:** The export itself is an audit event.
- **Proposed rule:** Large exports run in the background and arrive as a notification link.
- **Open question (proposed):** Who counts as the "customer": OEM Super Admin only, or dealer owners for their own dealer too?
- **Proposal sources:** Spec N16.


#### [N22] OEM Profile — Compliance Fields & Edit
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Form enhancement · **Mode:** Enhancement

**Purpose (proposed):** Add statutory fields and make the OEM profile editable.

**Proposed roles:** Super Admin · **Proposed path:** `/settings/profile (extends O49)`

**Buttons / Actions (proposed):** Edit, Save, Cancel, Add director, Remove director, Upload document

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| CIN | `cin` | text | — | 21 chars | — |
| TAN | `tan` | text | — | 10 chars | — |
| PAN | `pan` | text | ✔ | 10 chars, ABCDE1234F | Tera invoice shows GSTIN 33AAMCT1837D1ZH, so PAN AAMCT1837D |
| GSTIN | `gstin` | text | ✔ | 15 chars; N01 lookup | — |
| MSME / Udyam no. | `msme` | text | — | — | — |
| IEC | `iec` | text | — | 10 chars | Jitendra invoice prints IEC code |
| Directors | `directors[]` | grid | — | name, DIN (8 digits), designation, phone | — |
| Bank details | `bank` | group | — | as N23 | Tera invoice bank block |
| Approval email | `approvalEmail` | email | ✔ | existing field | — |
| Website / support email / phone | — | text | — | — | Tera invoice: www.teraev.in, accounts@teraev.in, phone |

**Business logic / rules:**
- **Depends on / extends:** Extends O49
- **Note:** From ERP_changes_ceo.pptx slide 4.
- **Proposed rule:** PAN must match the PAN embedded in the GSTIN.
- **Proposed rule:** Edits by Super Admin only; every change is audited with before/after.
- **Proposed rule:** Statutory values appear on printed invoices and the e-way bill (N10).
- **Open question (proposed):** Is the OEM profile editable by anyone besides Super Admin?
- **Proposal sources:** Spec N22 (slide 4); Tera invoice header/footer.


#### [N28] Expanded OEM Role Taxonomy (Procurement/Inventory Manager, National/Area Sales)
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Form enhancement · **Mode:** Enhancement

**Purpose (proposed):** Add Procurement Manager, Inventory Manager, National Sales Head and Area Sales Manager roles.

**Proposed roles:** Super Admin · **Proposed path:** `/settings/users/new (role list on O53)`

**Buttons / Actions (proposed):** Assign role, Edit role permissions (view only in v1), Save

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Role | `role` | select | ✔ | existing + Procurement Manager, Inventory Manager, National Sales Head, Area Sales Manager | — |
| Reports to | `reportsTo` | select | — | National Sales Head > Sales Head > Regional Head > Zonal Head > Area Sales Manager | — |
| Region / zone scope | `scope` | multiselect | — | required for Regional/Zonal/Area roles | O51 |
| Permissions summary | — | read-only | — | lists screens the role can see | Proposed matrix below |

**Business logic / rules:**
- **Depends on / extends:** Extends O53 role list
- **Note:** From ERP_changes_ceo.pptx slide 4.
- **Proposed rule:** Procurement Manager: vendors, vendor POs, reorder (N25), BOM view.
- **Proposed rule:** Inventory Manager: inventory, warehouse (N12/N13), material inward (N02), requisitions issue (N03/N06).
- **Proposed rule:** Sales hierarchy sees only the dealers in their zone/region (R7 extended).
- **Proposed rule:** A user can hold one primary role; multi-role needs owner decision.
- **Open question (proposed):** Please confirm the permission matrix; the one above is a first guess from the screen names.
- **Open question (proposed):** Can one person hold two roles (e.g. Production + QC + PDI as Ganesh in people.md)?
- **Proposal sources:** Spec N28 (slide 4); docs/people.md.


### Vendor POs

#### [N17] Auto-email PO to Vendor on Approval
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Action enhancement · **Mode:** Enhancement

**Purpose (proposed):** When a vendor PO is approved, email the PO PDF to the vendor automatically.

**Proposed roles:** System (trigger), Procurement Mgr (settings) · **Proposed path:** `Settings on O41; log on vendor PO detail`

**Buttons / Actions (proposed):** Resend email, Edit recipients, View email log, Toggle auto-send

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Auto-send on approval | `autoSend` | toggle | ✔ | default on | — |
| To | `to[]` | email list | ✔ | default = vendor primary contact (N23) | — |
| CC | `cc[]` | email list | — | default = approver + buyer | — |
| Subject / body | `subject, body` | text | — | template with PO no., vendor, total | — |
| Attachment | `pdf` | auto | — | PO PDF | — |
| Send status | `status` | badge | — | Queued / Sent / Failed | Log: time, recipient, error |

**Business logic / rules:**
- **Depends on / extends:** Extends O41; distinct from the existing internal approval-admin email
- **Open question:** What happens if the PO is changed after approval and re-approved — does the vendor get a revised email automatically?
- **Proposed rule:** Sent once on first approval; failures retry 3 times then show Failed with a Resend button.
- **Proposed rule:** Distinct from the internal approval-admin email.
- **Proposed rule:** Not sent for backdated POs (N18).
- **Open question (proposed):** If the PO changes after approval and is re-approved, send a revised email automatically? (spec open question)
- **Proposal sources:** Spec N17.


#### [N25] Min-Stock / Sales-Forecast Triggered Reorder
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Report / Action · **Mode:** NEW

**Purpose (proposed):** Flag products below a minimum level, or short against a sales forecast, and feed them into Vendor Procurement (O40).

**Proposed roles:** Procurement Manager · **Proposed path:** `/vendors/reorder, widget on O40`

**Buttons / Actions (proposed):** Set min level, Set forecast, Create vendor PO from selected, Dismiss alert, Recalculate

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Product | `productId` | select | ✔ | — | — |
| MU | `muId` | select | ✔ | — | — |
| Minimum stock | `minQty` | number | ✔ | >= 0 | — |
| Reorder qty | `reorderQty` | number | — | default suggestion | — |
| Forecast qty (period) | `forecastQty` | number | — | monthly, manual entry | No AI forecasting (deferred) |
| On hand / on order | `onHand, onOrder` | read-only | — | — | — |
| Suggested qty | `suggested` | read-only | — | max(min - (onHand+onOrder), forecast - (onHand+onOrder)) | — |
| Preferred vendor | `vendorId` | select | — | default from last PO | — |

**Business logic / rules:**
- **Depends on / extends:** Extends O40; the min-stock trigger is independent of AI demand forecasting (deferred)
- **Note:** From ERP_changes_ceo.pptx slide 26. Keep the simple min-stock-threshold version in scope even though full demand forecasting is deferred.
- **Proposed rule:** An alert is raised when onHand + onOrder < min or < forecast.
- **Proposed rule:** Alerts are de-duplicated per product per MU until dismissed or resolved.
- **Proposed rule:** Create PO prefills O40/O41 lines; user still approves the PO.
- **Proposed rule:** Quarantine and Internal-use stock does not count toward onHand (N12/N14).
- **Open question (proposed):** Alert only on screen, or also email/WhatsApp to Procurement?
- **Proposal sources:** Spec N25 (slide 26).


### Orders / Material Inward

#### [N18] Backdated Data Entry Support (PO, Material Inward)
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Enhancement · **Mode:** Enhancement

**Purpose (proposed):** Allow historical-dated PO and Material Inward records while migrating old data.

**Proposed roles:** Super Admin (enable), data-entry users (use) · **Proposed path:** `Date field on O20/O17 PO and N02, plus Settings > Data Migration`

**Buttons / Actions (proposed):** Enable backdating (Settings), Set cut-off date, Disable

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Backdating enabled | `backdateEnabled` | toggle | ✔ | Super Admin only | — |
| Earliest allowed date | `backdateFrom` | date | ✔ | not earlier than company go-live minus N years | — |
| Entry date on PO / inward | `docDate` | date | ✔ | past dates allowed only when enabled | — |
| Reason | `backdateReason` | text | ✔ | required when date < today | — |

**Business logic / rules:**
- **Depends on / extends:** Extends O20/O17 and N02
- **Proposed rule:** Backdated records are flagged "Backdated" and show both entry date and document date.
- **Proposed rule:** Backdated records do not trigger notifications, WhatsApp (N19) or auto-email (N17).
- **Proposed rule:** Closed financial periods are never backdatable.
- **Proposed rule:** Stock ledger uses the document date for FIFO order (N13).
- **Open question (proposed):** Is there a hard cut-off, e.g. no earlier than start of last financial year?
- **Proposal sources:** Spec N18.


### Communications

#### [N19] WhatsApp — Order / Delivery / Due Notifications (Dealer)
**Priority:** P0 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Integration · **Mode:** NEW

**Purpose (proposed):** Send dealers a WhatsApp message on order accepted, order delivered, and outstanding dues.

**Proposed roles:** System; Super Admin (templates & settings) · **Proposed path:** `/settings/whatsapp, message log`

**Buttons / Actions (proposed):** Edit template, Send test, Enable/disable event, Resend, View log

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Event | `event` | select | ✔ | Order accepted / Delivered / Due reminder | — |
| Template name | `template` | text | ✔ | pre-approved by WhatsApp | — |
| Message variables | `vars` | — | — | dealerName, orderNo, amount, dueDate, link | — |
| Recipient number | `phone` | phone | ✔ | dealer WhatsApp number (D16 has WhatsApp field) | E.164 |
| Reminder schedule | `dueSchedule` | text | — | e.g. 3 days before, on due, every 7 days after | — |
| Status | `status` | badge | — | Queued / Sent / Delivered / Failed | — |
| Credits left | `credits` | read-only | — | of 20k (client quotation) | — |

**Business logic / rules:**
- **Depends on / extends:** Confirmed in scope in the client quotation (TCO includes 20k WhatsApp credits)
- **Proposed rule:** Only approved templates can be sent.
- **Proposed rule:** No message if the dealer has opted out; opt-in captured at onboarding.
- **Proposed rule:** Retry failed once, then log Failed.
- **Proposed rule:** Stop reminders when the due is paid.
- **Proposed rule:** Backdated entries (N18) send nothing.
- **Open question (proposed):** WhatsApp provider (Meta Cloud API or reseller)?
- **Open question (proposed):** Opt-in capture: at dealer onboarding (O05)?
- **Proposal sources:** Spec N19.


#### [N20] WhatsApp — Employee Broadcast
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Integration · **Mode:** NEW

**Purpose (proposed):** Send operational messages to employees by WhatsApp.

**Proposed roles:** Super Admin, Department heads · **Proposed path:** `/communications/broadcast`

**Buttons / Actions (proposed):** Select audience, Send, Schedule, Save as template, View log

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| Audience | `audience` | multiselect | ✔ | All / role / MU / custom list | — |
| Message | `message` | textarea | ✔ | template or free text within WhatsApp rules | — |
| Attachment | `attachment` | file | — | PDF/image | — |
| Send time | `sendAt` | datetime | — | now or scheduled | — |
| Recipients count | `count` | read-only | — | — | — |
| Delivery log | `log` | grid | — | per user: status | — |

**Business logic / rules:**
- **Depends on / extends:** Same WhatsApp integration as N19
- **Proposed rule:** Uses the same integration and credits as N19.
- **Proposed rule:** Employees without a WhatsApp number or opt-in are skipped and listed.
- **Proposed rule:** Only authorised roles may broadcast; each send is audited.
- **Open question (proposed):** Should it also show as an in-app notification (D00/O00)?
- **Proposal sources:** Spec N20.


### Manufacturing Unit

#### [N21] Unit Asset Register (Fixed/Movable)
**Priority:** P1 · **Status:** New requirement (details proposed, pending owner approval)

**Path:** `—` · **Type:** Form / List · **Mode:** NEW

**Purpose (proposed):** Track fixed and movable assets per manufacturing unit.

**Proposed roles:** Super Admin, Inventory Manager · **Proposed path:** `/mu/:muId/assets`

**Buttons / Actions (proposed):** Add asset, Edit, Retire asset, Transfer to another MU, Add asset type, Export

**Fields (proposed):**

| Label | API field | Type | Req | Options / validation | Notes |
|---|---|---|---|---|---|
| MU | `muId` | select | ✔ | — | — |
| Asset tag | `assetTag` | auto | ✔ | unique | — |
| Name | `name` | text | ✔ | — | — |
| Class | `class` | select | ✔ | Fixed / Movable | — |
| Asset type | `assetType` | select | ✔ | admin-extensible dropdown | Add asset type button |
| Make / model / serial | `make, model, serial` | text | — | — | — |
| Purchase date / cost | `purchaseDate, cost` | — | — | — | — |
| Location | `locationId` | select | — | from N12 | — |
| Status | `status` | select | ✔ | In use / Under repair / Retired | — |
| Photo / invoice | `files[]` | file | — | — | — |

**Business logic / rules:**
- **Depends on / extends:** Extends O32-O34
- **Note:** From ERP_changes_ceo.pptx slide 2 — missed in the first new_features.md-based pass, added on verification.
- **Proposed rule:** Asset tag cannot be reused.
- **Proposed rule:** Retire needs a reason and date; retired assets stay in history.
- **Proposed rule:** Transfer records from-MU, to-MU and date.
- **Open question (proposed):** Is depreciation needed, or register only?
- **Proposal sources:** Spec N21 (slide 2).

