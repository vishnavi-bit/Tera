# WI-065: Dealer onboarding: create dealer with region, zone, unit and login

Applications: api (primary), web

Requirement REQ-373 · Feature FEAT-1336 · Decision DEC-408

Written for: engineers implementing dealer onboarding in the api and web apps.

## Approach
- api (primary): a dealer record with type, owner, firm, GST, region, zone, manufacturing unit, billing and shipping address and bank details. Create and read endpoints, OEM admin only.
- api: region, zone and unit are required. A dealer without any of them is refused with a clear message. Zone must belong to the chosen region. Enforced server-side, not only in the form.
- api: saving a dealer creates its login (user ID and password) in the same step. If the login cannot be created, the dealer is not saved (one transaction). Passwords are hashed with the existing password helper.
- api: the dealer can sign in with the new login. Sign-in reuses the existing sign-in route; the dealer's user carries the dealer role and is scoped to its dealer.
- web (other): the new dealer screen per the mock (Dealers > New): Type, Owner, Firm, GST, Region, Zone, Unit, billing and shipping address, login user ID and password, and a "Create dealer" action. Zone choices follow the chosen region; Unit lists the manufacturing units.

## Areas and files likely affected
To be confirmed in the preview. Candidates from the current repo state:
- apps/api/src/db/schema.ts and the migration list (dealers table, linked to the dealer's login user)
- apps/api/src/auth/accounts.ts and apps/api/src/auth/passwords.ts (login creation, reuse of password hashing)
- apps/api/src/glue/routes.ts (register the new dealer routes at the knm markers)
- apps/api/src/ (new dealer module: service, routes and validation; name to be fixed in the preview)
- apps/api/tests/modules/ (contract tests: create with all fields, login created in the same step, refusal without region, zone or unit, sign-in as the new dealer)
- apps/web/src/app/ (new dealer form screen; the mock is the reference)
- apps/web/src/app/router.tsx (route for the dealer form)

## Risks
- The dealer needs regions, zones and manufacturing units to exist before it can be saved. Their requirements REQ-367 and REQ-368 are still `created` (not approved). Until they are built, the region, zone and unit choices can only be tested with seeded data.
- A login created without a dealer, or a dealer without a login, would break the sign-in criterion. Both must be created in one transaction.
- Dealer login names must be unique across users; a clash must refuse the save, not overwrite an existing user.

## Assumptions
- Only the OEM admin can create and read dealers (role per REQ-369, OEM users and roles).
- Type values come from the dealer types already in the design (for example Area Dealer); the list is fixed in this scope.
- Dealer edit is not in this scope; only create and read.
- Sign-in as the dealer succeeds; what the dealer sees after sign-in (its tier's catalogue, criterion 4) depends on REQ-372 (spares and components catalogue) and REQ-371 (vehicle models and tiers), which are still `created`. This item delivers the login and the sign-in; the catalogue view is deferred to those items.
- The GSTIN auto-fill from the GST portal is out of scope (open question N01, same provider question as the vendor master, WI-035). GST is entered by hand.

## Dependencies
- Depends on: 1 OEM: Regions, zones and operating states (REQ-367, status `created`); 2 OEM: Manufacturing unit setup (REQ-368, status `created`); 3 OEM: OEM users and roles (REQ-369, status `created`).
- Needed by: dealer purchase order (REQ-378, WI-064), which requires a dealer to place an order.

## Out of scope
- Dealer edit, deactivation and tier change.
- GSTIN auto-fill from the GST portal.
- The dealer's catalogue view after sign-in (depends on REQ-371 and REQ-372).
