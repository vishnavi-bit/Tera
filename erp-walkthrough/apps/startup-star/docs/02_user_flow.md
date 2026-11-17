# How It Works — End-to-End Flow

```
 Ad / SEO ──► Persona landing page ──► Intake (4 stages) ──► Paywall ──► Report ──► Follow-up
                 (score teaser)        S1 → S2 → S3 → S4     ₹59/199/2999   PDF      Day 1/2/3
```

| Stage | Name | What happens | Output |
|---|---|---|---|
| Attract | Landing page | Persona-specific promise, score teaser, pricing, one CTA | Click into intake |
| **1/4** | Business Context | Idea (≤50 words), stage, main concern, city or online | 4 core inputs |
| **2/4** | Deep Input | Interests, skills, budget, business type, then AI follow-up questions | Rich profile |
| **3/4** | Preview & Pay | Score teaser, 1 sample idea, blurred report. Then name, email and phone (WhatsApp OTP), plan, payment | Paid order |
| **4/4** | Confirm & Generate | Summary of all inputs, user comments or edits, regenerate, confirm. Then PDF generated and download link | PDF report |
| Retain | Follow-up | WhatsApp and email Day 1/2/3, upsell | Upgrade, call, incubation |

**Cross-cutting rules**
- Progress is always shown as **Stage n/4** and **Step n/m**.
- The session is persisted, so a refresh does not lose progress.
- Google OAuth (Firebase Auth) is available any time before payment.
- Report generation is triggered by the **Razorpay webhook**, never by client-side success.
- The PDF is permanent after purchase and is accessed via a signed URL from the dashboard.

> **Token policy:** pre-payment steps use rules, a question bank and an idea library, not live AI. See [08_prepayment_strategy.md](08_prepayment_strategy.md).

---
[← Index](00_README.md)
