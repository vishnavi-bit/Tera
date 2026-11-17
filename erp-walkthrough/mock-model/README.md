# mock-model

Application shell mock (reference for later screens). One app, two portals (OEM / Dealer). Requirements and decisions: `docs/mock_app_req.md`.

## Run
From `erp-walkthrough/`:

    python3 -m http.server 8765

Open http://localhost:8765/mock-model/ and sign in with a name: Suresh, Ruby, Ganesh, Dhivyesh, Charan (OEM) or Ravi (Dealer). Any password works. Ganesh and Charan have several roles, so a Role list appears.

Sign in directly with `?user=Ravi` (optional `&role=<role label>`).

## What is built
- Header: menu toggle (icon-only / expanded; drawer on phones), OEM or Dealer label, notifications (5 most recent, Mark all read, Show all), user avatar (menu with name, Settings, Log out).
- Example screen: O03 Dashboard (OEM). Example popup: Edit slogan.
- Every other menu item shows a toast (or a "Not defined" alert) built from `screen_details.md`.
- No validation, calculation, access rules or saving. Refresh returns to login.

## Spec data
`data/spec/screens.json` is generated from `docs/screen_details.md`:

    node scripts/extract-spec.mjs

## Choices made where the spec was silent (please confirm or correct)
- Dealer user "Ravi" is a placeholder; `people.md` has no dealer users.
- People with several roles choose a role at login.
- Role code PM is taken to mean Production Manager, so O03 (all but PH, PM) shows "Not defined" for that role.
- Menu entries are an example list per portal, not a defined menu.
- Settings in the avatar menu shows "Not defined" (spec does not say which screen it opens).
- Dashboard filter values, KPI numbers and notification texts are sample data.
