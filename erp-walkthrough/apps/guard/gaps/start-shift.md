# Gap list: Guard starts a shift

Source of truth: `docs/guard_app_ui_requirements_v0_1.md` and `docs/guard_app_build_context_v0_1.md` (read only). Sequence: `sequences/start-shift.json`. Seed (demo data): `mock-app/mock-data/seeds/start-shift.json`.

## Spec gaps

1. **Sign-in method.** S01 says "signs in securely" only. The sign-in field shows a "Not defined" alert.
2. **Switching gates.** A guard cannot switch gates unless the administrator permits it. How that is permitted is not defined; "Request a different gate" shows a "Not defined" alert.
3. **Shift status values.** Only "shift status" is named. The mock uses "Not started" and "On shift since 08:00".
4. **Help and escalation (S09).** A route is required but who the guard reaches is not defined; "Call supervisor" shows a "Not defined" alert.
5. **S09 as tab or screen.** The documents allow a tab or section. The mock uses a tab on the bottom bar.
6. **Activity contents.** Entry, exit, approval and parcel events are named; the row layout is the walkthrough's own.

## Walkthrough notes (not spec gaps)

- The sign-in screen has no bottom bar; it appears after the shift starts.
