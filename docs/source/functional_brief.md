# Tera EV OEM & Dealer Platform — Functional Brief

**Purpose of this document:** a functional-level map of what the system does, who uses it, and how its parts connect — pitched above the field-by-field detail. For exact fields, validation, and API shapes, see `docs/analysis/combined_spec_v2.md`. For cost/complexity per screen, see `docs/EV_App_Screens_Estimation.xlsx`.

**System in one paragraph:** Two web applications — an **OEM Portal** and a **Dealer Portal** — share one backend and one database. There is no integration layer between them because there doesn't need to be: a purchase order, a payment, a warranty claim is a single record both apps read and act on, each permitted to move it through different stages. The OEM manufactures and sells through a multi-tier dealer network (OEM → Distributor → Sub-dealer), each dealer attached to one Manufacturing Unit that acts as their stock source, dispatch origin, and invoice letterhead.

---

## 1. Who uses the system

| Side | Role | What they're here to do |
|---|---|---|
| Dealer | **Dealer (owner)** | Everything: buy from OEM, sell to customers, manage staff, see money |
| Dealer | **Salesman** | Enquiries, customers, quotations, inventory viewing |
| Dealer | **Serviceman** | Customers, warranty, service jobs |
| OEM | **Admin** | Full control — the only role that can create dealers, products, or users |
| OEM | **Sales (Head / Regional / Zonal)** | Approve/assign/dispatch orders, see dealers (scoped by assignment or region) |
| OEM | **Accounts / Finance** | Verify payments, manage ledgers |
| OEM | **Production (Head / Manager)** | *(new)* Requisition materials, run the build, hand off finished units |
| OEM | **Dispatch (Head / Manager)** | Assign stock to orders, dispatch shipments |
| OEM | **Issue Manager** | Review and settle dealer-reported shipment issues |
| OEM | **Service (Head / Engineer)** | Handle warranty claims raised to the OEM |
| OEM | **Inventory Executive** | *(new)* Receive and QC-check incoming material |
| OEM | **QC** | *(new)* Inspect finished units, request branding/packaging |

A dealer's **type** (Distributor / Divisional Distributor / District Dealer / Area Dealer) sets their price tier and who they're allowed to buy from — a Distributor also sees an "Orders as seller" view, because the same order object serves OEM→Distributor and Distributor→Sub-dealer sales using identical screens.

---

## 2. Functional modules

Each module below states its purpose, who touches it, and — the part this document is for — **what it connects to and why**.

