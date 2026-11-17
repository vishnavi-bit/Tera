# Authored content, part 3: OEM screens O22 to O55 and N-features.
from dsl import *
C = {}

C['O22'] = dict(purpose='The OEM dispatches a shipment against an approved order: which unit it leaves from, how much ships now, and the transport details.',
 mock=[Dlg('Dispatch shipment', ['Dispatch from Manufacturing Unit*|MU Hosur ▾','Approved / Shipped / Remaining|16 / 0 / 16','Ship now*|16','~Chassis numbers|~CH-1042 … CH-1057','Transport Type?|By Truck ▾','Transport Company Name?|Sample Logistics','Vehicle No?|TS 09 AB 0000','Expected Delivery Date?|30 Oct','Payment Status?|Paid ▾'], actions='Dispatch (16 units)|Dispatch all remaining')],
 questions=[
  Q('Which transport fields are required?', 'Ten fields (transport type, company, number, tracking, driver, vehicle, courier, dates, payment status) are all marked "?".', 'Required: unit, ship-now quantity, transport type, company, vehicle number and expected delivery date. The rest optional.'),
  Q('When are chassis numbers tied to the shipment?', 'O22 has no chassis field. No screen binds a chassis to a vehicle before it ships.', 'Bind chassis numbers at the despatch gate (N07) and show them read-only here. Block dispatch if any unit has none.', raised=['Feedback/assumption.md #12', 'EV_App_Screens_Estimation.xlsx N04 and N07']),
  Q('How should the e-way bill (N10) and the pre-delivery inspection (N27) fit in?', 'Both are new requirements with no screen. N10 replaces the mock e-way bill in the reference app; N27 comes before a unit ships.', 'N27 PDI must pass before "Dispatch" is enabled. N10 is generated on dispatch for shipments above the GST limit.', raised=['Feedback/assumption.md #26']),
  Q('Is the 30% advance enough to dispatch, or must the full payment be in?', 'O22 shows "Payment Status: Paid / Unpaid" and the spec does not say what blocks dispatch.', 'Advance (30%) allows production. Dispatch needs Accounts to mark "OK to Bill" (N26).', raised=['Feedback/assumption.md #3, #4'])])

C['O23'] = dict(purpose='The OEM verifies or rejects a dealer\'s payment, or a ledger top-up.',
 mock=[D('Verify payment', ['Order payment','Ledger top-up'], ['Order|PO-1001','Transaction ID|UTR4471…','Amount|₹2,97,600','Receipt|receipt.pdf'], actions='Verify|Reject (reason)|~OK to Bill')],
 questions=[
  Q('What is the "OK to Bill" gate (N26), and who gives it?', 'N26 replaces dispatch right after payment verification, but has no screen. The tour shows a card.', 'After the advance is verified, Accounts ticks "OK to Bill" on the order. Dispatch stays blocked until then.', raised=['Feedback/assumption.md #4, #6']),
  Q('Is the 30% advance counted from submitted or verified payment?', 'The rules say production starts at 30% paid and that the OEM verifies payments.', 'Verified payment only.', raised=['Feedback/assumption.md #3']),
  Q('For a ledger top-up, what amount is credited when verified?', 'The spec says "ledger top-up verify" with a note, but not what is credited.', 'The amount the dealer entered, unless the verifier edits it with a reason.', raised=['Feedback/assumption.md #17, #18'])])

C['O25'] = dict(purpose='The OEM list of products, one tab per product type, with add, edit and delete.',
 mock=[L('Products', '~Product|~Variant|~Colour|~Status', ['Tera Zip|60V 30Ah|Red|Active'], actions='Add|Edit|Delete', tabs='Vehicle|Spare|Accessory|Battery|Charger|Motor|Controller', filters='Status ▾')],
 questions=[
  Q('Which columns does each product tab show?', 'The spec says only "status filter, add / edit / delete, 7 tabs". The workbook marks the screen P1.', 'Vehicle: model, variant, colour, status. Spare and accessory: name, parts code, price, status. Components: name, type, status.', raised=['EV_App_Screens_Estimation.xlsx row O25']),
  Q('Which status values exist, and what does delete do to a product already sold?', 'Status values are not given.', 'Active, Inactive, Draft. Delete is only allowed for a product never used; otherwise set it to Inactive.')])

