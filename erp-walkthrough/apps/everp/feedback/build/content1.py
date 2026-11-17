# Authored content, part 1: Dealer app screens. See build-slides.py for how it is used.
from dsl import *

C = {}

C['D04'] = dict(purpose='The first page a dealer sees after signing in. It shows business totals at a glance.',
 mock=[Dash('Dashboard', ['Invoices|~42 this month','Purchase orders|~7 open','Service jobs|~5 open','Warranty claims|~2 open','Follow-ups|~9 due today'], filters='Period ▾', note='Tile numbers and the drill-down targets are proposed.')],
 questions=[
  Q('What number does each tile show, and where does clicking it go?', 'The spec names five aggregates (invoices, POs, service, warranty, follow-ups) and "drill links", but gives no values or targets. The tour shows "Not defined".',
    'Invoices: count and ₹ total, opens the invoice list. POs: open count, opens the PO list. Service: open jobs, opens the service list. Warranty: open claims, opens the warranty list. Follow-ups: due today, opens the follow-up list.'),
  Q('Which period options does the filter offer?', 'The spec says "period filter" with no options.', 'Today, this week, this month, this year, custom dates (the same set the OEM vehicle-sold report uses).'),
  Q('Do all three roles (Dealer, Sales, Service) see all five tiles?', 'Roles D, S and V may open the dashboard. No tile is tied to a role.', 'Dealer owner sees all. Sales sees invoices and follow-ups. Service sees service and warranty.', raised=['Feedback/assumption.md #20 (role-to-screen matrix)'])])

C['D13'] = dict(purpose='A reminder list of customers whose vehicle is due for service, so the dealer can call them.',
 mock=[L('Service follow-ups', '~Customer|~Mobile|~Chassis|~Reason|~Due on|~Status', ['Meena Sample|90000 00002|CH-1042|First free service due|30 Oct|Open','Arun Sample|90000 00003|CH-0991|Battery check due|02 Nov|Open'], filters='Filter ▾', search='Search name / phone / email')],
 questions=[
  Q('What is a service follow-up, and what creates one?', 'D13 and D14 exist, but no rule says when a follow-up is due. The tour uses invented reasons ("First free service due").', 'The system creates one automatically at each free-service milestone after the invoice. Staff can also add one by hand.'),
  Q('Which columns and filter values does the list have?', 'The spec says "filter, search by name / phone / email" and nothing else. The tour shows the filter as "Not defined".', 'Columns: Customer, Mobile, Chassis, Reason, Due on, Status. Filter: Due, Overdue, Done.')])

C['D16'] = dict(purpose='Creates or edits a customer record. Used when an enquiry is converted to a customer, or a customer walks in.',
 mock=[F('Add customer', ['Customer Type*|Individual','Name*|Meena Sample','Mobile*|90000 00002','Billing: State*|~Telangana ▾','Billing: Country*|India','PAN No*|XXXXX0000X + proof','Aadhar No|0000 0000 0000 + proof','Licence No|(empty)'], actions='Create')],
 questions=[
  Q('Where does the State list come from, and which countries are allowed?', 'The spec says "36 states / UTs", from an API, with no values. Country has no options. The tour shows "Not defined".', 'A fixed list of the 28 states and 8 union territories, loaded from master data. Country defaults to India; other countries not allowed for now.'),
  Q('Are PAN, Aadhar and Licence all required, or at least one?', 'The spec table marks all three as required with proof upload. The tour treats it as "at least one of the three".', 'At least one identity proof with its file. Mark the other two optional.'),
  Q('Where does the user land after creating a customer?', 'The spec does not say. The tour opens the customer hub (D17).', 'The customer hub (D17), where products, invoices and payments are one click away.')])

C['D30'] = dict(purpose='Dealer-side view of one purchase order: items, payments, production and dispatch, with actions to pay, confirm or reject delivery, and report an issue.',
 mock=[D('Purchase order PO-1001', ['~Summary','~Items','~Payments','~Production','~Dispatch','~History'], ['Status|Dispatched','Seller|MU Hosur','Total|₹9,92,000','Paid|₹2,97,600'], actions='Pay|Confirm delivery|Reject shipment|Report issue|Print / share')],
 questions=[
  Q('What are the six tabs, and what does each show?', 'The spec says "6 tabs" and names none. The tour used Summary, Items, Payments, Production, Dispatch and History as its own guess.', 'Summary, Items, Payments, Production, Dispatch, History.', raised=['Feedback/assumption.md #14 (status lists)']),
  Q('After the OEM rejects a PO, what stage and outcome does the dealer see?', 'Rule F8 says the dealer sees "stage and outcome only", but no stage or outcome names exist for a rejection. The tour shows "Not defined".', 'Stage "Rejected". Outcome "Closed, no order". A "Request again" button opens a new cart.', raised=['Feedback/assumption.md #14', 'issues_to_fix/pending_definitions.md (status lifecycles)']),
  Q('Is there a way to open a PO from the list, and what does "view" do on D30?', 'The spec gives D30 no "view" or open action, but the tour needs one.', 'The PO number on the list (D28) opens D30. No separate view button.')])

C['D37'] = dict(purpose='Lists the dealer\'s warranty claims and starts a new one by choosing the customer and vehicle.',
 mock=[L('Warranty claims', '~Claim ID|~Customer|~Raised to|~Status', ['WC-014|Meena Sample|OEM|Raised to OEM'], actions='+ New claim', search='Search'),
       Dlg('Select customer by chassis', ['Chassis number|~CH-1042', '~Customer|~Meena Sample (auto)'], actions='Continue')],
 questions=[
  Q('What does the "select customer by chassis" dialog contain?', 'The "+" button opens it, but the spec gives no fields. The tour jumps straight to the claim form.', 'One field: chassis number. The system finds the customer and vehicle and opens D38 with them filled in.'),
  Q('Which columns and search fields does the list have?', 'The spec says only "search" and "+". Columns are not given.', 'Columns: Claim ID, Customer, Product, Raised to, Status, Date. Search by claim ID, customer or chassis.')])

