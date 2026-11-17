# Gap list: Pre-approved guest, resident creates pass, guard scans it

Sources (read only): `apps/guard/docs/*`; Resident screens are derived (`apps/resident/docs/resident_app_scope.md`). Sequence: `sequences/pre-approved-guest.json`.

## Spec gaps

1. **Pass fields, reuse and validity.** Not defined (UI requirements section 8, question 3). "Pass use" on R04 shows a "Not defined" alert.
2. **How the pass reaches the guest.** WhatsApp or another channel is named, but not designed. In this tour "Share pass" only moves the tour on to the gate.
3. **Pass validation.** A QR image is not proof by itself and must be checked against an authorised record. The QR shown is a made-up picture and the scan is simulated by "Scan demo pass".
4. **Resident availability for a pre-approved visitor.** Not defined; S06 shows a "Not defined" alert.
5. **Scan results other than Valid.** Only Valid is shown.

## Walkthrough notes (not spec gaps)

- One phone shows both apps; the guard and resident would use separate devices.