C['O26'] = dict(purpose='Create or edit a vehicle model: variants, colours, taxes, prices per dealer tier, and which motor, controller, battery and charger it uses.',
 mock=[F('Vehicle product', ['Vehicle Model*|Tera Zip','Type*|Scooter','HSN No*|8711','CGST / SGST (%)*|2.5 / 2.5','Variant 1*|60V 30Ah','Without Battery & Charger|☐','Battery|~Battery 30Ah ▾','Price: Distributor*|₹…','~Bill of materials|~Parts, quantity, landing price (N08)','~BOM version|~v1 (N09)'], actions='Add colour|Add variant|Add spec|Create')],
 questions=[
  Q('What does the bill of materials (N08) hold, and who approves a change (N09)?', 'N08 and N09 have one line each and no screen. The workbook asks "does every BOM change need versioning, or only material changes? Who approves: Production Head, QC or OEM Admin?"', 'A BOM per vehicle model: part, quantity, image, landing price. Any change creates a new version; the OEM Admin approves. Work already in progress keeps the old version.', raised=['Feedback/assumption.md #23', 'EV_App_Screens_Estimation.xlsx row N09']),
  Q('Should the charger be hidden when "Without Battery & Charger" is ticked?', 'The spec says it should; the tour shows the charger always.', 'Hide Battery, Battery Qty and Charger when ticked.'),
  Q('Where do the motor, controller, battery and charger lists come from?', 'The tour created one component (the motor) and used sample lists for the others.', 'From the component product lists (O25 tabs), filtered to Active.')])

C['O27'] = dict(purpose='Create or edit a spare part or accessory.',
 mock=[F('Spare / accessory', ['Vehicle*|Tera Zip ▾','Spare Name*|Brake pad','Parts Code|BP-001','Category / Brand|~(options?)','HSN Code*|8714','Dealer Price|₹…','Customer Price|₹…','~Inventory type|~Saleable ▾ (N14)','~UoM, weight, material (N24)|~…'], actions='Create')],
 questions=[
  Q('How should internal-use items (N14) be flagged?', 'N14 asks for a new field and filter so internal-use items are excluded from dealer-facing inventory. The workbook says the client flagged the naming as a placeholder.', 'A field "Inventory type": Saleable or Internal use. Internal use never shows to dealers or in D25. Only Inventory Manager and Admin can change it.', raised=['Feedback/assumption.md #25', 'EV_App_Screens_Estimation.xlsx row N14']),
  Q('Which extra fields belong on a spare part (N24)?', 'N24 lists unit of measure, weight, material, multi-model use, purchase cost and price history, from a slide deck.', 'Add them as optional fields; price history kept automatically when price changes.'),
  Q('Where do the options for Category and Brand come from?', 'The spec says "text / select" with no list.', 'A small master list that an admin can extend.'),
  Q('What does "Is Panel / Painted Part?" create?', 'The spec says it creates one spare per colour of the model.', 'Confirm: on save, one spare record per colour, named "Part (Colour)".')])

C['O29'] = dict(purpose='One report page per vehicle model: stock, sales, warranty, issues, stock by manufacturing unit, and prices.',
 mock=[L('Tera Zip: stock by manufacturing unit', 'Manufacturing Unit|Quantity|~Product', ['MU Hosur|12|Tera Zip 60V'], filters='Week|Month|Year', actions='Purchased vs sold')],
 questions=[
  Q('What does each section of the report contain?', 'The spec lists "per-model rollup: stock, sales, warranty, issues; stock-by-MU; price matrix" with no layout or formulas.', 'Four cards (Stock, Sold, Warranty claims, Issues) for the chosen period, then a stock-by-unit table and the price matrix by dealer tier.'),
  Q('What are the week, month and year options, and what is "purchased vs sold"?', 'The spec lists the buttons but gives no default period and does not say what "purchased vs sold" compares.', 'Period buttons default to Month. "Purchased vs sold" compares units received from production with units dispatched to dealers.')])

C['O30'] = dict(purpose='The OEM view of stock held, with nine tabs including stock history and reserved stock.',
 mock=[L('OEM inventory', '~Product|~Quantity|~Status', ['Tera Zip 60V|12|Available'], tabs='~Stock|~Stock history|~Reserved stock|~Vehicle|~Spare|~Accessory|~Battery|~Charger|~Motor', filters='Unit ▾|Stock ▾', search='Search')],
 questions=[
  Q('What are the nine tabs?', 'The spec names only "stock history" and "reserved stock". The tour shows the other seven as "Not defined" tabs.', 'Stock, Stock history, Reserved stock, then one tab per product type (vehicle, spare, accessory, battery, charger, motor) as proposed.'),
  Q('What do the unit filter and stock filter offer?', 'No values are given.', 'Unit: each manufacturing unit. Stock: Available, Locked, Delivered, Draft (the statuses on the inventory list).'),
  Q('Who sees reserved stock by dealer?', 'Rule F6 says reserved stock by dealer is OEM-only.', 'OEM users only; dealers never see it.', raised=['Feedback/assumption.md #10'])])