C['D38'] = dict(purpose='The form a dealer fills to claim warranty on a customer\'s vehicle or part.',
 mock=[F('New warranty claim', ['Raised to*|OEM','Product type*|Spare','Select Vehicle*|Tera Zip · CH-1042','Select Spare*|Battery','Select serial number(s)*|~SN-8841','Issue*|Cell swelling','Still Warranty*|~Yes (from invoice date)','Remarks*|Seen after charging','Claim images|photo.jpg'], actions='Claim warranty')],
 questions=[
  Q('Which items can be claimed, and who keeps that list up to date?', 'The spare list is fixed in the screen. Feedback from Vishnavi: "more items to add in warranty list in future".', 'Keep the warrantable items as master data that an OEM admin can extend (battery, motor, controller, charger to start), not a fixed list.', raised=['Feedback from Vishnavi (walkthrough feedback, 27 Oct)']),
  Q('Is "Still Warranty?" typed by the dealer or worked out by the system?', 'The field is required with no rule.', 'The system works it out from the invoice date and the product\'s warranty period. The dealer cannot change it.'),
  Q('Which images or files are allowed, and how many?', 'The spec lists "Claim images" with no limits.', 'Images or short video, up to 5 files, 10 MB each.')])

C['D39'] = dict(purpose='Dealer-side view of one warranty claim as it moves from raised, to OEM inspection, to repair or replacement.',
 mock=[D('Claim WC-014', ['~Claim details','~Photos','~History'], ['Status|Raised to OEM','Product|Battery','Service charge|₹1,500 (asked by OEM)'], actions='Mark in transit|Pay service charge|Confirm receipt|Report post-receipt issue')],
 questions=[
  Q('What fields does "Claim details" show?', 'The spec gives no fields for this heading. The tour shows "Not defined".', 'Claim ID, customer, vehicle and chassis, part and serial, issue, date raised, current status, photos.'),
  Q('What are the claim statuses, in order?', 'The spec names a few (in transit, verify, inspect, service) but not the full list. The tour composed the rest.', 'Raised, Verified, In transit, Received, Inspecting, Service or replacement, Awaiting service charge, Completed, Rejected.', raised=['Feedback/assumption.md #14']),
  Q('When the OEM asks for a service charge, who pays: the customer, the dealer, or is it set per case?', 'The workflow leaves this open. The tour does not show it.', 'The dealer pays the OEM; the dealer may pass it on to the customer. Record the charge on the claim.')])

C['D40'] = dict(purpose='Lists service jobs. A dealer opens a job card from it, or creates a new one.',
 mock=[L('Service jobs', '~Job #|~Customer|~Chassis|~Type|~Status', ['SV-031|Meena Sample|CH-1042|Free service|In progress'], actions='Create', filters='Status ▾')],
 questions=[
  Q('Which statuses does the filter offer?', 'The spec says "status filter" with no options.', 'Open, In progress, Completed, Invoiced.'),
  Q('Where does "open" go?', 'The spec lists "open" with no target.', 'The job card (D42).'),
  Q('Should Sales (S) be allowed to see the service list?', 'The spec lists D and V only, but the tour needs service staff in the dealer team.', 'Allow Dealer and Service. Sales has no access.', raised=['Feedback/assumption.md #20'])])

C['D47'] = dict(purpose='The dealer\'s own profile. Most of it is read-only; the dealer can set the shop location, upload documents and change the password.',
 mock=[D('Settings: Profile', ['Profile','~Documents','Shop location','Password'], ['Firm name|Sri Lakshmi EVs (contact OEM Admin)','~GST No|(read only)','Latitude|17.38','Longitude|78.48'], actions='Use my location|Save shop location|Upload|Change password')],
 questions=[
  Q('Which profile fields does the dealer see (read-only)?', 'The spec says all organisation, address, bank and login fields are read-only, but lists none by name. The tour shows only Firm Name.', 'Show everything the OEM captured on O05, read-only, plus a line "contact the OEM Admin to change".'),
  Q('What happens when the dealer saves the shop location, uploads a document or changes the photo?', 'The spec gives the endpoint only. The tour shows a message.', 'Location saves at once. Documents go to the OEM for approval, with the status shown (pending, approved, rejected). The photo saves at once.'),
  Q('Is changing the password forced at first sign-in?', 'The spec makes it optional.', 'Forced on first sign-in, because the OEM set the first password.')])

C['D48'] = dict(purpose='The dealer owner\'s list of the dealer\'s own staff users.',
 mock=[L('Users', '~User ID|~Name|~Role|~Contact|~Email|~Status', ['SL-0002|Swati Sample|Sales Man|90000 00005|swati@example.com|Active'], actions='Create', search='Search')],
 questions=[
  Q('Which columns does the list show?', 'The spec says "search, create, edit" only. Columns come from the OEM users screen (O52).', 'User ID, Name, Role, Contact, Email, Status, and an Edit button.'),
  Q('Can the dealer owner deactivate a user, and can the owner change a user\'s password?', 'The spec gives edit only.', 'Yes to deactivate (status Inactive, history kept). The owner can set a new password for staff.', raised=['Feedback/assumption.md #20'])])
