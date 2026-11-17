# Gap list: Pre-approve a guest

There is **no Resident App specification**. Screens are derived from the Guard App documents (`docs/resident_app_scope.md`). Sequence: `sequences/pre-approve-guest.json`. Seed (demo data): `mock-app/mock-data/seeds/pre-approve-guest.json`.

## Spec gaps

1. **Pass fields.** Name, validity and category are implied by the Guard documents; the form fields (date, valid until, purpose, phone) are the walkthrough's own.
2. **Pass reuse and validity.** What counts as a valid pass and whether it can be reused for repeat visits is a sponsor question (UI requirements section 8, question 3). "Pass use" shows a "Not defined" alert.
3. **Sharing.** The pass can be received "through WhatsApp or another channel". How the Resident App sends it is not defined; Share pass shows a toast. WhatsApp integration is out of scope.
4. **QR content.** A QR image is not proof by itself and must be checked against an authorised record. The pattern shown is a made-up demo picture.
5. **Revoking.** The Guard documents say a pass may be revoked or expired but not how the resident revokes it.
6. **Guests on a list with no pass.** Flow B (list without a pass) has no resident-side screen.