C['O33'] = dict(purpose='Create or edit a manufacturing unit (factory): address, bank, GST and its head.',
 mock=[F('Manufacturing unit', ['Unit Name*|MU Hosur','State*|Tamil Nadu','Production Unit Head|~Select user ▾','GST No*|…','Account No*|…','Phone No*|…','~Capacity per day|~…','~Working calendar|~Mon–Sat'], actions='Create|Save|Use current location')],
 questions=[
  Q('What are "Capacity" and "Working calendar", and what do they feed?', 'The spec gives endpoints only and no screen. The tour shows "Not defined". The dispatch calendar (O36) needs them.', 'Capacity: units per day per product type. Calendar: working days and holidays. Both feed the dispatch plan.'),
  Q('How is a Production Unit Head assigned?', 'The spec lists OEM_PRODUCTION_HEAD users but the OEM setup tour creates none. The select offers only "No unit head".', 'Pick from OEM users with the Production Head role. Allow changing the head later from this form.', raised=['Feedback/assumption.md #20'])])

C['O34'] = dict(purpose='The page for one manufacturing unit, with links to its stock, dispatch plan, load plan, containers and production.',
 mock=[D('MU Hosur', ['Details'], ['State|Tamil Nadu','Head|Ruby Sample','Connected dealers|1'], actions='Edit|MU stock|Dispatch plan|Load plan|Containers|Production|Connect a dealer'), Note('~N21: unit asset register (fixed and movable assets) would be a tab here')],
 questions=[
  Q('How should the page be laid out?', 'The spec lists buttons only; the layout is not defined. The tour reuses the create-form fields.', 'Header with the unit details, then the six buttons as cards. Connected dealers shown in a list below.'),
  Q('What does "Connect a dealer" do exactly?', 'The spec says it "moves the dealer to this unit; already-connected ones are flagged", with a "Search any dealer" box.', 'Searching shows dealers; connecting one moves it from its old unit after a confirmation that names both units.', raised=['Feedback/assumption.md #9']),
  Q('Is the unit asset register (N21) in scope?', 'N21 asks to track fixed and movable assets per unit, with an admin-managed asset-type list. It has no screen.', 'Decide scope. If yes: a new tab with asset, type, location, status.', raised=['Feedback/assumption.md #32'])])

C['O35'] = dict(purpose='The stock register for one manufacturing unit: daily movements, shipments in transit, components needed, and reducing stock.',
 mock=[L('MU stock · daily register', 'Model|Opening|Dispatched|Reserved|Received|Closing|In transit', ['Tera Zip|20|4|2|8|22|3'], actions='In-transit: add / edit / receive|Components needed|Reduce stock'), Dlg('Reduce stock', ['~Product|~Tera Zip ▾','~Quantity|~2','~Reason|~Damage ▾','~Date|~Today (backdating? N18)','~Note|~…'], actions='Cancel|Reduce')],
 questions=[
  Q('What fields does "Reduce stock" have?', 'The spec names the button and no fields.', 'Product, quantity, reason (damage, loss, transfer, other), date, note. Needs an approver above a limit.'),
  Q('What is "Reserved" and where does the number come from?', 'The column is in the spec; its source is not.', 'Reserved = stock assigned to approved orders not yet dispatched (from O21). Click-through shows the order list. OEM-only.', raised=['Feedback/assumption.md #10']),
  Q('Should users be allowed to enter records with an earlier date (N18)?', 'N18 asks for backdated entry on POs and material inward, with no rules.', 'Only Admin and Inventory Manager, up to 90 days, with the original and entry dates both stored. Never on closed periods.', raised=['Feedback/assumption.md #31']),
  Q('Should stock have bin, rack or zone locations (N12)?', 'N12 asks for a location master per unit; no screen.', 'Yes, as a simple master list per unit, selectable on receiving and shown on the register.', raised=['EV_App_Screens_Estimation.xlsx row N12', 'Feedback/assumption.md #25'])])

