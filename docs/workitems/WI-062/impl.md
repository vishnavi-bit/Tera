# WI-062: Dealer staff accounts - implementation approach

Applications: api (primary), web

Requirement: REQ-374 (Dealer staff accounts). Decision DEC-409, feature FEAT-1337.

## Approach

API (primary): extend the existing accounts model for dealer staff.

- Add a migration after `005-auth` that adds a `phone` column to `users` and keeps `roles` as the JSON array already used. Staff roles are `salesman` and `serviceman`; `owner` is held only by the dealer owner account.
- Add staff routes for the dealer owner: list staff of the owner's tenant, create a staff user (role, name, email, phone, password), and edit a staff user (name, email, phone, role among Salesman and Serviceman, optional password reset). Create and edit both go through the auth/accounts service, which hashes the password with the existing `passwords.ts`.
- The owner role check is enforced on the server: an edit that sets `owner` in roles, or that targets the owner account's role, is rejected. The UI alone is not relied on.
- Sign-in already exists (`loginRoutes.ts`). A staff user signs in through it. Their tenant id comes from the token, so every tenant table read goes through the tenant-scoped path (`tenantContext.ts`, `tenantDb.ts`). Staff see only their dealer's data.
- Audit the create and edit actions through the existing audit trail (`audit/auditTrail.ts`).

Web (other): add a Staff page for the dealer owner.

- New route under `apps/web/src/app/` (staff) registered in `router.tsx`, following the procurement pattern: a list (like `VendorList.tsx`) and an add/edit form (like `VendorForm.tsx`) with name, role radio (Salesman, Serviceman), email, phone and password (add only). The owner row is shown read-only and is not selectable as a role.
- State follows `createStore.ts` / `useAsync.ts`, as `procurementStore.ts` does.
- Sign-in page (`SignInPage.tsx`) is reused unchanged for staff users.

## Areas and files likely affected

- apps/api/src/auth/accounts.ts (users read/write, roles, phone)
- apps/api/src/auth/passwords.ts (hash on create and password change)
- apps/api/src/auth/loginRoutes.ts, authMiddleware.ts, jwt.ts (staff sign-in, role claims) - check only, no change expected
- apps/api/src/tenancy/tenantContext.ts, tenantDb.ts (dealer scoping) - check only
- apps/api/src/procurement/migrations.ts pattern for the new migration; apps/api/src/db/migrate.ts
- apps/api/src/audit/auditTrail.ts (audit calls)
- apps/api/src/glue/routes.ts (mount the staff routes)
- apps/api/tests/modules/sign-in/ and apps/api/tests/modules/multi-tenant/ (new contract tests for create, edit, owner guard, scoping)
- apps/web/src/app/router.tsx, new staff page and form under apps/web/src/app/
- apps/web/src/state/ (staff store)
- apps/web/tests/ (page and form tests, following the procurement tests)

## Risks

- The owner role must never be granted by an edit. Enforced in the API and covered by a contract test.
- A staff user must not reach another dealer's rows. Covered by an isolation test against the tenant-scoped path.
- `users.email` is globally unique (existing schema). A duplicate email across dealers returns a conflict; the UI shows it.
- The phone column is a schema change on an existing table. The migration must be additive and must not drop data.
- Sign-in rate limiting (`loginRateLimit.ts`) applies to staff too; no change intended.

## Assumptions

- A dealer is one tenant; its owner and staff are users of that tenant.
- Staff roles are stored in the existing `roles` JSON column as `salesman` or `serviceman`.
- Only the dealer owner can manage staff; a staff user cannot create or edit users.
- Phone is free text and not validated beyond being present.
- No change to the OEM admin account behaviour.
