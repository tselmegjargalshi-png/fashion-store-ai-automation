/**
 * ELORA support assistant — demo engine.
 *
 * A deterministic intent router grounded in store data (catalogue, size chart,
 * policies, demo orders). It is deliberately structured like a tool-using AI
 * agent: detect intent → call a "tool" (order lookup, size recommender,
 * catalogue search) → compose a short, on-brand reply.
 *
 * To upgrade to an LLM, keep this module as the tool layer and route the
 * message through a model (server-side only, key in env) that calls these
 * same functions. Unresolved conversations are escalated to n8n via the
 * `support.escalated` event.
 */
import { CATEGORIES, PRODUCTS } from "@/lib/data/products";
import { findDemoOrder } from "@/lib/data/orders";
import { SIZE_CHART, recommendSize, type Measure } from "@/lib/data/size-guide";
import type { Product } from "@/lib/types";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/site";

export type SupportIntent =
  | "greeting"
  | "order_status"
  | "order_change"
  | "sizing"
  | "returns"
  | "shipping_time"
  | "international"
  | "products"
  | "payment"
  | "human"
  | "thanks"
  | "fallback";

export interface AssistantProduct {
  slug: string;
  name: string;
  price: number;
  image: string;
}

export interface AssistantReply {
  intent: SupportIntent;
  reply: string;
  suggestions: string[];
  products?: AssistantProduct[];
  canEscalate?: boolean;
}

const DEFAULT_SUGGESTIONS = ["Where is my order?", "What size should I choose?", "What is your return policy?"];