C['O36'] = dict(purpose='A month calendar for one manufacturing unit showing dispatch dates, build dates and components running short.',
 mock=[Cal('Oct 2026', ['4:Dispatch','11:~Build','18:~Component short','25:Dispatch'], note='Marker meaning and the date range are proposed.')],
 questions=[
  Q('What do the three markers mean, and what dates do they cover?', 'The spec names markers (dispatch, build, component-short) but not their meaning or date range. Nothing is calculated in the tour.', 'Dispatch: planned shipment date. Build: planned production date. Component-short: a day a needed part would run out. Calendar covers the current month, with next and previous month arrows.'),
  Q('Where do the dates come from?', 'The calendar is described only as "month calendar of markers". Nothing says where each date comes from.', 'Dispatch dates from approved orders and ETA; build dates from production plan (O18); shortage from the BOM against stock.')])

C['O39'] = dict(purpose='The OEM list of vendors (suppliers), with add, edit, delete, and a button to start buying from a vendor.',
 mock=[L('Vendors', '~Vendor code|Name|~Status|~Phone|~Supplies', ['V-0001|Sample Components Ltd|Active|90000 00006|Motors, controllers'], actions='Add|Edit|Delete|Procurement'), Dlg('Vendor', ['~Vendor code|~Auto (V-0002)','Name*|…','~Contacts|~Name · designation · phone · email (many)','~Bank details|~Account, IFSC, branch','GST No|~Auto-fill from GST (N01)','~Status|~Active / Inactive / Blocked','~What they supply|~…'], actions='Save')],
 questions=[
  Q('Should the vendor record carry bank details, several contacts, a status, an auto vendor code and a "what they supply" description?', 'Vishnavi\'s feedback asks for all of these. The spec has Name, one contact, phone, email, GST, address, active flag and notes. N23 (extended vendor profile) is one line with no screen.', 'Yes to all five. Contacts: many, each with name, designation, phone, email. Status: Active, Inactive, Blocked (blocked cannot receive new POs). Vendor code is generated: V-0001, V-0002.', raised=['Feedback from Vishnavi (walkthrough feedback)', 'EV_App_Screens_Estimation.xlsx row N23']),
  Q('Should GST lookup (N01) fill the vendor details automatically?', 'N01 needs a GST-portal provider. The workbook asks which one.', 'Yes, for vendors and dealers, once a provider is chosen. Until then, manual entry.', raised=['EV_App_Screens_Estimation.xlsx row N01', 'Feedback/assumption.md #32']),
  Q('Which OEM roles can manage vendors?', 'The spec says "Role not keyed — confirm access" and the workbook asks the same.', 'Procurement Manager and Admin edit; Inventory Manager reads.', raised=['EV_App_Screens_Estimation.xlsx row O39', 'Feedback/assumption.md #20'])])

C['O40'] = dict(purpose='Where the OEM decides how much to buy from one vendor and creates the purchase order.',
 mock=[L('Procurement: Sample Components Ltd', 'Product|Type|Needed|In stock|Net|Order Qty*|Rate*|Amount|MU?', ['Motor 60V|Motor|~20|8|~12|12|₹4,500|₹54,000|MU Hosur'], actions='Create PO (1)')],
 questions=[
  Q('Does "Needed" include the reorder quantity?', 'Vishnavi asked: "check if the reorder qty is included in Needed". The spec calls Needed a figure from the dispatch list and does not mention reorder levels.', 'Needed = demand from the dispatch list + quantity to bring stock back to the minimum level (N25). Show both parts in the cell.', raised=['Feedback from Vishnavi (walkthrough feedback)']),
  Q('How does the minimum-stock and sales-forecast reorder (N25) reach this screen?', 'N25 has no screen, and the spec does not say how a reorder lands here.', 'Rows are pre-filled for items at or below minimum stock; the user edits quantity and rate.'),
  Q('What does "Create PO (n)" count, and how are Net and Amount worked out?', 'The tour reads n and the totals from sample data.', 'n = rows with a quantity above zero. Net = Needed − In stock. Amount = quantity × rate.')])

