import { NextResponse } from "next/server";
import { dispatchEvent } from "@/lib/automation/dispatch";
import { getProductById } from "@/lib/data/products";
import { badRequest, readJson, tooManyRequests } from "@/lib/server/http";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";
import type { Review } from "@/lib/types";
import { createId } from "@/lib/utils";
import { reviewSchema } from "@/lib/validation";

/** Review submission → n8n "Review sentiment monitor" (AI sentiment, alert if negative). */
export async function POST(req: Request) {
  if (!rateLimit(clientKey(req, "reviews"), 3).ok) return tooManyRequests();

  const parsed = reviewSchema.safeParse(await readJson(req));
  if (!parsed.success) return badRequest(parsed.error);
  const d = parsed.data;
  if (d.company) return NextResponse.json({ ok: true });

  const product = getProductById(d.productId);
  if (!product) return NextResponse.json({ ok: false, error: "Product not found." }, { status: 404 });

  // Reviews are held for moderation; n8n publishes or flags them.
  const review: Review = {
    id: createId("rev"),
    productId: product.id,
    author: d.author,
    rating: d.rating as Review["rating"],
    title: d.title,
    body: d.body,
    sizePurchased: d.sizePurchased,
    fit: d.fit,
    verified: false,
    createdAt: new Date().toISOString(),
  };

  const automation = await dispatchEvent("review.submitted", { review, productName: product.name });
  return NextResponse.json({ ok: true, id: review.id, automation: automation.mode });
}
