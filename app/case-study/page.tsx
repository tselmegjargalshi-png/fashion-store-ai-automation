import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import { EVENT_ROUTES } from "@/lib/automation/events";
import { WORKFLOWS } from "@/lib/automation/workflows";

export const metadata: Metadata = {
  title: "Case Study — ELORA E-commerce & AI Automation",
  description:
    "Portfolio case study: a modern women's fashion e-commerce experience designed around editorial storytelling, intuitive shopping, responsive UX and n8n automation-ready workflows.",
  alternates: { canonical: "/case-study" },
};

const FEATURES = [
  "Responsive e-commerce website",
  "Modern fashion UI/UX",
  "Product catalog",
  "Product filtering & sorting",
  "Product detail pages",
  "Shopping cart & cart drawer",
  "Checkout experience",
  "Wishlist",
  "Lookbook",
  "Brand storytelling",
  "Newsletter signup",
  "Contact system",
  "AI customer support concept",
  "n8n automation-ready workflows",
];

const PALETTE = [
  { name: "Ivory", hex: "#F8F5EF", cls: "bg-ivory border border-line" },
  { name: "Cream", hex: "#F0EAE0", cls: "bg-cream" },
  { name: "Sand", hex: "#E5DCCD", cls: "bg-sand" },
  { name: "Taupe", hex: "#A69A89", cls: "bg-taupe" },
  { name: "Olive", hex: "#545B3B", cls: "bg-olive" },
  { name: "Charcoal", hex: "#1E1D1A", cls: "bg-ink" },
  { name: "Gold accent", hex: "#B48C55", cls: "bg-gold" },
];

const ENTITIES = [
  ["Customer", "id, email, name, phone, acceptsMarketing", "has many Orders, Reviews; one Wishlist"],
  ["Product", "id, slug, sku, category, price, colors[], sizes[], images[]", "has many Reviews, OrderItems"],
  ["Cart", "id, items[], email?, updatedAt", "source of cart.abandoned"],
  ["Order", "id, number, email, address, shippingMethod, totals, status", "has many OrderItems"],
  ["OrderItem", "productId, sku, color, size, qty, unitPrice", "belongs to Order, Product"],
  ["Wishlist", "customerId, productId, addedAt", "join of Customer × Product"],
  ["Review", "productId, rating, title, body, fit, verified", "moderated via n8n"],
  ["NewsletterSubscriber", "email, source, subscribedAt", "welcome series"],
  ["ContactInquiry", "name, email, subject, message, topic, orderNumber", "AI-triaged via n8n"],
];

const STACK = [
  ["Framework", "Next.js 15 App Router, React 19, TypeScript (strict)"],
  ["Styling", "Tailwind CSS with a custom token system"],
  ["Validation", "Zod schemas shared by forms and API routes"],
  ["Automation", "Signed webhooks (HMAC-SHA256) → n8n, dry-run mode in development"],
  ["SEO", "Per-page metadata, JSON-LD (Product, FAQ, Breadcrumbs, Organization), sitemap, robots"],
  ["Accessibility", "Semantic landmarks, focus-trapped dialogs, keyboard galleries, labelled forms, reduced motion"],
  ["Performance", "Static generation for every catalogue page, responsive images via CDN loader, lazy loading"],
];

