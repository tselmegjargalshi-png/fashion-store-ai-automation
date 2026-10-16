# ELORA — Women's Fashion E-commerce Website

**Project type:** E-commerce Website / UI UX / AI Automation Ready
**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · Zod · n8n

## Project description

A modern women's fashion e-commerce experience designed around editorial
storytelling, intuitive shopping, responsive UX, and automation-ready customer
workflows.

## The brief

Create a fictional women's fashion label and a complete storefront that
communicates premium quality, femininity and confidence — while demonstrating
real e-commerce UX and the business systems behind it: order flows, customer
care and marketing automation.

**Brand:** ELORA — contemporary womenswear focused on effortless everyday
elegance, timeless silhouettes and modern essentials, for women aged 20–35.

## Design direction

*Modern + editorial + feminine + premium + clean.*

* **Palette** — warm ivory `#F8F5EF`, cream `#F0EAE0`, charcoal `#1E1D1A`; muted olive `#545B3B`, sand and taupe as secondaries; a restrained gold `#B48C55` only for small signals.
* **Typography** — Cormorant Garamond for editorial headlines (with italic accents), Jost for navigation, prices, buttons and body.
* **Layout** — full-bleed campaign photography, asymmetric editorial grids, generous whitespace and a consistent 12-column system.
* **Motion** — fast, subtle transitions (image cross-fades, drawer slides, page fades), all disabled under `prefers-reduced-motion`.

## Key features

* Responsive e-commerce website (desktop, tablet, mobile-first patterns)
* Modern fashion UI/UX with a custom design system
* Product catalogue — 18 products across 4 categories
* Filtering (category, size, colour, price) and sorting, synced to the URL
* Product detail pages — gallery, colour/size selectors, size guide with size finder, reviews
* Cart drawer and full cart page with free-shipping progress
* Two-column checkout with validation and a persistent order summary
* Wishlist, search overlay (press `/`), order tracking
* Lookbook and brand storytelling (About, founder)
* Newsletter signup and contact system
* AI customer support assistant ("Ask Elora")
* n8n automation-ready workflows (6 signed webhook events)
* SEO: metadata, JSON-LD, sitemap, robots, semantic headings
* Accessibility: keyboard-friendly dialogs, focus states, labelled forms

## Automation concept

Each customer touchpoint emits a typed, versioned and HMAC-signed event that a
server-side dispatcher forwards to n8n:

| Touchpoint | n8n workflow |
| --- | --- |
| Customer inquiry (contact form) | Save → **AI classifies** topic, urgency & sentiment → notify team → **AI drafts reply** |
| Newsletter signup | Store subscriber → welcome email with code → follow-up |
| New order | Record order → customer confirmation → team notification |
| Abandoned cart | Wait → check for purchase → **AI-personalised** reminder |
| Review submission | **AI sentiment analysis** → classify → alert admin if negative |
| AI support hand-off | Ticket with full transcript → AI summary → route |

Full contract: [AUTOMATION.md](./AUTOMATION.md).

## AI customer support

"Ask Elora" answers *Where is my order?*, *What size should I choose?*, returns,
international shipping, delivery times and product questions — grounded in
store data (demo orders, size chart, catalogue, policies). It recommends a size
from body measurements, shows matching products inline, and escalates to a human
with the transcript when it can't help. It is built as a tool layer, ready to be
driven by an LLM server-side.

## Business thinking

* Prices and totals are recomputed on the server — the client is never trusted for money.
* Free-shipping threshold ($100) is surfaced in the announcement bar, cart drawer progress bar, PDP and checkout to lift average order value.
* Low-stock signals, best-seller badges and reviews support conversion without dark patterns.
* Abandoned-cart signals are only sent with explicit email capture, and the reminder decision lives in n8n where real order data is available.

## Disclaimer

ELORA, its founder, products, reviews and orders are fictional. Photography is
sourced from Unsplash. No payments are processed.
