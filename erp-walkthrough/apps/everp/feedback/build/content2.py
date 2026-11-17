# Authored content, part 2: dealer D27/D45 and OEM screens O01 to O26.
from dsl import *
C = {}

C['D27'] = dict(purpose='Where a dealer reports a problem with a spare or accessory it holds in stock (not with a shipment).',
 mock=[L('Inventory issues', '~Issue #|~Type|~Item|~Title|~Stage|~Reported', ['I-014|Spare|Battery|Cell swelling|OEM review|24 Oct','I-009|Accessory|Accessories|Missing mirror|Resolved|11 Oct'], actions='+ New issue'),
       Dlg('New issue', ['Type?|◉ Spare  ○ Accessory','~Select item?|Battery ▾ (follows Type)','Title?|Cell swelling after charge','Description?|Left cell looks swollen','File|photo.jpg (preview)'], actions='Cancel|~Submit')],
 questions=[
  Q('What should the list and the dialog show, and how does the dealer submit?', 'The spec gives a "new issue" button and a field table, but no Submit button, no list columns, and no link to the OEM Issues list (O42).', 'A list (Issue #, Type, Item, Title, Stage, Reported) with "+ New issue". The dialog gets Cancel and Submit. A new issue starts at stage "Reported".'),
  Q('Which fields are required?', 'Type, Select Spare, Title and Description are all marked "?" in the Req column.', 'Required: Type, item, Title. Optional: Description, File.'),
  Q('Should the item choices depend on Type (Spare or Accessory)?', '"Select Spare" lists Motor, Battery, Controller and Accessories whatever the Type is.', 'Spare shows Motor, Battery, Controller. Accessory shows Accessories. Rename the field "Select item".'),
  Q('Is this the same list the OEM sees on O42, and is it a different process from a shipment issue?', 'The spec names O42 as the counterpart but does not say they share data. D36 lists issues from shipments.', 'Same records and stages as O42. Shipment issues (from D32) and inventory issues (D27) stay separate types in one list, filtered by type.', raised=['Feedback/assumption.md #16']),
  Q('Which file types and sizes are allowed?', 'The File field says only "preview".', 'Image, PDF or video, up to 10 MB each, up to 3 files.')])

C['D45'] = dict(purpose='The dealer\'s payments page: what has been paid against orders, and money added to the ledger. Opens the "add payment" dialog (D46).',
 mock=[Tabs('~Payments|~Ledger top-ups'), L('Payments', '~Date|~Transaction ID|~Amount (₹)|~Status', ['22 Oct|UTR4471…|2,00,000|Pending','15 Oct|UTR3920…|1,50,000|Verified'], actions='Ledger history|+ Add payment', filters='Status ▾|Date range ▾', search='Search'),
       Dlg('Add payment (ledger top-up) · D46', ['Transaction ID*|Exactly as on your bank record','Amount (₹)*|2,00,000','Payment Date*|22 Oct 2026','Note|Optional','(no proof upload, per spec)|'], actions='Cancel|Submit for verification')],
 questions=[
  Q('What are the two tabs, and what does each show?', 'The spec says "2 tabs" and names neither.', 'Tab 1 "Payments": payments made against purchase orders. Tab 2 "Ledger top-ups": money added to the ledger through D46.', raised=['discussion_dealer_payments_screens.md question 5', 'Feedback/questions.md D45 Q1 and Q2']),
  Q('Is "Ledger history" a page, a tab, a dialog, or the same as D33 (Payment Ledger)?', 'It is listed as a button with no target. Under rule R3 a ledger can be shared by several dealers.', 'A dialog with credits, debits and a running balance. If D33 is merged into D45 (option B in the discussion paper), this becomes a third tab.', raised=['discussion_dealer_payments_screens.md question 1 and options A to D', 'Feedback/questions.md D45 Q5']),
  Q('Which columns, status values and date ranges apply?', 'The spec lists "search, status, date range" with no values.', 'Columns: Date, Transaction ID, Amount, Status. Status: Pending, Verified, Rejected. Date: today, week, month, custom.'),
  Q('D46: is "no proof upload" intended, and what happens after submit? Is there an amount limit?', 'The spec marks "no proof upload". D31 (PO payment) takes a receipt, D46 does not.', 'Keep no proof. After submit the dialog closes and the row shows as Pending. No upper limit. A repeated Transaction ID is blocked.', raised=['discussion_dealer_payments_screens.md question 4', 'Feedback/assumption.md #18'])])

