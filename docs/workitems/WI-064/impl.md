# WI-064: Dealer purchase order: cart, live stock and 16/20/32/40 total rule

Applications: api (primary), web

Requirement REQ-378 · Feature FEAT-1341 · Decision DEC-413

Written for: engineers implementing the dealer purchase order in the api and web apps.

## Approach
- api (primary): a dealer purchase order with a header (dealer, seller, status) and one or more lines (product, variant, colour, quantity). The order total is the sum of line quantities, calculated on read.
- api: the total rule is enforced server-side on place. A total not in 16, 20, 32 or 40 is refused with a clear message (for example "Total must be 16, 20, 32 or 40 units; current total is 18"). The UI check is only a convenience.
- api: live stock per line. The cart asks the api for the available stock of each product, variant and colour at the chosen seller, so the figure is current rather than cached from the last page load.
- api: a placed order is saved with status `pending` and is returned by the order list for the dealer.
- web (other): the new order flow per the mock (Purchase > New order, Step 2 of 3: Cart). Seller, product, variant and colour pickers, a quantity field with the stock figure beside it and an Add action, a running total with an OK indicator (16 / 20 / 32 / 40), and a Place order action. The placed order appears in the order list with status pending.

## Areas and files likely affected
To be confirmed in the preview. Candidates from the current repo state:
- apps/api/src/db/schema.ts (dealer order and order line tables, plus migration)
- apps/api/src/ (new dealer order module: routes, service and the total rule; name to be fixed in the preview)
- apps/api/src/procurement/ is the OEM-to-vendor purchase order and is not reused for this flow; only shared helpers may be imported
- apps/api/tests/modules/ (contract tests for place-order: allowed totals, refused totals, live stock, pending status)
- apps/web/src/app/ (new purchase order cart screen and order list; the mock is the reference)
- apps/web/src/state/ (cart state for the new order)

## Risks
- Stock shown in the cart can change before the order is placed. The place call must re-check stock and refuse a line that is no longer available, rather than trusting the figure on screen.
- The total rule must hold for any path that places an order, including API calls that bypass the web cart.
- Refused totals must leave the cart intact so the dealer can add or remove lines and try again.

## Assumptions
- The 16/20/32/40 rule applies to the order total whatever the seller is (manufacturing unit or higher-tier dealer). Acceptance criterion 3 states the rule without a seller condition. This is the open question in req.md; if the product owner says otherwise, the total check gets a seller condition and this item is re-planned.
- Only the dealer owner can place an order (role per dependency 7, OEM dealer onboarding with login).
- Quantity is a whole number greater than zero per line.
- Stock is the available quantity from the seller's catalogue and stock (dependency 6, spares and components catalogue).
- A placed order is not editable in this scope; status changes after pending are out of scope.

## Dependencies
- Depends on: 6 OEM: Spares and components catalogue; 7 OEM: Dealer onboarding with login.

## Out of scope
- Order approval, dispatch and invoicing beyond the pending status.
- Editing or cancelling a placed order.