export default function CaseStudyPage() {
  return (
    <>
      <header className="bg-ink text-ivory">
        <div className="container-site py-20 md:py-28">
          <p className="eyebrow text-ivory/60">Portfolio case study</p>
          <h1 className="mt-6 max-w-5xl text-display">
            ELORA — Women&apos;s Fashion <em>E-commerce</em> Website
          </h1>
          <div className="mt-12 grid gap-10 border-t border-ivory/20 pt-10 md:grid-cols-12">
            <dl className="space-y-5 text-sm md:col-span-4">
              <div>
                <dt className="eyebrow text-ivory/50">Project type</dt>
                <dd className="mt-1">E-commerce Website / UI UX / AI Automation Ready</dd>
              </div>
              <div>
                <dt className="eyebrow text-ivory/50">Scope</dt>
                <dd className="mt-1">Brand identity, UX, UI design, front-end & API development, automation architecture</dd>
              </div>
              <div>
                <dt className="eyebrow text-ivory/50">Stack</dt>
                <dd className="mt-1">Next.js · TypeScript · Tailwind CSS · n8n</dd>
              </div>
            </dl>
            <p className="font-serif text-2xl leading-snug md:col-span-7 md:col-start-6 md:text-3xl">
              A modern women&apos;s fashion e-commerce experience designed around editorial storytelling, intuitive shopping, responsive UX, and automation-ready customer
              workflows.
            </p>
          </div>
        </div>
      </header>

      {/* Challenge & approach */}
      <section className="container-site grid gap-12 py-20 md:grid-cols-2 md:py-28">
        <div>
          <p className="eyebrow text-stone">The brief</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">A brand that feels real, a store that works</h2>
          <p className="mt-6 leading-8 text-stone">
            Create a fictional women&apos;s fashion label — ELORA — and a complete storefront that communicates premium quality, femininity and confidence, while
            demonstrating sound e-commerce UX and the business plumbing behind it: order flows, customer care and marketing automation.
          </p>
        </div>
        <div>
          <p className="eyebrow text-stone">The approach</p>
          <ul className="mt-4 space-y-5">
            {[
              ["Editorial first", "Large photography, a serif/sans pairing and generous spacing borrowed from fashion print — never at the expense of shopping clarity."],
              ["Shopping clarity", "Quick add, URL-synced filters, clear prices, fit notes, a size finder and a two-step checkout with a persistent summary."],
              ["Automation-ready", "Every customer touchpoint emits a typed, signed event that n8n can turn into a workflow — no front-end changes needed."],
            ].map(([title, text]) => (
              <li key={title} className="border-t border-line pt-5">
                <p className="text-xs font-medium uppercase tracking-[0.18em]">{title}</p>
                <p className="mt-2 text-stone">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Features */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container-site">
          <p className="eyebrow text-stone">Key features</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">What&apos;s included</h2>
          <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <li key={f} className="flex items-baseline gap-4 bg-cream p-6">
                <span className="font-serif text-lg italic text-olive">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Design system */}
      <section className="container-site py-20 md:py-28">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-stone">Design system</p>
            <h2 className="mt-4 text-4xl sm:text-5xl">Modern, editorial, quietly feminine</h2>
            <p className="mt-6 text-stone">
              Warm ivory grounds and charcoal type, with muted olive and taupe for depth. Gold is reserved for small signals like low-stock notes. Cormorant Garamond
              carries the editorial voice; Jost keeps UI, prices and navigation crisp.
            </p>
          </div>
          <div className="space-y-12 lg:col-span-7 lg:col-start-6">
            <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-7">
              {PALETTE.map((c) => (
                <li key={c.name}>
                  <span className={`block aspect-square ${c.cls}`} />
                  <p className="mt-2 text-xs">{c.name}</p>
                  <p className="text-[0.65rem] uppercase text-stone">{c.hex}</p>
                </li>
              ))}
            </ul>
            <div className="grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
              <div>
                <p className="font-serif text-7xl leading-none">
                  Aa <em>Aa</em>
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-stone">Cormorant Garamond — display</p>
              </div>
              <div>
                <p className="font-sans text-6xl font-light leading-none">Aa</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-stone">Jost — interface & body</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UX flow */}
      <section className="border-y border-line py-20 md:py-24">
        <div className="container-site">
          <p className="eyebrow text-stone">Shopping flow</p>
          <ol className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-4 font-serif text-2xl sm:text-3xl">
            {["Discover", "Browse & filter", "Product detail", "Bag", "Checkout", "Confirmation", "Automations"].map((step, i, arr) => (
              <li key={step} className="flex items-center gap-3">
                <span className={i === arr.length - 1 ? "italic text-olive" : undefined}>{step}</span>
                {i < arr.length - 1 && <ArrowRight className="h-5 w-5 text-taupe" strokeWidth={1} />}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Automation */}
      <section id="automation" className="scroll-mt-24 bg-ink py-20 text-ivory md:py-28">
        <div className="container-site">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 [&>*]:min-w-0">
            <div className="lg:col-span-5">
              <p className="eyebrow text-ivory/60">Automation concept</p>
              <h2 className="mt-4 text-4xl sm:text-5xl">
                Built to connect to <em>n8n</em>
              </h2>
              <p className="mt-6 text-ivory/70">
                The browser never calls n8n directly. Each event is validated by a Next.js API route, wrapped in a versioned envelope with an idempotency key, signed with
                HMAC-SHA256 and forwarded server-side — so webhook URLs and secrets stay private and n8n can trust what it receives.
              </p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <ol className="grid gap-px bg-ivory/15 text-sm sm:grid-cols-4">
                {[
                  ["Storefront", "Form / checkout / chat"],
                  ["API route", "Validate · rate-limit"],
                  ["Dispatcher", "Envelope · sign · retry-safe"],
                  ["n8n", "Webhook → workflow"],
                ].map(([title, text], i) => (
                  <li key={title} className="bg-ink p-5">
                    <span className="font-serif text-lg italic text-olive-light">0{i + 1}</span>
                    <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em]">{title}</p>
                    <p className="mt-1 text-ivory/60">{text}</p>
                  </li>
                ))}
              </ol>
              <pre className="mt-6 overflow-x-auto bg-ivory/5 p-5 text-xs leading-6 text-ivory/80">
                {`POST {N8N_WEBHOOK_BASE_URL}/elora/contact-submitted
X-Elora-Event: contact.submitted
X-Elora-Event-Id: evt_9f2c41a7b3d0
X-Elora-Signature: sha256=…

{ "id": "evt_9f2c41a7b3d0", "type": "contact.submitted",
  "version": 1, "occurredAt": "2026-10-16T10:24:00Z",
  "source": "elora-web", "data": { "inquiry": { … } } }`}
              </pre>
            </div>
          </div>

          <ul className="mt-16 grid gap-px bg-ivory/15 md:grid-cols-2 xl:grid-cols-3">
            {WORKFLOWS.map((wf) => (
              <li key={wf.event} className="flex flex-col bg-ink p-7">
                <code className="text-xs text-olive-light">{wf.event}</code>
                <h3 className="mt-3 text-2xl">{wf.title}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ivory/50">Trigger · {wf.trigger}</p>
                <ol className="mt-6 space-y-2 text-sm">
                  {wf.steps.map((step, i) => (
                    <li key={step} className="flex gap-3">
                      <span className="w-4 shrink-0 tabular-nums text-ivory/40">{i + 1}</span>
                      <span className="text-ivory/85">{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 border-t border-ivory/15 pt-4 text-sm text-ivory/60">{wf.outcome}</p>
                <p className="mt-3 text-[0.65rem] text-ivory/40">Webhook path: /{EVENT_ROUTES[wf.event].path}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* AI support */}
      <section className="container-site grid gap-12 py-20 md:py-28 lg:grid-cols-12">
        <div className="relative aspect-[4/5] overflow-hidden bg-sand lg:col-span-5">
          <Img media="look-everyday" sizes="(min-width:1024px) 40vw, 100vw" fallbackLabel="AI assistant" />
        </div>
        <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
          <p className="eyebrow text-stone">AI customer support</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">An assistant that knows the store</h2>
          <p className="mt-6 leading-8 text-stone">
            “Ask Elora” answers order status, sizing, returns, delivery and product questions from real store data: it looks up orders, recommends a size from body
            measurements against the size chart, and suggests products from the catalogue. When it can&apos;t help, it hands the conversation to the care team with
            the full transcript via the <code className="bg-cream px-1.5 py-0.5 text-ink">support.escalated</code> workflow.
          </p>
          <p className="mt-4 leading-8 text-stone">
            The demo uses a deterministic intent router so it runs without API keys. It is structured as a tool layer, so a production version can route messages through
            an LLM (server-side) that calls the same order-lookup, size and catalogue tools.
          </p>
        </div>
      </section>

      {/* Data model */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container-site">
          <p className="eyebrow text-stone">Business logic</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">Data model</h2>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink text-xs uppercase tracking-[0.14em]">
                  <th scope="col" className="py-3 pr-6 font-medium">Entity</th>
                  <th scope="col" className="py-3 pr-6 font-medium">Key fields</th>
                  <th scope="col" className="py-3 font-medium">Relationships</th>
                </tr>
              </thead>
              <tbody>
                {ENTITIES.map(([name, fields, rel]) => (
                  <tr key={name} className="border-b border-line">
                    <th scope="row" className="py-4 pr-6 font-serif text-xl font-normal">{name}</th>
                    <td className="py-4 pr-6 font-mono text-xs text-stone">{fields}</td>
                    <td className="py-4 text-stone">{rel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm text-stone">
            Prices and totals are always recomputed on the server from the catalogue — the client is never trusted for money values.
          </p>
        </div>
      </section>

      {/* Stack */}
      <section className="container-site py-20 md:py-28">
        <p className="eyebrow text-stone">Engineering</p>
        <h2 className="mt-4 text-4xl sm:text-5xl">Technical quality</h2>
        <dl className="mt-12 divide-y divide-line border-y border-line">
          {STACK.map(([k, v]) => (
            <div key={k} className="grid gap-2 py-5 sm:grid-cols-[220px_1fr]">
              <dt className="text-xs font-medium uppercase tracking-[0.18em]">{k}</dt>
              <dd className="text-stone">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-14 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            Explore the store
          </ButtonLink>
          <ButtonLink href="/checkout" variant="outline" size="lg">
            Try the checkout flow
          </ButtonLink>
        </div>
        <p className="mt-10 text-xs text-taupe-dark">
          ELORA, its founder, products, reviews and orders are fictional and created for portfolio purposes. Photography is sourced from Unsplash.
        </p>
      </section>
    </>
  );
}