C['O01'] = dict(purpose='OEM staff sign-in, with a "forgot password" link.',
 mock=[F('OEM sign in', ['User ID*|OEM0001','Password*|••••••••','Remember me|☐'], actions='Sign in|~Forgot password')],
 questions=[
  Q('What does "Forgot password" do?', 'The screen name includes it, but the spec gives no fields or actions. The tour shows "Not defined".', 'The user enters their User ID or email; a reset link is sent to the registered email, valid 30 minutes.'),
  Q('Is "Remember me" allowed for OEM users?', 'The spec says not to copy the dealer app\'s plain-text password storage, but gives no OEM rule. The control shows a message only.', 'Remove the option. Keep users signed in with a secure session for 8 hours.'),
  Q('After how many wrong passwords is an account locked, and who unlocks it?', 'The OEM users list has "unlock account" but no threshold is stated.', 'Lock after 5 failed attempts. An administrator unlocks it on the Users screen (O52).')])

C['O03'] = dict(purpose='The OEM home page: company-wide numbers, with filters for period, state and manufacturing unit.',
 mock=[Dash('OEM dashboard', ['Dealers|~38','Open POs|~14','Production this month|~120','Stock available|~86','Warranty open|~6'], filters='Period ▾|State ▾|Unit ▾', note='Only the dealer count has a value in the tour. The other nine KPIs show "Not defined".')],
 questions=[
  Q('How is each of the ten KPIs worked out?', 'The spec names ten KPIs. The tour could value only "number of dealers".', 'Give one line per KPI: what it counts, the period it uses and the screen it opens. I can draft the ten from the order, stock and warranty screens for you to correct.'),
  Q('Who can edit the slogan, and where does it show?', 'The spec lists "edit slogan" and says all roles except PH and PM may open the dashboard.', 'Only the Super Admin edits it. It shows at the top of the dealer dashboard (D04).'),
  Q('How does the unit filter work for users who belong to one manufacturing unit?', 'Rule R6 scopes some roles to one unit.', 'Users with a unit see only that unit and the filter is fixed. Admin sees all.', raised=['Feedback/assumption.md #21'])])

C['O05'] = dict(purpose='The OEM Super Admin creates a new dealer here. It sets the price tier, the region, zone and manufacturing unit, and the sign-in password.',
 mock=[F('Add dealer', ['User Type*|District Dealer ▾','Firm Name*|Sri Lakshmi EVs','GST No*|36AAAAA0000A1Z5','Select Region*|South ▾','Select Zone*|Hyderabad ▾','Manufacturing Unit|MU Hosur ▾','Password*|••••••••'], actions='Save')],
 questions=[
  Q('Where does the user land after Save?', 'The spec does not say. The tour goes to the dealers list (O04), where the new row is visible, then opens the dealer (O06).', 'Land on the dealers list, with the new firm name as a link to the detail page.'),
  Q('How does the dealer get the User ID and password?', 'No screen or rule covers it. The tour shows "Not defined" at O06.', 'Send both to the dealer\'s email and WhatsApp number when the dealer is saved. Force a password change at first sign-in.'),
  Q('What is the Dealer ID format?', 'O05 says "D00000n auto". D01 shows the example "D000002" (7 characters) and the placeholder "eg. D001" (6).', 'Seven characters: D plus six digits, for example D000002. Change the placeholder to match.'),
  Q('Where do the lists of states, districts, regions, zones and manufacturing units come from?', 'The spec gives no values. Region, zone and unit must exist before a dealer can be created.', 'States and districts from master data. Regions, zones and units from the OEM setup screens. Block dealer creation until at least one of each exists.')])

