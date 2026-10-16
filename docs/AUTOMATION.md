# Automation architecture (n8n)

ELORA is built so every meaningful customer action can trigger an n8n workflow
without touching front-end code. This document is the integration contract.

## How events flow

```
Browser ──► Next.js API route ──► dispatchEvent() ──► n8n Webhook ──► Workflow
            (validate, rate-limit,   (envelope, HMAC     (verify signature,
             reprice, honeypot)       sign, 5s timeout)   dedupe on event id)
```

* The browser **never** calls n8n directly — webhook URLs and the signing secret
  live only in server environment variables.
* `lib/automation/dispatch.ts` never throws. If n8n is down, the customer's
  action (order, message, signup) still succeeds; the failure is logged.
* With no `N8N_WEBHOOK_BASE_URL` set, the site runs in **dry-run** mode and logs
  each event to the server console — the demo is fully functional offline.

## Envelope

Every webhook receives the same envelope:

```json
{
  "id": "evt_9f2c41a7b3d0",
  "type": "order.created",
  "version": 1,
  "occurredAt": "2026-10-16T10:24:00.000Z",
  "source": "elora-web",
  "data": { "order": { "...": "..." } }
}
```

Headers:

| Header | Purpose |
| --- | --- |
| `X-Elora-Event` | Event type, for routing |
| `X-Elora-Event-Id` | Idempotency key — dedupe retries on this |
| `X-Elora-Signature` | `sha256=<hex>` HMAC of the raw body using `N8N_WEBHOOK_SECRET` |

## Events

| Event | Emitted by | Webhook path | Workflow |
| --- | --- | --- | --- |
| `contact.submitted` | `POST /api/contact` | `/elora/contact-submitted` | Customer inquiry triage |
| `newsletter.subscribed` | `POST /api/newsletter` | `/elora/newsletter-subscribed` | Welcome series |
| `order.created` | `POST /api/orders` | `/elora/order-created` | Order processing & confirmation |
| `cart.abandoned` | `POST /api/cart/abandoned` (beacon) | `/elora/cart-abandoned` | Abandoned cart recovery |
| `review.submitted` | `POST /api/reviews` | `/elora/review-submitted` | Review sentiment monitor |
| `support.escalated` | `POST /api/chat` (hand-off) | `/elora/support-escalated` | Support hand-off |

Payload types are defined in [`lib/automation/events.ts`](../lib/automation/events.ts).
Workflow blueprints (steps and outcomes) are in
[`lib/automation/workflows.ts`](../lib/automation/workflows.ts) and rendered on `/case-study`.

### Workflow blueprints

**Contact form → Customer inquiry triage**
webhook → verify signature → save inquiry → AI classifies topic, urgency and sentiment → notify team (Slack) → AI drafts reply

**Newsletter → Welcome series**
webhook → upsert subscriber in ESP (Klaviyo / Mailchimp / Brevo) → generate welcome code → send welcome email → day 3 brand-story email

**Order → Processing & confirmation**
webhook → dedupe on event id → write to Sheets / ERP → customer confirmation → notify fulfilment → flag high-value orders

**Abandoned cart → Recovery**
webhook → wait 1 hour → check whether an order exists for the same email since the event → if not, AI personalises a reminder → send → wait 24 h → optional second nudge

The storefront sends `cart.abandoned` (via `navigator.sendBeacon`) only when a
shopper has entered a valid email at checkout and then leaves without ordering,
at most once per cart + email per session. The *decision* to remind lives in
n8n, where it can check real order data.

**Review → Sentiment monitor**
webhook → AI sentiment + topic → classify (publish / hold / escalate) → alert admin if negative → log to product insights. Reviews arrive with `verified: false` and are held for moderation.

**Assistant → Support hand-off**
webhook → create ticket (Gorgias / Zendesk / Help Scout) with transcript → AI summary → route by detected intent → acknowledge customer.

## Importable example

[`automation/n8n/contact-inquiry-triage.json`](../automation/n8n/contact-inquiry-triage.json)
is a starter workflow for `contact.submitted`:

1. Import it in n8n (*Workflows → Import from file*).
2. Set `NODE_FUNCTION_ALLOW_BUILTIN=crypto` on your n8n instance (the signature check uses Node's `crypto`).
3. In **Verify signature**, replace `SECRET` with the same value as `N8N_WEBHOOK_SECRET`.
4. Create an *HTTP Header Auth* credential named `x-api-key` with your Anthropic API key and attach it to **AI: classify & draft reply**.
5. Replace the Slack incoming-webhook URL in **Notify team**.
6. Activate the workflow, then set `N8N_WEBHOOK_BASE_URL=https://<your-n8n>/webhook` in the site's `.env.local`.

It is a starting point, not a tested production workflow — review node versions against your n8n release after import.

## Testing locally without n8n

Any HTTP receiver works. The repository was verified against a small Node
receiver that recomputes the HMAC; both `order.created` and
`newsletter.subscribed` arrived with valid signatures.

```bash
N8N_WEBHOOK_BASE_URL=http://localhost:5679/webhook \
N8N_WEBHOOK_SECRET=test-secret npm run dev
```

## Production notes

* Swap the in-memory rate limiter (`lib/server/rate-limit.ts`) for a shared store when running more than one instance.
* Emit `order.created` from the payment provider's *payment succeeded* webhook rather than the checkout request.
* Persist inquiries, subscribers, reviews and orders in a database before dispatching, so n8n failures can be replayed.
