# WI-067: Manufacturing unit - create, edit and view - implementation approach

Applications: api (primary, APP-037), web (other, APP-036)

Requirement: REQ-368 (Manufacturing unit setup). Decision DEC-403, feature FEAT-1331.

## Approach

API (primary): the manufacturing unit master, tenant-scoped.

- Migration `007-manufacturing-units` creates `manufacturing_units` from `docs/project/db_design.md`: `id`, `tenant_id`, `name` (UNIQUE per tenant), `address`, `city`, `gst_number`, `bank_details`, `phone`, `email`, `latitude` (REAL), `longitude` (REAL), `deleted_at`, `created_at`, `updated_at`. Additive, a new table only. It is migration 007 because the dealers table (WI-063) references it.
- Data path `apps/api/src/manufacturing/units.ts`, through `apps/api/src/tenancy/tenantDb.ts` as `apps/api/src/procurement/vendors.ts` does: create, get by id, list, and edit. Edit sets only the fields sent; `updated_at` is set on each change.
- Validation: name required and unique per tenant (duplicate returns 409); GST, when given, is 15 characters; latitude is between -90 and 90 and longitude between -180 and 180; email, when given, is a valid email; each text field has a length cap, as `TEXT_FIELDS` does in `vendors.ts`.
- Routes `apps/api/src/manufacturing/unitRoutes.ts`, mounted in `apps/api/src/glue/routes.ts`: `GET /api/manufacturing-units`, `GET /api/manufacturing-units/:id`, `POST /api/manufacturing-units`, `PATCH /api/manufacturing-units/:id`. Create and edit need the `super-admin` role (`OEM_ADMIN_ROLE` in `vendorRoutes.ts`).
- Edit is visible at once: unit GET routes are excluded from the response cache (`apps/api/src/cache/cacheMiddleware.ts`), or the cache for `/api/manufacturing-units` is cleared on every write.
- Audit `unit.create` and `unit.update` through `apps/api/src/audit/auditTrail.ts`.
- Add the `manufacturingUnits` table to `apps/api/src/db/schema.ts`; register `MANUFACTURING_MIGRATIONS` in `apps/api/src/db/migrate.ts` with the other lists.

Web (other): the create, edit and view screens.

- `apps/web/src/app/manufacturing/UnitForm.tsx` follows `docs/requirements/REQ-368/mock.md`: name, GST, address, city, phone, email, latitude, longitude, bank details, and a Save unit button. The same form is used to create (`/manufacturing-units/new`) and edit (`/manufacturing-units/:id/edit`).
- `apps/web/src/app/manufacturing/UnitView.tsx` shows the unit's details at `/manufacturing-units/:id`. The edit link goes to the form.
- Required fields and the API error are shown inline on the form.
- State in `apps/web/src/state/manufacturingStore.ts`, built on `createStore.ts` and `useAsync.ts`, as `procurementStore.ts` does. After a save the view reloads from the API so the change shows at once.
- Routes are registered in `apps/web/src/app/router.tsx` inside the existing sign-in guard.

## Areas and files likely affected

- apps/api/src/manufacturing/units.ts (new): create, get, list, edit with validation
- apps/api/src/manufacturing/unitRoutes.ts (new): the four routes
- apps/api/src/manufacturing/migrations.ts (new): `MANUFACTURING_MIGRATIONS` with `007-manufacturing-units`
- apps/api/src/db/schema.ts (manufacturingUnits table)
- apps/api/src/db/migrate.ts (register the migrations)
- apps/api/src/glue/routes.ts (mount the unit routes)
- apps/api/src/cache/cacheMiddleware.ts (exclude unit reads, or clear on write) - check, change only if needed
- apps/api/src/audit/auditTrail.ts (unit.create, unit.update) - use only
- apps/api/tests/modules/manufacturing-units/contract/units.test.ts (new): create with all fields, required name and duplicate name 409, GST and coordinate limits, edit visible on the next GET, a cached read is not stale after edit
- apps/web/src/app/manufacturing/UnitForm.tsx (new)
- apps/web/src/app/manufacturing/UnitView.tsx (new)
- apps/web/src/app/router.tsx (the unit routes)
- apps/web/src/state/manufacturingStore.ts (new)
- apps/web/tests/modules/manufacturing-units/contract/UnitForm.test.tsx (new): fields render as in the mock, required name blocks save, API error shown inline
- apps/web/tests/modules/manufacturing-units/contract/UnitView.test.tsx (new): details shown after a save

## Risks

- Acceptance criterion 3 is delivered in part. The view shows the unit's details. The connected-dealers list needs the `dealers` table from WI-063, so it is added when WI-063 is merged, not in this work item.
- Migration order. `007-manufacturing-units` must run before WI-063's dealers migration, which is renumbered to `009`. Price tiers take `008` in WI-068 (REQ-371).
- A stale cached read after edit would break acceptance criterion 2. Covered by the cache test above.
- The unit's GST and bank details are business data. They are stored as entered and never logged.

## Assumptions

- The OEM has one tenant; units belong to that tenant.
- Unit name is unique per tenant (the design doc's UNIQUE constraint).
- Latitude and longitude are optional, and when given must be in range.
- Only the `super-admin` role manages units; other signed-in users can read them.
- Deleting a unit is not in this requirement; the table keeps `deleted_at` for a later work item.
