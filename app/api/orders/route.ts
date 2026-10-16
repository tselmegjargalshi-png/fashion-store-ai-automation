import { NextResponse } from "next/server";
import { dispatchEvent } from "@/lib/automation/dispatch";
import { buildOrder } from "@/lib/commerce";
import { badRequest, readJson, tooManyRequests } from "@/lib/server/http";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";
import { checkoutSchema } from "@/lib/validation";

/**
 * Demo checkout → n8n "Order processing & confirmation".
 *
 * No payment is processed. In production this route would create a payment
 * intent with the PSP (card data never touches this server), and emit
 * `order.created` from the PSP's payment-succeeded webhook instead.
 */
export async function POST(req: Request) {
  if (!rateLimit(clientKey(req, "orders"), 10).ok) return tooManyRequests();

  const parsed = checkoutSchema.safeParse(await readJson(req));
  if (!parsed.success) return badRequest(parsed.error);
  const d = parsed.data;

  const result = buildOrder({
    email: d.email.toLowerCase(),
    shippingMethod: d.shippingMethod,
    address: {
      firstName: d.firstName,
      lastName: d.lastName,
      address1: d.address1,
      city: d.city,
      postalCode: d.postalCode,
      country: d.country,
      phone: d.phone,
    },
    lines: d.items,
  });

  if ("error" in result) return NextResponse.json({ ok: false, error: result.error }, { status: 422 });

  const automation = await dispatchEvent("order.created", { order: result.order });
  return NextResponse.json({
    ok: true,
    order: {
      number: result.order.number,
      email: result.order.customerEmail,
      total: result.order.total,
      subtotal: result.order.subtotal,
      shipping: result.order.shipping,
      shippingMethod: result.order.shippingMethod,
      firstName: d.firstName,
    },
    automation: automation.mode,
  });
}