C['O41'] = dict(purpose='The OEM list of purchase orders to vendors. A new PO starts here and is approved by email.',
 mock=[L('Vendor POs', '~PO #|~Vendor|~Total|~Status', ['VPO-001|Sample Components Ltd|₹54,000|Awaiting approval'], actions='Create|View', filters='Status ▾'), Flow(['Create PO','~Approval request by email','~Approved','~PO emailed to vendor (N17)'])],
 questions=[
  Q('How does approval by email work?', 'The spec says the PO is approved "by the OEM approval admin, via email", but gives no screen and no rule. The tour shows a card.', 'An email with Approve and Reject links goes to the approval admin set on O49. The PO status changes on click. Approvals are written to the audit log.', raised=['EV_App_Screens_Estimation.xlsx row O41']),
  Q('Is the PO itself emailed to the vendor after approval (N17)?', 'The workbook asks whether the PO document or only the internal approval request is emailed.', 'Yes, the PO as PDF is emailed to the vendor\'s contacts automatically after approval.', raised=['EV_App_Screens_Estimation.xlsx rows O41 and N17']),
  Q('If a PO changes after approval, is a revised PO sent?', 'Not defined. N17 asks the same.', 'A change needs re-approval. The revised PO is sent and the earlier copy is marked "Superseded".', raised=['Feedback/assumption.md #28'])])

C['O42'] = dict(purpose='The OEM reviews issues raised by dealers: manager review, OEM approval, then money settlement or replacement.',
 mock=[L('Issues', '~Issue|~Dealer|~Product|~Stage|~Reported', ['I-014|Sri Lakshmi EVs|Battery|Manager review|24 Oct'], tabs='~Reported|~Manager review|~OEM review|~Settlement|~Closed', actions='Approve / decline (manager)|Approve / decline (OEM)|Settle with ~credit note|Replace|Mark dispatched|Resolve / reject')],
 questions=[
  Q('Should the settlement button say "Settle with credit note"?', 'Vishnavi\'s feedback: change the button name to "settle with credit note". The spec says "settle with money" with Compensation amount and Transaction ID.', 'Offer both choices in one dialog: "Settle with money" (amount and transaction ID) and "Settle with credit note" (amount, credit goes to the dealer ledger). Button label: "Settle".', raised=['Feedback from Vishnavi (walkthrough feedback)']),
  Q('What are the stage names, and what does each action change?', 'Stage tabs exist, but no names. Decline, replace, mark dispatched, resolve and reject have no stated effect on the stage.', 'Reported, Manager review, OEM review, Settlement, Replacement, Resolved, Rejected. Each action moves to the next stage; decline moves to Rejected with a reason.', raised=['Feedback/assumption.md #16']),
  Q('Do manager and OEM review need different people?', 'The spec lists roles IM, SVH and ADM only.', 'Manager review by IM (Inventory Manager) or SVH; OEM approval by ADM.', raised=['Feedback/assumption.md #20'])])

C['O43'] = dict(purpose='The OEM queue of warranty claims raised to the OEM.',
 mock=[L('Warranty claims received', '~Claim ID|~Dealer|~Raised to|~Status', ['WC-014|Sri Lakshmi EVs|OEM|Verify'], filters='Status ▾')],
 questions=[Q('Which statuses does the filter offer, and which columns show?', 'The spec says "status filter; raisedTo = OEM queue". Columns and options are not given.', 'Statuses as on the claim (see D39). Columns: Claim ID, Dealer, Product, Raised to, Status, Date.', raised=['Feedback/assumption.md #14'])])

C['O44'] = dict(purpose='The OEM works one warranty claim: verify it, inspect, decide service or replacement, ask the dealer for a service charge, and close it.',
 mock=[D('Claim WC-014', ['OEM review','Customer & claim','Issue & coverage','Dealer claim photos','Dealer issue report'], ['Status|Raised to OEM','Product|Battery'], actions='Verify / reject|Inspection report|Service or replacement|Ask cost from dealer|Return / complete')],
 questions=[
  Q('What fields do the five sections without a field table contain?', 'OEM review, Customer & claim, Issue & coverage, Dealer claim photos and Dealer issue report have no field table. The tour shows "Not defined".', 'Draft the tables from the claim form (D38) and the dealer claim detail (D39), then confirm.'),
  Q('Which comes first: service/replacement or asking the dealer for the cost?', 'The spec\'s own rule says asking cost blocks service until the dealer pays and the OEM verifies, but the chosen step order is the other way round.', 'Ask cost → dealer pays → OEM verifies → service or replacement.', raised=['Feedback/assumption.md #6']),
  Q('When replacement is chosen, what happens to stock?', 'Replacement is not built in the tour. No stock check or deduction is described.', 'Check OEM stock for the part; reserve it; deduct when the replacement is dispatched.'),
  Q('Who bears the service charge?', 'The workflow leaves this open (customer, dealer or configurable).', 'The dealer pays the OEM; the OEM may waive it ("waive" is already a button).')])

