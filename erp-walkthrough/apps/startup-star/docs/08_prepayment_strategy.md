# Pre-Payment Strategy: Persuade Cheaply

**Goal:** the visitor feels *"this already understands me, and the full report is worth paying for"* before paying, while unpaid visitors cost almost nothing in AI tokens.

**Principle:** spend tokens only **after** payment. Before payment, personalise with **rules, templates and pre-written content**, not live AI.

---

## Where the source docs spend AI before payment

| Step (source `21_func`) | Source behaviour | Pre-payment change |
|---|---|---|
| Stage 2 / Step 2: follow-up questions | AI-generated | **Question bank** keyed by business type and main concern. Zero AI. |
| Stage 3: readiness score teaser | AI scores categories 1, 2, 4 | **Provisional score** from deterministic rules; AI scoring runs after payment. |
| Stage 3: 1 sample business idea | AI-generated | **Idea library** lookup, with user variables filled into a template. Zero AI. |
| Chatbot (pre-funnel) | OpenAI | FAQ matching first; capped, cheap-model fallback. |

Everything else before payment is already non-AI (forms, pricing, OTP).

---

## Persuasion levers (all zero-token)

| Lever | How it works | Data used |
|---|---|---|
| **Echo-back** | "Your idea: *healthy tiffin for office workers in Hyderabad*." Shows we listened. | Stage 1 inputs, verbatim |
| **Score + band** | Big number, coloured band, one-line meaning | Rules + band table |
| **Named weak spot** | "Your biggest gap: **Financial Preparedness (8/20)**. Unlock to see how to fix it." Creates a specific, personal reason to pay. | Lowest category in the provisional score |
| **Locked breakdown** | Real category names visible, scores blurred | Static labels |
| **City signal** | One line of local demand, e.g. "Hyderabad: high demand for this business type" | `content/demography/` lookup |
| **Sample idea** | One real idea card with investment and revenue range | Idea library |
| **Blurred report** | Real section titles for the user's plan (analysis, city insights, 7-day plan), blurred content | Static template per tier |
| **Tier anchoring** | "Was ₹499, now ₹199". Recommended plan highlighted. | Config |
| **Sunk progress** | "You've completed 3 of 4 stages." | Session state |
| **Social proof** | Persona-matched testimonial near the pay button | Static content |

---

## Provisional vs final score

| | Provisional (pre-pay, free) | Final (post-pay, AI) |
|---|---|---|
| Categories 3, 5 | Rule-based (same as final) | Same |
| Categories 1, 2, 4 | Deterministic heuristics: description length and specificity keywords, stage and concern lookup (already point-based in `04`), skill-vs-domain match from a keyword taxonomy | AI per the rubric |
| Shown as | Number + band, labelled **"Preliminary score"** | Number + breakdown + rationale |

**Trust rule:** the final score must not contradict the teaser. Clamp the final score to **±5 of the provisional score**, and never let it cross into a lower band.

---

## Cost guardrails

| Guardrail | Rule |
|---|---|
| AI calls per unpaid session | **0** (default). Optional: ≤ 1 cheap-model call, only after phone OTP is verified. |
| Chatbot | FAQ lookup first. If AI is needed, cap at ~5 messages per session, short max output, cheapest model. |
| Caching | Cache any AI output by hash of normalised inputs. |
| Abuse | Rate-limit per IP and per session; CAPTCHA before any AI call. |
| Preview content | Pre-generated or templated; never generated live per visitor. |
| Metric | Track **pre-payment AI cost per visitor** and **cost per paid conversion** on the admin dashboard. |

---

## Open decisions

1. **Follow-up questions:** question bank only (cheapest), or 1 cheap AI call after OTP for smarter questions? *Recommendation: bank only for launch.*
2. **Score drift:** is "clamp to ±5, same band" acceptable, or must the teaser be an exact match? An exact match would need AI before payment.
3. **Idea library:** who authors it? It needs domain × budget × city-tier coverage for launch.
4. **Keyword taxonomy:** needs `domains.md` (referenced in `14`, not provided).

---
[← Index](00_README.md)
