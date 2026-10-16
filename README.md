# ELORA — Modern Women's Fashion E-commerce

A complete, production-structured fashion storefront for a fictional brand,
built as a portfolio project to demonstrate **web design, e-commerce UX,
business logic, an AI support assistant and n8n automation readiness**.

> ELORA is fictional. No payments are processed and no orders are fulfilled.

- **Case study:** [`docs/CASE_STUDY.md`](docs/CASE_STUDY.md) · live at `/case-study`
- **Automation contract:** [`docs/AUTOMATION.md`](docs/AUTOMATION.md)
- **Data model:** [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md)

## Quick start

Requires Node.js 18.18+ (tested on Node 22).

```bash
npm install
cp .env.example .env.local   # optional — everything works without it
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build       # production build (all catalogue pages are statically generated)
npm start           # serve the production build
npm run lint        # ESLint (next/core-web-vitals + TypeScript)
npm run typecheck   # tsc --noEmit
```

## Pages

| Route | Page |
| --- | --- |
| `/` | Home — campaign hero, categories, new arrivals, most loved, editorial, story, lookbook |
| `/shop` | All products with filters (category, size, colour, price) and sorting |
| `/shop/new-arrivals` · `/shop/dresses` · `/shop/tops` · `/shop/bottoms` · `/shop/outerwear` | Collections |
| `/products/[slug]` | Product detail — gallery, options, size guide, reviews, complete the look |
| `/about` | Brand story, philosophy, founder |
| `/lookbook` | The ELORA Edit — six shoppable looks |
| `/contact` | Contact form |
| `/faq` | Categorised FAQ accordion |
| `/size-guide` | Size chart with unit toggle and size finder |
| `/cart` · `/checkout` · `/checkout/success` | Bag, checkout, confirmation |
| `/wishlist` · `/account` | Saved pieces, order tracking |
| `/case-study` | Portfolio case study |

## Architecture

```
app/                    Routes (App Router), API routes, sitemap, robots
  api/contact|newsletter|orders|reviews|cart/abandoned|chat
components/
  layout/               AnnouncementBar, Header, MobileMenu, SearchOverlay, Footer, Newsletter
  home/                 Hero, CategoryCard, NewArrivals, BestSellers, EditorialBanner, …
  product/              ProductCard, ProductGrid, ProductGallery, ProductInfo, SizeGuide, Reviews, ReviewForm
  shop/                 ShopView (filters/sort), ShopHeader, ShopFallback (SSR grid)
  cart/ checkout/       CartDrawer, CartLineItem, CheckoutView, OrderConfirmation
  chat/                 ChatWidget (AI assistant UI)
  ui/                   Button, Img, Drawer, Modal, Accordion, Breadcrumbs, …
  providers/            StoreProvider — cart, wishlist, overlays, toasts
lib/
  types.ts              Domain model (Customer, Product, Order, Review, …)
  data/                 Mock catalogue, reviews, lookbook, FAQ, size chart, shipping, demo orders
  automation/           Event contract, signed webhook dispatcher, workflow blueprints
  support/assistant.ts  AI assistant intent router + tools
  commerce.ts           Server-side order building and pricing
  validation.ts         Zod schemas shared by forms and API routes
  media.ts              Central photography registry
automation/n8n/         Importable n8n workflow example
docs/                   Case study, automation contract, data model
```

### Key decisions

- **Static first.** Every catalogue and product page is pre-rendered; interactive filters hydrate on top of a server-rendered product grid, so content is in the HTML for SEO.
- **Server-trusted money.** `/api/orders` reprices every line from the catalogue and rejects unknown colours or sizes.
- **No card data on the server.** Card fields are validated in the browser and never sent; production would use the payment provider's hosted fields.
- **Automation is decoupled.** API routes emit typed events; `dispatchEvent` signs them and forwards to n8n, or logs them in dry-run mode.
- **Forms are hardened.** Shared Zod validation, honeypot fields, and per-IP rate limiting.

## Environment variables

See [`.env.example`](.env.example). All are optional.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph |
| `N8N_WEBHOOK_BASE_URL` | Enables live webhook delivery |
| `N8N_WEBHOOK_<EVENT>` | Per-event URL overrides |
| `N8N_WEBHOOK_SECRET` | HMAC-SHA256 signing secret |

## Photography & fonts

Images are hotlinked from Unsplash through a custom `next/image` loader and are
all referenced from [`lib/media.ts`](lib/media.ts), so swapping in a client's own
assets (e.g. files in `/public/images`) means editing one file. If any remote
image fails to load, `<Img>` falls back to a designed tonal tile instead of a
broken-image icon. **Check every image before presenting the project and replace
any that don't fit the art direction.**

Fonts (Cormorant Garamond, Jost) load from Google Fonts at runtime.

## Verification status

Verified in a build environment: `tsc`, `eslint` and `next build` pass; all
pages return 200; all six API routes were exercised (validation errors,
server-side repricing, dry-run and live signed delivery to a mock receiver);
and a headless-Chromium pass at 1440 px and 390 px checked for runtime errors and
horizontal overflow and ran checkout, cart, filter, menu and chat flows.

Not verified: Unsplash photography and Google Fonts were not reachable from that
environment, so the actual images and webfonts have not been visually reviewed,
and the n8n workflow JSON has not been imported into a live n8n instance.
