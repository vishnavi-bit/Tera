# Startup Readiness Score

The primary hook. It is shown as a teaser (number and band only) before payment and in full after payment.

## Structure (total 100)

| # | Category | Max | How scored |
|---|---|---|---|
| 1 | Idea Clarity & Market Fit | 25 | AI (structured JSON) |
| 2 | Execution Readiness | 20 | AI (structured JSON) |
| 3 | Financial Preparedness | 20 | **Rule-based** (budget dropdown + signals) |
| 4 | Skill & Domain Alignment | 20 | AI (structured JSON) |
| 5 | Location & Context Advantage | 15 | **Rule-based** (city data) |

`total = idea_clarity + execution + financial + skill_alignment + location`

The AI never invents a free-form total. It returns per-category scores and a rationale for categories 1, 2 and 4 only.

## Bands

| Range | Label | Colour |
|---|---|---|
| 0–30 | Early Explorer | red `#EF4444` |
| 31–50 | Idea Stage | orange `#F97316` |
| 51–70 | Ready to Plan | yellow `#EAB308` |
| 71–85 | Launch-Ready | green `#22C55E` |
| 86–100 | Strong Founder | blue `#1A56DB` |

## Key scoring rules (summary)

- **Idea clarity (25):** specific description +8 (vague +4); stage Idea +2 / Prototype +6 / Revenue +10; recognised domain +4; named customer or problem +3.
- **Execution (20):** concern "first customer" +8 / "validate" +6 / "funding" +4 / "don't know where to start" +2; prior research +6; Prototype or Revenue stage +6.
- **Financial (20):** budget < ₹10k = 4, ₹10–50k = 8, ₹50k–2L = 14, ₹2–10L = 18, > ₹10L = 20; +2 named funding source; +2 open to risk; cap 20.
- **Skill (20):** skills match domain +10; interests align +6; relevant experience +4; stretch domain +4.
- **Location (15):** online/pan-India = 10 fixed. Big city (> 10 lakh) with demand = 15, mid (2–10 lakh) = 10, small or no demand = 5. No city data = 7.

## Edge cases

| Situation | Handling |
|---|---|
| "Online" chosen for an inherently local business | Location = 5, flagged in rationale |
| City not in data | Location = 7, report notes data is unavailable |
| Idea has < 10 meaningful words | Idea clarity capped at 8, encourage refinement |
| Budget < ₹10k with a capital-heavy domain | Low financial score plus mismatch note |
| Stage = Revenue | Total floored at 55 |

## Display rules

| Where | Shown |
|---|---|
| Stage 3 teaser | Total and band label only; breakdown blurred; no rationale |
| ₹59 report | Total, 5 category scores, minimal rationale |
| ₹199 report | Plus full rationale and what to improve |
| ₹2,999 report | Plus personalised action items per weak category |

> **Pre-payment:** the teaser uses a *provisional* score from deterministic rules; the AI rubric runs after payment. See [08_prepayment_strategy.md](08_prepayment_strategy.md).

---
[← Index](00_README.md)
