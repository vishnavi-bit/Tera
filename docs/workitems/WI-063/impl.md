# WI-063: Dealer onboarding - implementation approach

Applications: api (primary, APP-037), web (other, APP-036)

Requirement: REQ-373 (Dealer onboarding with login). Decision DEC-408, feature FEAT-1336.

## Answers this plan relies on

- q1: the dealer's tier is a field on the dealer form, added in this work item. The tier is stored on the dealer as `price_tier_code` (FK to `price_tiers.code`).
- q2: GSTIN auto-fill is out of scope (open question N01, same as the vendor master WI-035). `gst_number` is a plain text field.

## Approach

API (primary): add the dealer master and create the dealer with its login in one step.

- Migration `007-dealers` (after `006-staff-phone`) creates the `dealers` table from `docs/project/db_design.md`: `id`, `tenant_id`, `price_tier_code` (FK `price_tiers.code`), `firm_name`, `owner_name`, `gst_number` (nullable), `region_id` (NOT NULL, FK `regions.id`), `zone_id` (NOT NULL, composite FK `(zone_id, region_id)` to `zones (id, region_id)`), `unit_id` (NOT NULL, FK `manufacturing_units.id`), `billing_address`, `shipping_address`, `bank_details`, `deleted_at`, `created_at`, `updated_at`. It also adds nullable `dealer_id` to `users`. The migration is additive and drops nothing.
- Dealers are rows of the OEM tenant, not tenants of their own (see Assumptions). A dealer's owner is a `users` row in that tenant with `roles` = `["dealer-owner"]` and `dealer_id` set.
- Service `apps/api/src/dealers/dealers.ts`: `createDealer` validates the input (type = price tier code and must exist; region, zone and unit required; zone must belong to the region; firm and owner required), then in one transaction inserts the dealer and its owner user. The owner's password is hashed with the existing `apps/api/src/auth/passwords.ts`. If the login email already exists, the whole transaction rolls back and the call returns 409.
- Routes `apps/api/src/dealers/dealerRoutes.ts`, mounted in `apps/api/src/glue/routes.ts`: `POST /api/dealers` (create, OEM admin only, `super-admin` role as in `vendorRoutes.ts`) and `GET /api/dealers` (list, tenant-scoped). Validation failures return 400 with the field named; duplicate email returns 409.
- `apps/api/src/auth/accounts.ts`: `createUser` takes an optional `dealerId` and writes the `dealer_id` column. No other change to the accounts behaviour.
- Sign-in already exists (`apps/api/src/auth/loginRoutes.ts`). The new owner signs in through it. The sign-in response already carries the roles; add `dealerId` and the dealer's `price_tier_code` to the token claims in `apps/api/src/auth/jwt.ts` so the web app knows the tier. Catalogue data is not built here (see Assumptions).
- Audit the create action through `apps/api/src/audit/auditTrail.ts` (action `dealer.create`, with the new dealer id).
- Register `DEALER_MIGRATIONS` in the same list the routes migrate with, as `ACCOUNT_MIGRATIONS` and `PROCUREMENT_MIGRATIONS` already are (runner: `apps/api/src/db/migrate.ts`).
- Add the `dealers` table to `apps/api/src/db/schema.ts` (Drizzle definition, as the vendor tables are).

Web (other): add the New Dealer form.

- New `apps/web/src/app/dealers/DealerForm.tsx` following the layout in `docs/requirements/REQ-373/mock.md`: type (price tier select), owner, firm, GST, region, zone (filtered by the chosen region), unit, billing address, shipping address, bank details, login user ID (email), password, and a Create dealer button. The region, zone and unit lists come from the existing reference APIs of the prerequisite requirements (see Assumptions).
- Validation in the form mirrors the API: region, zone and unit are required and the button stays disabled until they are set. The API error is shown inline, not only in a toast.
- Route `/dealers/new` registered in `apps/web/src/app/router.tsx`, inside the existing sign-in guard.
- State in `apps/web/src/state/dealerStore.ts`, built on `createStore.ts` and `useAsync.ts`, as `procurementStore.ts` does.
- No list page in this work item; the mock shows only the New screen.

## Areas and files likely affected

- apps/api/src/dealers/dealers.ts (new): create dealer with its owner login in one transaction
- apps/api/src/dealers/dealerRoutes.ts (new): POST and GET /api/dealers
- apps/api/src/dealers/migrations.ts (new): `DEALER_MIGRATIONS` with `007-dealers` (dealers table, users.dealer_id)
- apps/api/src/db/schema.ts (dealers table definition)
- apps/api/src/db/migrate.ts (register the dealer migrations with the others)
- apps/api/src/auth/accounts.ts (createUser takes dealerId)
- apps/api/src/auth/passwords.ts (hash the owner password) - use only, no change expected
- apps/api/src/auth/jwt.ts (dealerId and price tier in claims)
- apps/api/src/audit/auditTrail.ts (dealer.create audit call) - use only
- apps/api/src/glue/routes.ts (mount the dealer routes)
- apps/api/tests/modules/dealer-onboarding/contract/dealers.test.ts (new): create with all fields, owner login created, missing region, zone or unit rejected, zone not in region rejected, duplicate email 409 with no partial rows, owner signs in
- apps/web/src/app/dealers/DealerForm.tsx (new)
- apps/web/src/app/router.tsx (add /dealers/new)
- apps/web/src/state/dealerStore.ts (new)
- apps/web/tests/modules/dealer-onboarding/contract/DealerForm.test.tsx (new): fields render as in the mock, required fields block save, API error shown inline

## Risks

- Prerequisite tables. `regions`, `zones`, `manufacturing_units` and `price_tiers` do not exist in the repository yet. The `dealers` foreign keys need them. If the prerequisite requirements are not built first, migration `007-dealers` fails: stop, do not create those tables here.
- Tenant model conflict with WI-062. WI-062 (`apps/api/src/staff/staff.ts`) scopes staff by tenant and assumes a dealer is one tenant. This plan puts dealers in the OEM tenant with `users.dealer_id`, as `docs/project/db_design.md` specifies. WI-062 must scope by `dealer_id` before both are merged. This plan does not edit the WI-062 files.
- `users.email` is globally unique in the existing schema, while the design doc says unique per tenant. Keep the existing constraint; a duplicate email returns 409 on create.
- The owner login must be created in the same transaction as the dealer. A failure must leave no dealer row without a login, and no login without a dealer.
- The dealer's firm and GST data are personal business data: the password is hashed and never returned or logged.

## Assumptions

- A dealer is a row in the `dealers` table of the OEM tenant, owned by a `users` row with role `dealer-owner` and `dealer_id` set (per `docs/project/db_design.md`).
- "Login user ID" on the mock is the login email. Sign-in already uses email, so no separate user ID is created.
- Tier options come from `price_tiers` (distributor, divisional_distributor, district_dealer, area_dealer, customer). The form shows the stored tier label.
- Catalogue visibility (acceptance 4) is delivered as far as this work item can: the owner signs in and the token carries the dealer's tier. The catalogue screen itself and the price data behind it do not exist in the repository and are not built here; a later work item covers them.
- The OEM admin who creates the dealer has the `super-admin` role, as vendor administration does.
- Region, zone and unit selection in the form reads the lists of the prerequisite requirements (Regions, zones and operating states; Manufacturing unit setup).
- No change to GST handling (q2) and no GSTIN lookup.