C['O45'] = dict(purpose='The OEM list of every payment dealers have submitted, to verify or reject each one.',
 mock=[L('Payments (all dealers)', '~Date|~Dealer|~Type|~Amount|~Status', ['22 Oct|Sri Lakshmi EVs|Ledger top-up|₹2,00,000|Pending'], actions='View receipt|Verify|Reject', filters='Status ▾|Date range ▾', search='Search')],
 questions=[
  Q('Which status options does the filter have, and which role verifies?', 'The spec gives no options and says "Role not keyed — confirm access". The tour uses an Accounts Manager.', 'Status: Pending, Verified, Rejected. Roles: Accounts Manager and Admin.', raised=['Feedback/assumption.md #6, #20']),
  Q('What are the "submitted" and "received" dates?', 'The spec lists both; the sample data has only one date.', 'Submitted = when the dealer entered it. Received = the bank date the dealer typed on the payment.')])

C['O49'] = dict(purpose='The OEM company profile, with the GST switch, the approval-admin email and password change.',
 mock=[F('OEM profile', ['Is GST Needed?|☑','Approval Admin Email?|admin@example.com','Org / GST / currency / time zone|(read only)','~CIN, TAN, PAN, MSME, IEC, Directors (N22)|~…'], actions='Save approval email|Change password')],
 questions=[
  Q('Is the Approval Admin Email required?', 'It is marked "?". It is the address PO approvals go to (see O41).', 'Required, because vendor POs cannot be approved without it.'),
  Q('Should the profile hold compliance details (N22)?', 'N22 asks for CIN, TAN, PAN, MSME, IEC and Directors\' details, and edit rights. No screen.', 'Yes, as read-write fields for the Super Admin, shown on documents such as the PO and invoice header.', raised=['Feedback/assumption.md #32'])])

C['O52'] = dict(purpose='The OEM list of staff users, with create, edit and unlock.',
 mock=[L('Users', '~User ID|~Name|~Role|~Role category|~Status', ['OEM0002|Charan Sample|Super Admin|Admin|Active'], actions='Create|Edit|Unlock account', search='Search')],
 questions=[
  Q('How are user IDs generated, and what is "role category"?', 'The spec does not say how an ID is made. The list has a "role category" column with no definition.', 'IDs run OEM0001, OEM0002 and so on. Role category groups roles for reports: Admin, Sales, Production, Inventory, Accounts, Service.'),
  Q('Where is the full list of OEM roles?', 'O53 says "15 OEM roles (section 2.1)". Section 2.1 is not in screen_details.md.', 'Provide the list, with each role\'s screens (the role-to-screen matrix).', raised=['Feedback/assumption.md #20'])])

C['O53'] = dict(purpose='Create or edit an OEM staff user: role, unit, contact and password, and for sales roles which dealers they handle.',
 mock=[F('OEM user', ['User Role*|(options?) ▾','Manufacturing Unit|MU Hosur ▾','First / Last Name*|Ruby Sample','Email ID*|ruby@example.com','Contact*|90000 00004','Password*|••••••••','Status (edit)*|Active','Assigned Dealers (sales roles)|~…','Device limit (edit)|3'], actions='Create|Submit|Change password|Sign out devices')],
 questions=[
  Q('What are the role options?', 'The spec says 15 OEM roles (section 2.1, not in the file). The select shows "Not defined".', 'Provide the 15 roles. Add the four roles N28 proposes: Procurement Manager, Inventory Manager, National Sales Head, Area Sales Manager.', raised=['Feedback/assumption.md #20', 'EV_App_Screens_Estimation.xlsx row N28']),
  Q('How do assigned dealers, regions and zones restrict what a sales user sees?', 'The spec shows "Assigned Dealers" for sales roles and region and zone fields elsewhere.', 'A sales user sees only assigned dealers. Region and zone heads see all dealers in their area. The narrowest scope wins.', raised=['Feedback/assumption.md #21']),
  Q('What is the difference between "create" and "submit"?', 'Both buttons are listed.', 'Use one button, "Save". Drop the other.')])

