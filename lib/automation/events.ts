/**
 * Automation event contract.
 *
 * Every customer touchpoint that should trigger a workflow emits one of these
 * events. The storefront never talks to n8n directly from the browser: events
 * are validated by a Next.js API route and forwarded server-side (see
 * lib/automation/dispatch.ts), so webhook URLs and secrets stay private.
 *
 * Envelope (what n8n receives):
 * {
 *   "id": "evt_9f2c…",            // idempotency key — dedupe on this in n8n
 *   "type": "contact.submitted",
 *   "version": 1,
 *   "occurredAt": "2026-10-16T10:24:00.000Z",
 *   "source": "elora-web",
 *   "data": { …event-specific payload… }
 * }
 */
import type { CartItem, ContactInquiry, NewsletterSubscriber, Order, Review } from "@/lib/types";

export interface AutomationEventMap {
  /** Contact form → save inquiry → AI categorise → notify team → draft reply. */
  "contact.submitted": { inquiry: ContactInquiry; pageUrl?: string };
  /** Newsletter → store subscriber → welcome email (+ discount code). */
  "newsletter.subscribed": { subscriber: NewsletterSubscriber };
  /** Checkout → process order → notify team → customer confirmation. */
  "order.created": { order: Order };
  /** Checkout left with items and an email → wait → personalised reminder. */
  "cart.abandoned": { cartId: string; email: string; items: CartItem[]; subtotal: number; checkoutUrl: string };
  /** Review → AI sentiment → classify → alert admin if negative. */
  "review.submitted": { review: Review; productName: string };
  /** AI assistant could not resolve → hand off to a human with transcript. */
  "support.escalated": {
    email: string;
    question: string;
    transcript: { role: "user" | "assistant"; content: string }[];
    detectedIntent?: string;
  };
}

export type AutomationEventType = keyof AutomationEventMap;

export interface AutomationEnvelope<T extends AutomationEventType = AutomationEventType> {
  id: string;
  type: T;
  version: 1;
  occurredAt: string;
  source: "elora-web";
  data: AutomationEventMap[T];
}

/** Maps each event to its env override and default webhook path. */
export const EVENT_ROUTES: Record<AutomationEventType, { env: string; path: string; workflow: string }> = {
  "contact.submitted": { env: "N8N_WEBHOOK_CONTACT_SUBMITTED", path: "elora/contact-submitted", workflow: "Customer inquiry triage" },
  "newsletter.subscribed": { env: "N8N_WEBHOOK_NEWSLETTER_SUBSCRIBED", path: "elora/newsletter-subscribed", workflow: "Welcome series" },
  "order.created": { env: "N8N_WEBHOOK_ORDER_CREATED", path: "elora/order-created", workflow: "Order processing & confirmation" },
  "cart.abandoned": { env: "N8N_WEBHOOK_CART_ABANDONED", path: "elora/cart-abandoned", workflow: "Abandoned cart recovery" },
  "review.submitted": { env: "N8N_WEBHOOK_REVIEW_SUBMITTED", path: "elora/review-submitted", workflow: "Review sentiment monitor" },
  "support.escalated": { env: "N8N_WEBHOOK_SUPPORT_ESCALATED", path: "elora/support-escalated", workflow: "Support hand-off" },
};
