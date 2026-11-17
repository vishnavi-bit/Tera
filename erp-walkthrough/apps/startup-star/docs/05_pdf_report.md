# The PDF Report

**Tech:** `@react-pdf/renderer`, A4, 20 mm margins, Inter font. It is generated in a Node Cloud Function triggered by the Razorpay webhook. It is stored in Firebase Storage at `reports/{user_id}/{report_id}.pdf` and served by signed URL.

## Page map by tier

| Section | Entry | Core | Premium |
|---|:-:|:-:|:-:|
| Cover | ✔ | ✔ | ✔ |
| Readiness score and breakdown | ✔ | ✔ | ✔ |
| "What we learned about you" (profile summary) | ✔ | ✔ | ✔ |
| Business analysis | 3 areas | 7 areas + quick-action tips | 7 areas + quick-action tips |
| Business ideas | 1 | 3 (best fit, alternative, stretch) | 3 |
| City intelligence (or "Selling online in India") | ✘ | ✔ | ✔ |
| 7-day action plan | ✘ | ✔ | ✔ |
| Templates | 3 basic | Expanded (adds registration checklist, P&L, feedback form, social checklist) | Expanded |
| 90-day roadmap (3 phases) | ✘ | ✘ | ✔ |
| Investor pitch guidance | ✘ | ✘ | ✔ (guidance only; does not write the pitch) |
| Consultation prep sheet (Calendly QR) | ✘ | ✘ | ✔ |
| Next steps / upsell | Upgrade to Core | Upgrade to Premium | Book call, join incubation |

The 7 analysis areas are Idea Validation, Target Customer, Revenue Model, Competitive Landscape, Required Skills, Common Mistakes and First Steps. Entry gets the 3 the AI judges most relevant to the user's main concern and business type.

## Design tokens

| Role | Value |
|---|---|
| Primary | `#1A56DB` |
| Accent | `#FDBA74` |
| Text / muted | `#111827` / `#6B7280` |
| Strength callout | green `#16A34A` |
| Watch-out callout | amber `#D97706` |
| Footer (all pages except cover) | Logo + service name · "n / N" · "Generated on [date] · Confidential" |

---
[← Index](00_README.md)