C['O54'] = dict(purpose='A log of who changed what and when, with filters and a view of the before and after values.',
 mock=[L('Audit logs', '~Feature|~Action|~Date|~By|~Changes', ['Dealer|Created|27 Oct|Charan|▸ expand diff'], filters='Feature ▾|Action ▾|Date ▾'), Note('~N15 purge and N16 export would add two buttons here')],
 questions=[
  Q('Which columns and filter values does the log have, and what does the expanded "diff" show?', 'The spec says "feature / action / date filters, expandable field diff" with no values.', 'Columns: Feature, Action, Date, User, Record. Diff shows field, old value, new value. Filters list every feature and action.'),
  Q('Should the Super Admin be able to purge old records (N15), with a retention date?', 'N15 has one line and no screen.', 'Yes. Retention is set in settings (for example 7 years); a purge needs a typed confirmation and is itself logged.', raised=['Feedback/assumption.md #29']),
  Q('Can customers export their own audit trail (N16)?', 'N16: "customer-facing export/download of their own audit trail". Format, scope and sign-in check are not given.', 'CSV, only the customer\'s own records, after re-entering the password.', raised=['Feedback/assumption.md #29'])])

C['O55'] = dict(purpose='Security settings: the user\'s signed-in devices, signing out others, and the default device limit.',
 mock=[F('Security', ['My devices|~Device · browser · last active · IP','Default device limit|3'], actions='Sign out other devices|Sign out everywhere')],
 questions=[
  Q('What does the "My devices" table show?', 'The spec names the heading only.', 'Device name, browser, location, last active, and a button to sign out that device.'),
  Q('What happens when the limit is reached?', 'The effect of "Default device limit" is not defined.', 'The oldest session is signed out on the new sign-in, with an email to the user.'),
  Q('Who may sign out other users\' devices?', 'The spec says Admin; others see only their own devices.', 'Admin only, from the user edit page (O53).')])

# ---- New requirements (N-features): the spec has one line each
C['N03'] = dict(purpose='The Production Head asks Inventory for materials: for an order, for a forecast, or to replace lost or damaged parts.',
 mock=[F('Material requisition (proposed)', ['~Reason*|~Against order ▾ (Order / Forecast / Damage)','~Order or forecast|~PO-1001','~Product|~Tera Zip 60V 30Ah','~Parts needed|~from the BOM (N08)','~Requested by|~Production Head','~Needed on|~…'], actions='~Submit request|~Cancel')],
 questions=[
  Q('What fields does the requisition have, and where do the quantities come from?', 'Spec: "Not yet speced in the reference app". The workbook line says three reasons (order, forecast, damage) and that it depends on the bill of materials (N08).', 'Reason, order or forecast reference, product, parts and quantities filled from the BOM, needed-on date. Damage requests require a note and a photo.', raised=['EV_App_Screens_Estimation.xlsx row N03']),
  Q('Who approves a requisition, and what happens to stock?', 'Not stated. The tour removed an earlier stock deduction because there was no rule.', 'The Inventory Manager approves. Stock is reserved on approval and deducted when issued.', raised=['Feedback/assumption.md #10, #11']),
  Q('Which roles raise and handle it?', 'The workbook says "Production Head role" to Inventory. The tour used Ganesh (Production Manager).', 'Production Head raises. Inventory Manager handles.', raised=['Feedback/assumption.md #20'])])

C['N04'] = dict(purpose='When production finishes, record the finished unit\'s identifiers and hand it over to inventory and QC.',
 mock=[F('Production completion (proposed)', ['~Order / batch|~PO-1001','~Chassis no.*|~CH-1042','~Motor no.*|~M-5521','~Controller no.*|~C-3310','~Battery no.*|~B-8841','~Completed on|~…'], actions='~Hand over to QC|~Save')],
 questions=[
  Q('Which identifiers are mandatory for each vehicle variant?', 'The workbook line lists chassis, motor, controller and battery. This is the step that "resolves the gap that no screen binds a chassis to a vehicle". No fields or rules are given.', 'All four mandatory for vehicles. Chassis unique across the system. Batteries may be several per vehicle.', raised=['Feedback/assumption.md #12', 'EV_App_Screens_Estimation.xlsx row N04']),
  Q('What if a number is missing, duplicated or does not match?', 'Not defined.', 'Block handover with a message naming the clash. Allow a Production Head override only with a reason.', raised=['Feedback/assumption.md #12']),
  Q('Is this a per-unit entry or a per-batch entry?', 'Not stated.', 'Per unit, with a batch scan or paste option for 16 to 40 units.'),
  Q('Does production completion change the order status?', 'The order tour sets "Ready for Dispatch" here, but the status is not defined in the spec.', 'Set "Ready for Dispatch" only after QC (N05) passes.', raised=['Feedback/assumption.md #14'])])

