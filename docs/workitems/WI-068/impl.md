# WI-068: Price tiers - the five dealer price tiers - implementation approach

Applications: api (primary, APP-037)

Requirement: REQ-371 (Vehicle models with variants and five price tiers). Decision DEC-406, feature FEAT-1334.

## Scope

Agreed with the product owner: this work item covers the five price tiers only. Vehicle models, variants, colours, prices per variant and per-unit availability (the rest of REQ-371) are left for a later work item.

## Approach

API (primary): the price tier reference list.

- Migration `008-price-tiers` creates `price_tiers` as a shared reference table, with no `tenant_id` (the design doc's exception for reference lists): `code` TEXT PRIMARY KEY, `label` TEXT NOT NULL, `sort_order` INTEGER NOT NULL DEFAULT 0. The `code` has a CHECK limiting it to the five codes below.
- The same migration seeds five rows, in this order:
  - `distributor` - Distributor - 1
  - `divisional_distributor` - Divisional Distributor - 2
  - `district_dealer` - District Dealer - 3
  - `area_dealer` - Area Dealer - 4
  - `customer` - Customer - 5
- Read path `apps/api/src/pricing/priceTiers.ts`: list all tiers ordered by `sort_order`, and get one by code. No write path: the five tiers are fixed by the requirement.
- Route `GET /api/price-tiers` in `apps/api/src/pricing/priceTierRoutes.ts`, for any signed-in user. It is the source of the tier choices on the dealer form (WI-063), and the dealer's tier is checked against these codes there.
- Mount the route in `apps/api/src/glue/routes.ts`. Add the `priceTiers` table to `apps/api/src/db/schema.ts`. Register `PRICE_TIER_MIGRATIONS` in `apps/api/src/db/migrate.ts`.

## Areas and files likely affected

- apps/api/src/pricing/migrations.ts (new): `PRICE_TIER_MIGRATIONS` with `008-price-tiers` (table and the five seed rows)
- apps/api/src/pricing/priceTiers.ts (new): list and get by code
- apps/api/src/pricing/priceTierRoutes.ts (new): `GET /api/price-tiers`
- apps/api/src/db/schema.ts (priceTiers table)
- apps/api/src/db/migrate.ts (register the migrations)
- apps/api/src/glue/routes.ts (mount the route)
- apps/api/tests/modules/price-tiers/contract/priceTiers.test.ts (new): exactly five tiers in the order above with their labels, the route needs a signed-in user, an unknown code is rejected by the CHECK constraint, and a second run of the migration does not duplicate the seed

## Risks

- Migration order: `008-price-tiers` runs after `007-manufacturing-units` (WI-067) and before WI-063's dealers migration, now renumbered to `009`. WI-063's plan must be updated to match.
- The tier label "Customer" is both a price tier and a customer type in the design doc. This work item only seeds it as a tier; the customer type is not built here.

## Assumptions

- The five codes and labels are the ones in the requirement and in `docs/project/db_design.md`.
- Price tiers are the same for every tenant, so the table has no `tenant_id`.
- Only the list and get reads exist; the tiers are not edited through the API.