C['O06'] = dict(purpose='The OEM\'s page for one dealer. Everything about that dealer is reached from its tabs.',
 mock=[D('Sri Lakshmi EVs · D000002', ['Profile','Connections','Ledger top-ups','~Customers','~Enquiries','~Vehicles sold','~Vehicle stock','~Warranty','~Purchase orders'], ['User type|District Dealer','Region|South','Zone|Hyderabad','MU|MU Hosur'], actions='Edit')],
 questions=[
  Q('What are the nine tabs, and what do Connections and Ledger top-ups show?', 'The spec says "9 tabs" and names only Profile, Connections and Ledger top-ups. The other six have no names and the three named ones have no content.', 'Profile, Connections, Ledger top-ups, Customers, Enquiries, Vehicles sold, Vehicle stock, Warranty claims, Purchase orders. Connections lists linked sub-dealers; Ledger top-ups lists D46 submissions and their verification.', raised=['Feedback/assumption.md #15, #17']),
  Q('How does the OEM reach the customer, enquiry, stock and other mirror screens (O07 to O14)?', 'No tab, button or link is defined for it. The tour moves there without a spec link.', 'One tab per mirror screen, as proposed above.'),
  Q('Where is the dealer\'s sign-in information shown after creation?', 'The credential hand-over is not defined (see O05).', 'Show the User ID and a "Resend credentials" button to the Super Admin only.')])

C['O07'] = dict(purpose='Read-only view of a dealer\'s customers and what they hold (invoices, payments, service, warranty). The OEM can look, not change.',
 mock=[L('Dealer customers', '~Customer ID|~Name|~Phone|~Email|~Status', ['C-0102|Meena Sample|90000 00002|meena@example.com|Active'], actions='Open|~Export to Excel (admin only)', search='Search'), Tabs('~Personal|~Vehicles|~Invoices|~Payments|~Service|~Warranty')],
 questions=[
  Q('Should the OEM be able to export this list to Excel?', 'Not in the spec. Vishnavi\'s feedback: "customers list export into excel sheet, admin only access". Your own note asks whether Excel export is a security risk on list screens.', 'Yes, admin only, the filtered set only, up to 5,000 rows, and every export is written to the audit log.', raised=['Feedback from Vishnavi (walkthrough feedback)', 'issues_to_fix/decisions.md', 'issues_to_fix/list_screen.md (Export)']),
  Q('What are the six tabs?', 'The spec says "6 tabs" for the customer page without names. The tour borrowed the dealer-side names (D17).', 'Personal, Vehicles, Invoices, Payments, Service, Warranty.'),
  Q('Should PAN and Aadhaar be shown in full to the OEM?', 'Rule F9 marks this as a gap. The tour shows the (fake) values unmasked as the spec says.', 'Mask all but the last 4 characters; show in full only to the Super Admin.')])

C['O10'] = dict(purpose='The OEM sees a dealer\'s vehicle stock and can add stock to the dealer.',
 mock=[L('Dealer vehicle stock', '~Product|~Quantity|~Status', ['Tera Zip 60V 30Ah|12|Available'], actions='Add stock to dealer', tabs='~Vehicle|~Spare|~Accessory'),
       Dlg('Add stock to dealer', ['Product type*|Vehicle ▾','Product*|~Tera Zip 60V 30Ah ▾','Quantity*|4'], actions='Cancel|~Submit')],
 questions=[
  Q('What does "add stock to dealer" do, and who confirms it?', 'The spec gives three fields but no submit control, no effect and no Product options.', 'It records opening or corrected stock at the dealer, with a reason, and writes an audit entry. It does not touch OEM manufacturing-unit stock.'),
  Q('Which roles may add stock?', 'The spec allows ADM, SZH, APM and DH, but none of the codes is defined in people.md.', 'Keep the four roles once the codes are defined.', raised=['Feedback/assumption.md #20']),
  Q('What are the tab names?', 'The tabs are the product types in the spec; names are not given.', 'Vehicle, Spare, Accessory, Battery, Charger, Motor, Controller (the same seven as the product list).')])

C['O11'] = dict(purpose='Read-only view of a dealer\'s warranty claims, with a chart of claims by product.',
 mock=[L('Dealer warranty claims', '~Claim ID|~Product|~Status|~Date', ['WC-014|Battery|Raised to OEM|24 Oct'], filters='Period ▾'), Note('~Claims by product: a bar chart (proposed)')],
 questions=[
  Q('What does the "claims by product" chart show?', 'The spec names the chart and a period filter with no detail. The tour shows a table instead and marks the chart "Not defined".', 'A bar chart: number of claims per product for the chosen period.'),
  Q('Which period options are available?', 'The spec names a "period filter" for O11 and gives no options.', 'Month, quarter, year, custom.')])