### 2.1 Dealer Onboarding & Profile
**Purpose:** Bring a dealer into the network with its commercial terms, banking, and org structure.
**Who:** OEM Admin creates; the dealer can only edit password, shop location, and documents afterward — everything else is OEM-owned.
**Connects to:** Regions & Zones (a dealer must pick both) → Manufacturing Unit (sets their seller/letterhead) → User creation (the dealer's login is created in the same step) → Ledger (a dealer is typically attached to a shared credit ledger).
*New in this build:* explicit role assignment for dealers and their connected sub-dealers (formalizing what currently exists only implicitly through dealer-connections).

### 2.2 Product Catalog & Pricing
**Purpose:** Define what's sellable — vehicles, spares, accessories, and components (battery/charger/motor/controller) — and at what price.
**Who:** OEM Admin only creates/edits; everyone else just reads their slice.
**Connects to:** Manufacturing Unit (products are switched on per-unit) → Vendors (spares/components link to a supplier) → Inventory (every product has a stock record per unit) → Pricing cascades into every Order, Invoice, and Quotation downstream.
**Key rule:** each vehicle variant carries **five** prices (Distributor / Divisional Distributor / District Dealer / Area Dealer / Customer) — a dealer only ever sees their own tier plus the customer-facing price. This pricing model is the single most load-bearing business rule in the system; it touches Purchasing, Sales, and every mirror screen on the OEM side.

### 2.3 Inventory & Stock
**Purpose:** Track what physically exists, where, and in what state.
**Who:** OEM Admin/Production manage OEM-side stock; dealers see their own stock as a simple quantity.
**Connects to:** Products (what's being tracked) → Manufacturing Unit (stock is always scoped to a unit) → Orders (reservation happens automatically once 30% of an order is paid) → Dispatch (stock is deducted on shipment) → *(new)* Warehouse locations (which bin/rack it physically sits in) and FIFO issuance (oldest stock issued first).
**Key gap this build must close:** in the reference app, nothing binds a specific chassis/serial number to a specific vehicle until the dealer types it in at the point of customer sale. This build closes that gap earlier — at **Production Completion** (new) and reinforced at the **Dispatch Chassis Validation Gate** (new) — so a serial is traceable from the moment it's built, not just from the moment it's sold.

### 2.4 Manufacturing Operations *(substantially new)*
**Purpose:** Turn requisitioned material into finished, QC-passed, identifiable vehicles.
**Who:** Production Head/Manager, Inventory Executive, QC.
**The flow, and why each step connects to the next:**
1. **BOM** (new) defines what parts, in what quantity, build one unit of a model — this is the master data every downstream step reads from.
2. **Material Inward** (new, far more detailed than the reference app's flat "receive" step): Inventory Executive checks received quantity against the PO, reports shortfall, QC-checks each item, marks scrap. Feeds real stock into the system.
3. **Material Requisition** (new): Production requests materials from Inventory — against a specific order, a forecast, or to replace loss/damage — reading quantities straight from the BOM.
4. **Production Completion & Handover** (new): on finishing a build, Production captures the chassis/motor/battery/controller identifiers and hands the unit to Inventory. This is where a vehicle becomes a traceable, serialized asset.
5. **QC Inspection Checklist** (new): yes/no checklist gate before a unit can move further.
6. **QC Branding/Packaging Requisition** (new): QC pulls branding/packaging items from Inventory, per the BOM, before release.
7. Only after this chain does a unit become eligible for **Dispatch**.

This whole module is the biggest net-new piece of scope in the system — it didn't exist in the reference app at all, and it's the backbone that the chassis-traceability gap (2.3) and the Dispatch gate (2.7) both depend on.

### 2.5 Purchasing (Dealer → Seller)
**Purpose:** A dealer orders vehicles/spares/accessories from its seller (OEM or a higher-tier dealer).
**Who:** Dealer (buyer) initiates; OEM or the seller-dealer approves and fulfills.
**Connects to:** Product Catalog (live stock + tier pricing drive the cart) → Payments (an order needs a payment before it moves) → Inventory (stock reserves automatically at 30% paid) → Production/Dispatch (the order drives what gets built and shipped) → Ledger (any overpayment or cancellation credit flows here).
**Key rule:** order quantities must total 16, 20, 32, or 40 units — a hard business constraint on the cart, not just a UI nicety.
**Status lifecycle:** pending → approved → advance paid → production started (at ≥30%) → payment verified → assigned (serials/MU) → dispatched (partial or full) → delivered. Each transition is owned by a specific side — see `combined_spec_v2.md` §4 for the full table of who moves what.

### 2.6 Payments & Ledger
**Purpose:** Collect and verify money against orders; manage shared credit pools.
**Who:** Dealer submits (receipt OCR or ledger draw-down); OEM verifies.
**Connects to:** Orders (payment status gates almost every order transition) → Inventory (verified payment ≥30% triggers stock reservation) → Ledger (any surplus is automatically credited back) → Warranty (service charges follow the same verify/reject pattern).
**Known gap carried forward deliberately:** the reference app's ledger top-up has no proof-upload requirement even though order payments do (OCR receipt). Worth deciding whether to close this gap or keep it.

### 2.7 Dispatch & Logistics
**Purpose:** Get a built, QC-passed, paid-for unit from the Manufacturing Unit to the dealer.
**Who:** OEM Dispatch Head/Manager assigns and ships; the dealer confirms or rejects receipt.
**Connects to:** Manufacturing Operations (a unit must have cleared QC) → Inventory (stock deducts on shipment) → Orders (moves the order to Dispatched/Delivered) → Issues (a dealer can report a problem at the point of receipt, which opens an Issue record).
*New in this build:* a **Chassis Validation Gate** — dispatch starts from the invoice and validates every identifier before a unit can be assigned, closing the loop that Manufacturing Operations (2.4) opens.

### 2.8 Sales CRM (Dealer-owned)
**Purpose:** The dealer's own sales pipeline — enquiry through to a paying, serviced customer.
**Who:** Entirely dealer-owned (create/edit/delete); the **OEM only ever sees a read-only mirror** of this data (customers, invoices, payments, services, warranty claims) through the Dealer Detail screens.
**Flow:** Enquiry (HOT/WARM/COLD) → Quotation → convert to Customer → Sale Invoice (this is also where a chassis number is bound to a customer, per 2.3) → Customer Payment → optional Service/Warranty relationship going forward.
**Why the Mirror distinction matters functionally, not just for cost:** the OEM genuinely cannot create or edit a dealer's customer record — if OEM staff need to act on dealer-side CRM data, that has to happen through the dealer, not around them. This is a deliberate business boundary, not a missing feature.

### 2.9 Issues & Warranty
**Purpose:** Handle problems — shipment damage/shortage (Issues) and post-sale product defects (Warranty) — through a staged review process.
**Who:** Dealer raises; OEM (Issue Manager / Service roles) reviews and resolves.
**Issues flow:** dealer reports → manager review → OEM approval → settle with money or replace.
**Warranty flow:** dealer raises (to OEM or to its own service team) → OEM verifies → inspects → services or replaces (stock-checked; replacement blocked if no stock) → optional service charge (dealer pays, OEM verifies) → return logistics → complete.
**Connects to:** Inventory (replacement stock is deducted) → Ledger/Payments (settlement money and service charges flow through the same verify pattern as everywhere else) → Customer record (a warranty claim is always tied to a specific customer + chassis + sale).

### 2.10 Service Management (Dealer-owned)
**Purpose:** Track paid/free service jobs against a customer's vehicle.
**Who:** Dealer only; OEM sees a read-only mirror.
**Connects to:** Customer/Sales CRM (a service job is always against a known customer and vehicle) → Sale Invoice (completing a service job opens a SERVICE-type invoice, priced from the dealer's own service price list).

### 2.11 Vendor & Procurement
**Purpose:** The OEM's own upstream purchasing — sourcing parts from external suppliers.
**Who:** OEM only; no dealer visibility.
**Connects to:** Product Catalog (spares/components link to a vendor) → Material Inward (2.4) (what arrives against a vendor PO is what gets received and QC-checked) → *(new)* GST Lookup (auto-fill vendor details from GSTIN) and *(new)* auto-email of the approved PO to the vendor.

### 2.12 Compliance (Invoicing, GST, E-Way Bill, Audit)
**Purpose:** Keep the system defensible for tax and governance purposes.
**Covers:** GST-compliant sale and purchase invoicing (already functional in the base flow), a **real E-Way Bill module** (new — the reference app only has a non-functional mock), and the Audit Log, which records every create/update/delete with a field-level diff.
*New in this build:* audit log **purge** (super-admin-only retention policy) and **customer export/download** of their own audit trail.
**Connects to:** everything — the audit log is a passive observer wired into every write across every module, not a module with its own data flow.

### 2.13 Warehouse Management *(new)*
**Purpose:** Know exactly where stock physically sits, and issue the oldest stock first.
**Who:** OEM Inventory/Production.
**Connects to:** Inventory (2.3) directly — this isn't a bolt-on report, it changes how stock issuance actually works across the existing Inventory and MU Stock screens, enforcing FIFO rather than arbitrary pick order.

### 2.14 Communications
**Purpose:** Push information outward — to dealers and to employees.
**Covers:** Announcements (OEM-authored, targeted by Manufacturing Unit, mirrored read-only to dealers), in-app Notifications (polled, deep-linking to the relevant record), and *(new)* **WhatsApp** — order-accepted/delivered/outstanding-due messages to dealers, and operational broadcasts to employees.

### 2.15 Settings, Security & Access Control
**Purpose:** Who can do what, and to which rows of data.
**Covers:** Regions & Zones, Operating States, User management (OEM has 15 distinct roles; a sales user with no dealers ticked under "Assigned Dealers" sees *no* dealers at all — a real, verbatim rule, not a default), device/session limits, and the audit log.
**The security model in one sentence:** every screen's data is filtered three independent ways — **which rows** you can see (your dealer, your assigned dealers, your manufacturing unit), **which fields** within a row (e.g. a dealer never sees another tier's price), and **which actions** you're allowed to take (view vs. approve vs. edit). All three are currently only verifiable as UI behavior in the reference app — the build must enforce all three **server-side**, independent of what the client sends. Full rule-by-rule detail is in `combined_spec_v2.md` §2.

---

## 3. End-to-end flows (how the modules actually connect in practice)

**Order-to-cash** (the system's central flow):
Dealer builds a cart against live stock + their price tier (2.5) → places order → pays (2.6) → OEM approves and verifies payment → stock reserves automatically at 30% paid (2.3) → Production builds against the order (2.4) → QC clears it → Dispatch validates and ships (2.7) → dealer confirms receipt → any shipment problem opens an Issue (2.9).

**Sale-to-service** (dealer-side, OEM watching read-only):
Enquiry → Quotation → Customer (2.8) → Sale Invoice binds a chassis to this customer (2.3) → Customer Payment (2.6) → later: Service jobs (2.10) and/or Warranty claims (2.9) reference this same customer + chassis.

**Build-to-traceable-unit** (new in this build, closes a real gap):
BOM (2.4) defines requirements → Material Inward receives and QC-checks parts (2.4) → Production requisitions against an order/forecast/damage (2.4) → Production Completion captures serials (2.4, resolves 2.3's gap) → QC checklist + branding requisition (2.4) → Dispatch Chassis Validation Gate re-confirms identifiers before shipment (2.7).

**Onboarding-to-first-order:**
OEM creates Region/Zone → creates Manufacturing Unit → creates Dealer (2.1, attached to MU + region/zone + ledger) → creates dealer login → dealer logs in, sees its tier's catalog (2.2) → places its first Purchase Order (2.5).

---

## 4. Reading this alongside the other documents

| Document | What it's for |
|---|---|
| `docs/analysis/combined_spec_v2.md` | Field-by-field, screen-by-screen ground truth — the authoritative source this brief is distilled from |
| `docs/EV_App_Screens_Estimation.xlsx` | Cost and complexity per screen, Verified vs New Requirement split |
| `docs/tool_requirements.md` | The rule-engine platform spec, if that build-vs-buy path is taken |
| `docs/new_features.md` | The raw client requirements behind every item marked *(new)* above |
| This document | The connective tissue between all of the above — read this first, then drill into the others for the module you're building |