C['N05'] = dict(purpose='A yes / no checklist QC fills for each finished unit before it is released.',
 mock=[F('QC checklist (proposed)', ['~Unit|~CH-1042','~Frame and paint OK?|~Yes / No','~Brakes OK?|~Yes / No','~Lights and horn OK?|~Yes / No','~Battery and charger OK?|~Yes / No','~Remarks|~…'], actions='~Pass|~Fail → rework')],
 questions=[
  Q('Which checks are on the list?', 'The spec says only "Yes/No checklist per finished unit before release". No items are given.', 'Start with ten items per vehicle type, set by the QC Manager and editable by Admin. I can draft a list.', raised=['EV_App_Screens_Estimation.xlsx row N05']),
  Q('What happens when a check fails?', 'The flow document sends a failed unit back to production, but that loop is not in the spec.', 'The unit goes to a "Rework" list with the failed items. After rework it is checked again; the first result stays in history.', raised=['Feedback/assumption.md #11']),
  Q('Is a QC pass needed for every unit before dispatch?', 'Not stated.', 'Yes, no dispatch without a pass.', raised=['Feedback/assumption.md #11'])])

C['N06'] = dict(purpose='QC asks Inventory for branding and packaging materials for a specific finished product.',
 mock=[F('Branding / packaging requisition (proposed)', ['~Finished product|~Tera Zip · CH-1042','~Items|~from the BOM (N08)','~Quantity|~1 set','~Requested by|~QC'], actions='~Submit request')],
 questions=[
  Q('Which items can be requested, and where does the list come from?', 'The workbook line says the items are "sourced from the BOM". The BOM (N08) has no screen yet.', 'Items marked "Branding" or "Packaging" in the BOM for that model.', raised=['EV_App_Screens_Estimation.xlsx row N06']),
  Q('Does every unit need branding and packaging before dispatch?', 'Not stated.', 'Yes for new vehicles. Not needed for spares.', raised=['Feedback/assumption.md #11']),
  Q('Who approves and who issues the material?', 'Not stated. The tour names Ruby (Inventory Manager) in a card only.', 'Inventory Manager approves and issues; stock is deducted on issue.', raised=['Feedback/assumption.md #20'])])

C['N07'] = dict(purpose='The last check before dispatch: the system confirms the chassis number and all identifiers match what was recorded at production.',
 mock=[F('Despatch validation (proposed)', ['~Invoice / order|~INV-2001 · PO-1001','~Chassis no.|~CH-1042 (scan or type)','~Motor / controller / battery|~match ✓','~Result|~Valid'], actions='~Assign for dispatch|~Reject')],
 questions=[
  Q('How does the gate work: scan, type, or pick?', 'The workbook says despatch "starts from the invoice" and validates the chassis and all identifiers. Nothing says how the user enters them.', 'Scan or type the chassis; the system shows the stored motor, controller and battery for a visual check, then assigns the unit to the shipment.', raised=['Feedback/assumption.md #12']),
  Q('What if the number is wrong or the unit is already assigned?', 'Not defined.', 'Block with a clear message. Only Logistics Manager can release a unit from another shipment, with a reason.', raised=['Feedback/assumption.md #12']),
  Q('Does O21 Assign Item happen before or after this gate?', 'The flow document puts O21 after QC and before N07; the order tour puts it before production.', 'Reserve at O21 when the order is approved. N07 binds the actual units just before dispatch.', raised=['Feedback/assumption.md #10'])])

C['N13'] = dict(purpose='When stock is issued, the system picks the oldest stock first and says which location it is in. A report shows stock by location.',
 mock=[L('Stock by location (proposed)', '~Product|~Location|~Received|~Quantity', ['Motor 60V|Rack A-2|12 Sep|8','Motor 60V|Rack B-1|20 Oct|10'], actions='~Issue oldest first')],
 questions=[
  Q('What exactly does FIFO apply to, and what if the oldest stock is unusable?', 'The workbook line: "stock issued from the correct (oldest-first) location; current stock-by-location report". It depends on the location master (N12) and "significantly changes existing inventory issuance".', 'FIFO on components and spares. If the oldest lot is damaged or reserved, the user picks the next lot and records why.', raised=['Feedback/assumption.md #25', 'EV_App_Screens_Estimation.xlsx row N13']),
  Q('How does FIFO work with reservations for orders?', 'Not defined.', 'A reservation holds quantity from the oldest lot. Issue uses reserved lots first.', raised=['Feedback/assumption.md #10, #25']),
  Q('Should this ship in v1, given it touches core inventory logic (5 days, P1)?', 'The workbook rates it P1 and "significant".', 'Decide scope with N12; both together, or both later.', raised=['Feedback/assumption.md #32'])])
