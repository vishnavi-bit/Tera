# Gap list: Onboarding for Gen Z founders

The source is the working POC (`startup_incubation/poc`, React web app) plus the consolidated documents (`docs/00_README.md` to `docs/08_prepayment_strategy.md`). Where they differ the **POC wins** (your decision); each difference is noted below. Sequence: `sequences/genz-onboarding.json`. Seed (demo data): `mock-app/mock-data/seeds/genz-onboarding.json`.

## Spec gaps

1. **Persona questions are new.** W06 and W07 (two extra questions per persona) are in neither the POC nor the documents. They are proposals. Their answers are not used by the scoring rules in `docs/04_readiness_score.md` and have no defined place in the report.
2. **Persona wording is new.** Landing headlines, pain points, example ideas and the persona-specific concern lists (W04) are proposals. Only the women, working-professional and college-graduate wording exists in the POC. The Gen Z and Midlife Career Changers personas, and their routes, are not in the documents or the POC.
3. **Score is fixed in the POC.** The POC shows 72 for everyone, and "top 35%" for everyone. The walkthrough shows a score worked out by hand from `docs/04_readiness_score.md` and a sample percentile. The real scoring step is not built in the POC.
4. **"Why it's a great idea" is rule-based in the POC** (`getWhyGreat`). The same logic is shown here with sample wording.
5. **Locked preview.** The POC shows fixed sample text behind the blur ("Market readiness: 78 …"). The documents suggest showing a named weak spot and category names; the POC does not, so this walkthrough does not.
6. **Business-type, interest and skill lists** come from the POC. The documents do not define them.
7. **WhatsApp verification.** The POC verifies by sending a WhatsApp message (no OTP); the documents say phone OTP. The POC's version is shown. The "waiting for your message" modal is skipped: it ends by itself in the POC, so the walkthrough goes straight to "You're registered".
8. **Coupons.** The POC has demo codes (LAUNCH50, STARTUP20, WELCOME10). The documents do not mention coupons. Apply shows a toast. A coupon is not used in the tour.
9. **Prices.** The POC's original prices are ₹119, ₹399 and ₹9,999. The documents say ₹119, ₹499 and ₹9,999. The POC values are shown. A legal check on "was" prices is still advised (`docs/07_conflicts_open_questions.md`, number 4).
10. **Entry plan extras** (webinar, "Stay Motivated" app) are in the POC plan list but an open question in `docs/07_conflicts_open_questions.md` (number 2). Nothing in the tour depends on them.
11. **Confirm after payment.** The POC confirms after payment (as `docs/02_user_flow.md`), with 2 revisions for Core and none for other plans. "Revise" shows a toast; how a revision is applied and how it changes the score are not defined.
12. **Payment failure and pending** are not built in the POC or designed in the documents. "Payment failed or pending?" shows a "Not defined" alert.
13. **Incubation.** "Join Incubation" shows a "Not defined" alert; whether the programme exists is an open question (`docs/07_conflicts_open_questions.md`, number 5).
14. **Report content.** The POC report is a nine-slide playbook (market, funnel, survival math, scale, brand, 30-day checklist). The documents describe a different page map per plan (analysis areas, ideas, 7-day plan, 90-day roadmap). The walkthrough shows the POC slides plus a score page and next steps, and does not vary the slides by plan.
15. **City list.** The city search shows the first 12 cities of the POC list. The "My city isn't in this list" fallback (state, district, place) shows a toast only.

## Walkthrough notes (not spec gaps)

- Chosen plan: **Entry ₹59**, to show a tiny-budget buyer and the upgrade path. The confirm banner says details cannot be changed.
- The idea is online and pan-India, so the city search is not shown.
- The walkthrough is a **web application** (desktop). The phone toggle shows the same pages at phone width. The questions, one per page, follow the POC.
- The "Back" button on each question shows a toast; the tour moves forward only.
- Choosing an option shows a toast saying what it would do. The seed holds each persona's sample answers.
- Dashboard: the two older reports are the POC's sample reports; the new report is the one just made.
