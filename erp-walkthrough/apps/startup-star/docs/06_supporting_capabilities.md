# Supporting Capabilities, Metrics & Future Scope

## Supporting Capabilities

| Area | Summary |
|---|---|
| **Home page `/`** | Brand hub; links to personas, About, FAQ, Blog, Resources, Pricing, Contact. Not conversion-focused. |
| **Persona pages** | Ad destinations. No global navigation. Teaser as the hook. One CTA that carries persona context into intake. |
| **Payment** | Razorpay (UPI, cards, net banking, wallets); handles success, failure and pending; receipt screen; webhook-triggered generation. |
| **AI report generation** | OpenAI generates the content. Output is stored linked to the user. |
| **Dashboard** | Reports, plan tier, Calendly link (Premium), next-step and upsell prompts. |
| **Consultation** | Calendly embed for Premium; confirmation by WhatsApp and email. |
| **Chatbot** | Pre-funnel Q&A on the idea or service; falls back to the contact form. |
| **Follow-up** | WhatsApp (Meta Business API) and email (AWS SES), Day 1/2/3, AI-personalised from report data. |
| **Supporting pages** | About, Pricing, FAQ, Contact, Testimonials, Blog, Resources, Privacy, Terms. |
| **Admin dashboard** | Users, stage, plan; funnel and revenue metrics; manage follow-ups; CSV/CRM export. |
| **Analytics** | GA4 funnel events, Sentry errors, Firebase Remote Config for A/B tests. |

## Follow-up sequence

| Day | WhatsApp | Email |
|---|---|---|
| 1 | Delivery confirmation and 1 key insight | Report with download link |
| 2 | Action prompt for their plan | Tips for their business stage |
| 3 | Upsell (consultation or incubation) | Upsell and next-steps CTA |

## Success Metrics

- Landing-page conversion rate
- ₹59 purchase rate
- ₹199 upgrade rate
- ₹2,999 conversion rate
- Report completion rate
- Follow-up engagement rate
- Funnel drop-off per stage (via GA4)

## Psychology and Future Scope

**Triggers used:** curiosity (see your score), personalisation, progress (step-by-step plan), fear (mistakes to avoid), authority (structured report), commitment (paid unlock).

**Future expansion:** founders' community, advanced incubation programme, done-for-you setup services, investor network access.

---
[← Index](00_README.md)
