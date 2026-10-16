import { NextResponse } from "next/server";
import { dispatchEvent } from "@/lib/automation/dispatch";
import { getProductById } from "@/lib/data/products";
import { SITE } from "@/lib/site";
import { badRequest, readJson, tooManyRequests } from "@/lib/server/http";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";
import type { CartItem } from "@/lib/types";
import { lineIdFor } from "@/lib/utils";
import { abandonedCartSchema } from "@/lib/validation";

/**
 * Checkout exit beacon → n8n "Abandoned cart recovery".
 * Sent (via navigator.sendBeacon) when a shopper who has entered an email
 * leaves checkout without ordering. n8n waits, checks whether an order
 * arrived for the same cart, and only then sends a personalised reminder.
 */
export async function POST(req: Request) {
  if (!rateLimit(clientKey(req, "abandoned"), 6).ok) return tooManyRequests();

  // sendBeacon posts text/plain; parse leniently.
  let body: unknown = await readJson(req.clone());
  if (body === null) {
    try {
      body = JSON.parse(await req.text());
    } catch {
      body = null;
    }
  }

  const parsed = abandonedCartSchema.safeParse(body);
  if (!parsed.success) return badRequest(parsed.error);

  const items: CartItem[] = parsed.data.items.flatMap((line) => {
    const p = getProductById(line.productId);
    if (!p) return [];
    return [
      {
        lineId: lineIdFor(p.id, line.color, line.size),
        productId: p.id,
        slug: p.slug,
        name: p.name,
        image: p.images[0],
        color: line.color,
        size: line.size,
        unitPrice: p.price,
        quantity: line.quantity,
      },
    ];
  });
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  const automation = await dispatchEvent("cart.abandoned", {
    cartId: parsed.data.cartId,
    email: parsed.data.email.toLowerCase(),
    items,
    subtotal,
    checkoutUrl: `${SITE.url}/cart`,
  });
  return NextResponse.json({ ok: true, automation: automation.mode });
}
