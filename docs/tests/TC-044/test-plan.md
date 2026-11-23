# TC-044: Dealer staff accounts - test plan

- Requirement: REQ-374 (Dealer staff accounts)
- Work item: WI-062 (api primary, web)
- Acceptance source: docs/requirements/REQ-374/req.md (acceptance criteria 1-3) and docs/requirements/REQ-374/mock.md
- Implementation source: docs/workitems/WI-062/impl.md

## Test data

- Dealer A (tenant A): owner account `owner.a@example.test`, password set by the test.
- Dealer B (tenant B): owner account `owner.b@example.test`, one existing staff user `staff.b@example.test` (Salesman).
- All names, emails and phone numbers are placeholders.

## Scenarios

### S1 - Owner creates a Salesman (AC1)

Steps:
1. Sign in as owner of Dealer A.
2. Open Staff, choose Add staff.
3. Enter name, email, phone, password. Select role Salesman. Save.

Expected:
- The new staff user appears in the Staff list with role Salesman, name, email and phone.
- The user is stored under tenant A.
- The password is stored hashed, not in plain text.
- An audit entry records the create action.

### S2 - Owner creates a Serviceman (AC1)

Steps:
1. Sign in as owner of Dealer A.
2. Add staff with role Serviceman and all fields filled.

Expected:
- The user appears with role Serviceman.
- Role options in the form are exactly Salesman and Serviceman.

### S3 - Create rejects invalid input

Steps:
1. Add staff with the name empty, then with the email empty, then with the password empty, then with no role selected.

Expected:
- Each attempt is rejected with a visible validation message.
- No staff user is created.

### S4 - Create rejects owner role

Steps:
1. Send a create request through the API with role `owner`.

Expected:
- The request is rejected (client error).
- No user with role `owner` is created for tenant A.

### S5 - Duplicate email conflict

Steps:
1. As owner of Dealer A, add staff with the email of `staff.b@example.test` (existing user of Dealer B).

Expected:
- The request returns a conflict, and the UI shows the conflict message.
- No new user is created.

### S6 - Owner edits a staff user (AC3)

Steps:
1. Sign in as owner of Dealer A.
2. Open the Salesman created in S1, change name, phone and role to Serviceman. Save.

Expected:
- The list shows the new name, phone and role.
- The audit trail records the edit.

### S7 - Owner role cannot be set by edit (AC3)

Steps:
1. As owner of Dealer A, open a staff user and try to select Owner. (The form offers only Salesman and Serviceman.)
2. Send an edit request through the API with roles including `owner` for the staff user.
3. Send an edit request through the API that targets the owner account's role.

Expected:
- The UI does not offer Owner as a choice.
- Steps 2 and 3 are rejected by the server; the staff user and owner account roles are unchanged.

### S8 - Staff user signs in (AC2)

Steps:
1. Sign in with the email and password of the staff user created in S1.

Expected:
- Sign-in succeeds through the existing sign-in page.
- The session carries the staff user's role and tenant A.

### S9 - Staff user sees only own dealer's data (AC2)

Steps:
1. Sign in as the staff user of Dealer A.
2. Open the staff list and any other tenant-scoped list (for example enquiries or service jobs seeded for Dealer A and Dealer B).
3. Request a record that belongs to Dealer B by id.

Expected:
- Only Dealer A rows are returned.
- The request for the Dealer B record returns not found (or equivalent), not the record.

### S10 - Staff user cannot manage staff (assumption in WI-062)

Steps:
1. Sign in as the staff user of Dealer A.
2. Try to create and edit a staff user through the API and the Staff page.

Expected:
- Both attempts are rejected.
- No user is created or changed.

### S11 - Owner of Dealer A cannot see or edit Dealer B staff (tenant isolation)

Steps:
1. Sign in as owner of Dealer A.
2. Try to edit `staff.b@example.test` by id.

Expected:
- The request is rejected as not found; Dealer B's user is unchanged.

### S12 - Migration is additive

Steps:
1. Apply the WI-062 migration to a copy of the database that has existing users.

Expected:
- A `phone` column is added to `users`.
- Existing users and their `roles` values are unchanged; no rows are dropped.

## Out of scope for this plan

- Password change for an existing staff user on edit. The mock (REQ-374 mock.md) shows the password field for add only; WI-062 impl.md mentions an optional password reset on edit. This plan does not test that path. Decide and then add a scenario.
- Phone format validation (impl.md: free text, presence only).
