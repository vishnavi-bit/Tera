# Gap list: OEM security and audit

Sequence: `sequences/oem-security-audit.json`. Seed (sample data): `mock-app/mock-data/seeds/oem-security-audit.json` (the company, OEM users and lists are copied from the OEM setup sample). Screens: O54 and O55 (new); O49 and O53 (reused unchanged from the OEM setup walkthrough).

## Spec gaps

1. **ADM is not in `docs/people.md`.** O54, O55 and O49 are ADM in the spec. Charan (`oem-super-admin`) is the actor, as an assumption.
2. **O54 has no column list.** The spec gives no audit log columns. The three columns shown are Feature, Action and Date, taken from the filter labels (assumption).
3. **O54 filter values are not defined.** Each filter (Feature, Action, Date) shows only "All".
4. **O54 diff content is not defined.** The expand diff step records the click. No diff is shown.
5. **N15 audit purge** is super admin only, with a configurable retention date. It has no screen. The card on step 2 (on O54) says so.
6. **N16 audit export** is customer-facing. It has no screen. The card on step 2 (on O54) says so.
7. **O55 My devices columns and device data are not defined.** The card on step 3 says so. No device list is shown.
8. **O55 sign out other devices and sign out everywhere have no stated effect.** Each shows a toast saying that no device is signed out.
9. **O55 Default device limit (deviceLimit)** is a number field. The effect is not defined. It shows the sample value.
10. **O55 accounts table** uses the spec columns: account, role, devices, limit, last active. The values are sample data.
11. **N22 OEM compliance fields** (CIN, TAN, PAN, MSME, IEC, Directors Details) have no screen. The card sits on the O49 step (O49 is reused unchanged).
12. **N28 expanded role taxonomy** (Procurement Manager, Inventory Manager, National Sales Head, Area Sales Manager) has no screen. The card sits on the O53 step (O53 is reused unchanged). O53 already shows its own "Not defined" alert on User Role, from the OEM setup walkthrough. That alert is unchanged.
13. **O49 and O53 are shared with the OEM setup walkthrough.** Both are reused unchanged, so their behaviour does not change. The O49 save approval email button has no rule in this tour, which the validator reports as an expected warning.

## Assumptions and decisions (approved)

14. **The five steps:** O54 click expand diff (action), O54 with the N15 and N16 card, O55 with its card, O49 with the N22 card, O53 with the N28 card (end). A step with a card carries no action, so the expand click has its own step.
15. **No floater.** The tour browses and changes nothing.

## Walkthrough notes (not spec gaps)

- O54 and O55 are new. O49 and O53 are unchanged.
- The registry import is bumped to `?v=10` in `router.js`, `apps/everp/mock-app/index.html` and `walkthrough/src/main.js`.