C['O12'] = dict(purpose='Read-only list of a dealer\'s purchase orders.',
 mock=[L('Dealer purchase orders', '~PO #|~Type|~Status|~Total|~Date', ['PO-1001|Vehicle|Dispatched|₹9,92,000|20 Oct'], filters='Status ▾|Type ▾')],
 questions=[Q('Which statuses and types are in the two filters, and which columns show?', 'The spec says "status / type filter" and gives no values or columns. The tour used the dealer-side list columns (D28).', 'Type: Vehicle, Spare, Accessory, Warranty. Status: the PO status list once it is defined. Columns as proposed.', raised=['Feedback/assumption.md #14', 'issues_to_fix/pending_definitions.md (status lifecycles)'])])

C['O15'] = dict(purpose='The OEM\'s list of announcements sent to dealers.',
 mock=[L('Announcements', '~Title|~Target dealers|~Attachment', ['Festival offer|All dealers|PDF'], actions='New|Open')],
 questions=[
  Q('Which OEM roles may see and send announcements?', 'The spec says "Role not in permission map — confirm access". The workbook asks the same.', 'Super Admin and Sales Head send; all OEM roles can read.', raised=['EV_App_Screens_Estimation.xlsx row O15', 'Feedback/assumption.md #20']),
  Q('Should the OEM also be able to broadcast on WhatsApp to employees (N20)?', 'The requirement N20 has one line and no screen. The tour shows a card.', 'Out of v1. If wanted: a "Send on WhatsApp" option on the announcement with an employee group picker.', raised=['Feedback/assumption.md #30']),
  Q('Which columns does the list show, and what does "open" do?', 'No columns and no target in the spec.', 'Title, Target dealers, Attachment, Date, Status. Open shows the announcement as the dealer sees it.')])

C['O16'] = dict(purpose='Create an announcement for all dealers or for the dealers of one manufacturing unit.',
 mock=[F('New announcement', ['Title?|Festival offer','Description?|Special dealer margin until 15 Nov','~Priority|High ▾ (High / Medium / General)','Attachment|File: PDF  ○ Table  ○ None','Target Dealers?|All dealers ▾ / Selected MU'], actions='Create|Stop')],
 questions=[
  Q('Should an announcement have a priority?', 'Vishnavi\'s feedback: "add high priority, medium, general, based on message". The spec has no such field.', 'Add a Priority field: High, Medium, General. High shows a red banner on the dealer dashboard.', raised=['Feedback from Vishnavi (walkthrough feedback)']),
  Q('Which fields are required, and what does "stop" do?', 'Title, Description and Target Dealers are marked "?". The effect of create, edit and stop is not described.', 'All three required. Stop hides the announcement from dealers but keeps it in the list as "Stopped".'),
  Q('What are the attachment choices ("Table" in particular)?', 'The spec lists File, Table and others; Table is not described. File types are Image, PDF, Video.', 'Drop "Table" from v1. Keep image, PDF, video up to 20 MB.')])

C['O20'] = dict(purpose='The OEM page for one dealer order: approve or reject it, verify payment, assign stock and dispatch.',
 mock=[D('Order PO-1001', ['~Summary','~Items','~Payments','~Production','~Dispatch','~History'], ['Status|Approved','Dealer|Sri Lakshmi EVs','Total|₹9,92,000','Advance due|₹2,97,600'], actions='Approve|Reject|Create quotation|Edit items|Assign|Dispatch shipment|Verify / reject')],
 questions=[
  Q('Who approves a PO: Sales Head or Super Admin? Can more than one approval be needed?', 'The order tour uses the Sales Head (not in people.md); the exceptions tour uses the Super Admin on the same screen.', 'One approver: the Sales Head, with the Super Admin as backup. One approval is enough.', raised=['Feedback/assumption.md #5']),
  Q('What are the six tabs?', 'The spec says "6 tabs" and names none. The tour invented Summary, Items, Payments, Production, Dispatch, History.', 'Use those six names.', raised=['Feedback/assumption.md #14']),
  Q('After a rejection, what status is set, and how is a rejected PO reopened ("revert")?', 'The spec gives a revert button for a cancelled PO but does not say a rejection cancels the PO.', 'Rejection sets "Rejected". "Revert" returns it to "Pending" and notifies the dealer.', raised=['Feedback/assumption.md #7, #14']),
  Q('Where do the "info note" and "expected dispatch date" belong?', 'They are in O20\'s field table, but the tour shows them on a separate rejection/info dialog (O24).', 'Keep both on O20 as a small dialog. Notify the dealer when the date is saved.')])
