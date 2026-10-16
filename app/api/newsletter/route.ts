import { NextResponse } from "next/server";
import { dispatchEvent } from "@/lib/automation/dispatch";
import { badRequest, readJson, tooManyRequests } from "@/lib/server/http";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";
import type { NewsletterSubscriber } from "@/lib/types";
import { createId } from "@/lib/utils";
import { newsletterSchema } from "@/lib/validation";

/** Newsletter signup → n8n "Welcome series" (store subscriber + welcome email). */
export async function POST(req: Request) {
  if (!rateLimit(clientKey(req, "newsletter"), 5).ok) return tooManyRequests();

  const parsed = newsletterSchema.safeParse(await readJson(req));
  if (!parsed.success) return badRequest(parsed.error);
  if (parsed.data.company) return NextResponse.json({ ok: true });

  const subscriber: NewsletterSubscriber = {
    id: createId("sub"),
    email: parsed.data.email.toLowerCase(),
    source: parsed.data.source,
    subscribedAt: new Date().toISOString(),
  };

  const automation = await dispatchEvent("newsletter.subscribed", { subscriber });
  return NextResponse.json({ ok: true, automation: automation.mode });
}