const INTENT_PATTERNS: [SupportIntent, RegExp][] = [
  ["order_change", /\b(change|cancel|modify|edit|update)\b.*\b(order|address)\b/i],
  ["order_status", /\b(where('?s| is)? my order|track(ing)?|order status|my order|el-?\d{5}|parcel|package|delivery status)\b/i],
  ["sizing", /\b(size|sizing|fit|fits|measurements?|bust|waist|hips?|small|large|true to size|between sizes)\b/i],
  ["returns", /\b(return|returns|refund|exchange|send (it )?back)\b/i],
  ["international", /\b(international(ly)?|abroad|overseas|worldwide|canada|uk|europe|australia|japan|singapore|mongolia|duties|customs)\b/i],
  ["shipping_time", /\b(how long|delivery time|shipping time|when will|arrive|shipping|ship|express|delivery)\b/i],
  ["payment", /\b(secure|checkout|pay|payment|card|visa|mastercard|amex|apple pay|google pay|paypal|klarna)\b/i],
  ["products", /\b(products?|available|sell|collection|new arrivals?|dress(es)?|tops?|shirts?|knit|sweater|trousers|pants|skirts?|jeans|bottoms|outerwear|coats?|blazers?|jackets?|trench|recommend|looking for|gift|under \$?\d+)\b/i],
  ["human", /\b(human|person|agent|someone|talk to|speak to|contact|email you|call)\b/i],
  ["thanks", /\b(thanks|thank you|thx|perfect|great|amazing)\b/i],
  ["greeting", /^(hi|hello|hey|good (morning|afternoon|evening))\b/i],
];

export function detectIntent(message: string): SupportIntent {
  for (const [intent, pattern] of INTENT_PATTERNS) {
    if (pattern.test(message)) return intent;
  }
  return "fallback";
}

// ─── Tools ─────────────────────────────────────────────────────

function toCard(p: Product): AssistantProduct {
  return { slug: p.slug, name: p.name, price: p.price, image: p.images[0] };
}

function findMentionedProduct(message: string) {
  const lower = message.toLowerCase();
  return PRODUCTS.find((p) => {
    const short = p.name.toLowerCase().replace(/^the /, "").split(" ")[0];
    return lower.includes(p.name.toLowerCase()) || new RegExp(`\\b${short}\\b`).test(lower);
  });
}

function parseMeasurements(message: string): Partial<Record<Measure, number>> {
  const result: Partial<Record<Measure, number>> = {};
  const lower = message.toLowerCase();
  (["bust", "waist", "hips"] as Measure[]).forEach((key) => {
    const word = key === "hips" ? "hips?" : key === "bust" ? "(?:bust|chest)" : key;
    const re = new RegExp(`${word}\\D{0,12}(\\d{2,3}(?:\\.\\d)?)\\s*(cm|in|inch|inches|")?`);
    const m = lower.match(re);
    if (m) {
      const value = parseFloat(m[1]);
      const unit = m[2];
      const isInches = unit ? unit !== "cm" : value < 60;
      result[key] = isInches ? Math.round(value * 2.54) : value;
    }
  });
  return result;
}

function searchCatalogue(message: string): Product[] {
  const lower = message.toLowerCase();
  let results = [...PRODUCTS];

  const synonyms: Record<string, string[]> = {
    dresses: ["dress"],
    tops: ["top", "shirt", "knit", "sweater", "blouse", "tank"],
    bottoms: ["trouser", "pants", "skirt", "jeans", "bottom"],
    outerwear: ["coat", "blazer", "jacket", "trench", "outerwear"],
  };
  const category = CATEGORIES.find((c) => synonyms[c.slug].some((w) => lower.includes(w)));
  if (category) results = results.filter((p) => p.category === category.slug);

  const color = PRODUCTS.flatMap((p) => p.colors).find((c) => lower.includes(c.name.toLowerCase()));
  if (color) results = results.filter((p) => p.colors.some((c) => c.name === color.name));

  const under = lower.match(/under \$?(\d+)/);
  if (under) results = results.filter((p) => p.price <= Number(under[1]));

  if (/new/.test(lower)) results = results.filter((p) => p.isNew);
  if (/best|popular|loved/.test(lower)) results = results.sort((a, b) => b.popularity - a.popularity);

  return results;
}

// ─── Composer ──────────────────────────────────────────────────

export function respond(message: string, history: { role: string; content: string }[] = []): AssistantReply {
  const intent = detectIntent(message);
  const recentUserTurns = history.filter((h) => h.role === "user").slice(-2).map((h) => h.content).join(" ");

  switch (intent) {
    case "greeting":
      return {
        intent,
        reply: "Hello, I'm the ELORA assistant. I can help with orders, sizing, delivery and returns — or help you find something new. What can I do for you?",
        suggestions: DEFAULT_SUGGESTIONS,
      };

    case "order_status": {
      const match = message.match(/el-?\s?(\d{5})/i);
      if (!match) {
        return {
          intent,
          reply: "I can check that for you. What's your order number? You'll find it in your confirmation email — it starts with EL-, for example EL-10421.",
          suggestions: ["EL-10421", "EL-10388", "I can't find my order number"],
        };
      }
      const order = findDemoOrder(`EL-${match[1]}`);
      if (!order) {
        return {
          intent,
          reply: `I couldn't find order EL-${match[1]}. Please double-check the number in your confirmation email, or I can pass this to our care team.`,
          suggestions: ["Talk to a person", "EL-10421"],
          canEscalate: true,
        };
      }
      const items = order.items.join(" · ");
      if (order.status === "shipped") {
        return {
          intent,
          reply: `Good news — order ${order.number} is on its way with ${order.carrier}.\nExpected delivery: ${order.eta}.\nTracking: ${order.tracking}\nItems: ${items}`,
          suggestions: ["Can I change my delivery address?", "What is your return policy?"],
        };
      }
      if (order.status === "delivered") {
        return {
          intent,
          reply: `Order ${order.number} was delivered on ${order.deliveredAt} via ${order.carrier}.\nItems: ${items}\nIf anything isn't right, you have 30 days to return it free of charge.`,
          suggestions: ["How do I return an item?", "Exchange for a different size"],
        };
      }
      return {
        intent,
        reply: `Order ${order.number} is being prepared in our studio and will ship within 1 business day. You'll get a tracking link by email as soon as it leaves.\nItems: ${items}`,
        suggestions: ["Can I change or cancel my order?", "How long does shipping take?"],
      };
    }

    case "order_change":
      return {
        intent,
        reply: "We start preparing orders quickly, so changes and cancellations are guaranteed within 1 hour of purchase. After that, our care team will still try — and if it has already shipped, you can return it free of charge. Want me to pass this to the team now?",
        suggestions: ["Talk to a person", "What is your return policy?"],
        canEscalate: true,
      };

    case "sizing": {
      const measures = parseMeasurements(`${recentUserTurns} ${message}`);
      const product = findMentionedProduct(`${recentUserTurns} ${message}`);
      const size = recommendSize(measures);
      if (size) {
        const row = SIZE_CHART.find((r) => r.size === size)!;
        const fitNote = product ? `\nFor the ${product.name}: ${product.fit}` : "";
        return {
          intent,
          reply: `Based on your measurements, I'd recommend size ${size} (bust ${row.bust[0]}–${row.bust[1]} cm, waist ${row.waist[0]}–${row.waist[1]} cm, hips ${row.hips[0]}–${row.hips[1]} cm).${fitNote}\nIf you're between sizes, choose the larger one for tailored pieces and your usual size for knits.`,
          suggestions: ["Open the size guide", "What is your return policy?"],
          products: product ? [toCard(product)] : undefined,
        };
      }
      if (product) {
        return {
          intent,
          reply: `${product.name} — ${product.fit}\n${product.modelNote}\nShare your bust, waist and hip measurements (cm or inches) and I'll suggest a size.`,
          suggestions: ["Bust 88, waist 70, hips 96 cm", "Open the size guide"],
          products: [toCard(product)],
        };
      }
      return {
        intent,
        reply: "Happy to help you find your size. Tell me your bust, waist and hip measurements (cm or inches) — and the piece you're looking at, if you have one in mind.",
        suggestions: ["Bust 88, waist 70, hips 96 cm", "Waist 28 in for the Elara trousers", "Open the size guide"],
      };
    }

    case "returns":
      return {
        intent,
        reply: "You can return unworn items with tags attached within 30 days of delivery. Returns are free within the US, and refunds reach your original payment method within 5 business days of the parcel arriving with us. Exchanges for a different size are free too.",
        suggestions: ["How do I start a return?", "Can I exchange for a different size?"],
      };

    case "international":
      return {
        intent,
        reply: "Yes — we ship to Canada, the UK, the EU, Australia, Japan, Singapore and Mongolia. International delivery usually takes 5–10 business days, and duties and taxes are calculated at checkout so there's nothing extra to pay on arrival.",
        suggestions: ["How long does shipping take?", "What is your return policy?"],
      };

    case "shipping_time":
      return {
        intent,
        reply: `Standard Shipping takes 3–5 business days and is free on orders over $${FREE_SHIPPING_THRESHOLD} (otherwise $8). Express takes 1–2 business days for $18. Orders placed before 1 pm ET on business days ship the same day.`,
        suggestions: ["Do you ship internationally?", "Where is my order?"],
      };

    case "payment":
      return {
        intent,
        reply: "We accept Visa, Mastercard, American Express, Apple Pay and Google Pay. Payment is authorised at checkout and captured when your order ships. We never store full card details.",
        suggestions: ["Is checkout secure?", "How long does shipping take?"],
      };

    case "products": {
      const results = searchCatalogue(message).slice(0, 3);
      if (results.length === 0) {
        return {
          intent,
          reply: "I couldn't find an exact match, but here's what we carry: dresses, tops, bottoms and outerwear in soft neutrals, olive and black. Try something like “linen shirt” or “dresses under $90”.",
          suggestions: ["Show me new arrivals", "Dresses under $90", "Outerwear"],
        };
      }
      return {
        intent,
        reply: results.length === 1 ? "This might be what you're looking for:" : "Here are a few pieces you might like:",
        suggestions: ["Show me best sellers", "What size should I choose?"],
        products: results.map(toCard),
      };
    }

    case "human":
      return {
        intent,
        reply: "Of course. Leave your email below and our care team will reply within one business day — I'll pass along our conversation so you don't have to repeat yourself.",
        suggestions: [],
        canEscalate: true,
      };

    case "thanks":
      return { intent, reply: "You're very welcome. Is there anything else I can help with?", suggestions: DEFAULT_SUGGESTIONS };

    default:
      return {
        intent: "fallback",
        reply: "I'm not completely sure about that one. I can help with orders, sizing, shipping, returns and our collection — or connect you with our care team.",
        suggestions: ["Talk to a person", ...DEFAULT_SUGGESTIONS.slice(0, 2)],
        canEscalate: true,
      };
  }
}
