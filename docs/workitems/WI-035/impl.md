# WI-035: Vendor master: create, edit and deactivate vendors

Applications: api (primary), web

Requirement REQ-370 · Feature FEAT-1333 · Decision DEC-405

Written for: engineers implementing the vendor master in the api and web apps.

## Approach
- api (primary): a vendor record with name, contact, phone, email, GST, address, notes and an active flag. Endpoints to create, read, edit and deactivate a vendor. Deactivation sets the active flag to false; no hard delete.
- api: the rule that an inactive vendor cannot be chosen on a new spare or a new vendor PO. This is enforced server-side when a spare or PO references a vendor, not only in the UI.
- web (other): a vendor screen per the mock (Vendors > New): Name and Active on the first row, then Contact, Phone, Email, GST, Address and Notes, with a "Save vendor" action. Edit and deactivate reuse the same form.
- The vendor list used by spare and PO pickers shows active vendors only.

## Areas and files likely affected
To be confirmed in the preview. Candidates from the current repo state:
- apps/api/src/db/schema.ts (vendor table and migration)
- apps/api/src/procurement/ (vendor routes, service and validation)
- apps/api/tests/modules/procurement-po/ (inactive-vendor rule on PO creation)
- apps/web/src/app/procurement/ (vendor form and list)
- apps/web/src/state/procurementStore.ts (vendor selection state)

## Risks
- Spares and POs that already reference a vendor must keep working when that vendor is deactivated. Deactivation must not break existing links.
- The inactive-vendor rule must hold for any path that sets a vendor, including API calls that bypass the web form.
- Field validation for GST and email formats must not block saving a vendor whose GST is not yet known (GST is entered by hand in this scope).

## Assumptions
- Create and edit are open to the OEM admin role only (roles per the OEM users and roles feature, REQ dependency 3).
- The active flag defaults to true on create.
- Editing an inactive vendor is allowed; only choosing it on new spares or POs is blocked.

## Out of scope
- GSTIN auto-fill from the GST portal (open question N01 in req.md; needs an external integration partner).
