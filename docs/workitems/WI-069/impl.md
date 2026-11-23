# WI-069: Manufacturing unit: create, edit and view

Applications: api (primary), web

Requirement REQ-368 · Feature FEAT-1331 · Decision DEC-403

Written for: engineers implementing manufacturing units in the api and web apps.

## Approach
- api (primary): a manufacturing unit record with name, address, city, GST number, bank details, phone, email, latitude and longitude, as in the `manufacturing_units` design in docs/project/db_design.md. Endpoints to create, read and edit a unit. OEM admin only.
- api: the name is unique per tenant (UQ tenant_id, name). A duplicate name is refused with a clear message, not overwritten.
- api: edit saves the change at once; the next read returns the new values (no stale cache for this resource).
- api: latitude and longitude are optional numbers within valid ranges (-90 to 90, -180 to 180).
- web (other): the unit screen per the mock (Manufacturing Unit > New): Name and GST on the first row, Address, City, Phone, Email, Lat, Long and Bank, with a "Save unit" action. Edit reuses the same form. The unit view shows the details.

## Areas and files likely affected
To be confirmed in the preview. Candidates from the current repo state:
- apps/api/src/db/schema.ts (manufacturing units table, Drizzle definition)
- apps/api/src/ (new unit module: service, routes and validation, following the vendor master in apps/api/src/procurement/vendors.ts and vendorRoutes.ts; name to be fixed in the preview)
- apps/api/src/glue/routes.ts (register the unit routes at the knm markers)
- apps/api/tests/modules/ (contract tests: create with all fields, duplicate name refused, edit visible at once, invalid coordinates refused)
- apps/web/src/app/ (unit form and unit view; the mock is the reference; follow the vendor screens in apps/web/src/app/procurement/)
- apps/web/src/app/router.tsx (routes for the unit form and view)

## Risks
- The unit name is unique per tenant. Two OEM admins saving the same name at once must not both succeed; the unique constraint is the guard, not the form check alone.
- Bank details and GST are letterhead data. They are stored as entered; no format check beyond non-empty text in this scope, so a wrong GST is not caught here.
- The view's connected-dealers list cannot be built until dealers exist (see Dependencies).

## Assumptions
- Only the OEM admin can create and edit a unit (role per REQ-369, OEM users and roles; that requirement is still `created`, so the check uses the existing sign-in role, dealer owners excluded).
- Deleting a unit is out of scope; the `deleted_at` soft-delete column is added to the table but no delete endpoint is built.
- GST is free text in this scope (no GSTIN auto-fill; the same open provider question as WI-035 applies).
- Latitude and longitude are entered by hand; no map picker.

## Dependencies
- Depends on: 1 OEM: Regions, zones and operating states (REQ-367, status `created`). Not needed for the fields listed in this item; it is listed in req.md, so noted here.
- Connected dealers in the unit view (criterion 3) depend on the dealer model. WI-065 (dealer onboarding) is finalized but not implemented, and the dealer model decision is still open (tenant vs `dealers` table). Until then the view shows the unit details and an empty connected-dealers section.
- Needed by: dealer onboarding (REQ-373, WI-065), which requires a unit for every dealer, and dealer purchase orders (REQ-378, WI-064), which take stock from a unit.

## Out of scope
- Unit delete.
- Connected-dealers list (deferred to the dealer model).
- Stock per unit (REQ-375 and the stock work).
