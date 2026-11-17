# Gap list: Visitor leaves, guard checks out

Source of truth: `docs/guard_app_ui_requirements_v0_1.md` and `docs/guard_app_build_context_v0_1.md` (read only). Sequence: `sequences/visitor-exit.json`. Seed (demo data): `mock-app/mock-data/seeds/visitor-exit.json`.

## Spec gaps

1. **Flow letters.** UI requirements call this Flow E; build context calls it Flow F.
2. **Confirmation.** The UI guidance asks for confirmation before finalising an exit record. The mock shows an inline confirm card with the exit time, gate and guard.
3. **Exit time.** The time shown (11:30) is demo data.
4. **Search and filter.** S07 names search by visitor, flat, category or entry time. The search box only shows a toast.
5. **Overdue limits.** Not confirmed (build context section 8). One overdue row is shown in demo data.
6. **Correcting a wrong check-out.** The documents ask for recoverable errors with an audit trail, but no screen or rule is defined.

## Walkthrough notes (not spec gaps)

- Only the visitor the tour names has a working Check Out; other rows show a toast.
