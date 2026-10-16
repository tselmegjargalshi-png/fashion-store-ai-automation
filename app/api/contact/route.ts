import { NextResponse } from "next/server";
import { dispatchEvent } from "@/lib/automation/dispatch";
import { badRequest, readJson, tooManyRequests } from "@/lib/server/http";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";
import type { ContactInquiry } from "@/lib/types";
import { createId } from "@/lib/utils";
import { contactSchema } from "@/lib/validation";

/** Contact form → n8n "Customer inquiry triage" (AI categorise + draft reply). */
export async function POST(req: Request) {
  if (!rateLimit(clientKey(req, "contact"), 5).ok) return tooManyRequests();

  const parsed = contactSchema.safeParse(await readJson(req));
  if (!parsed.success) return badRequest(parsed.error);
  const { company, orderNumber, ...fields } = parsed.data;

  // Honeypot filled → silently accept so bots learn nothing.
  if (company) return NextResponse.json({ ok: true, id: createId("inq") });

  const inquiry: ContactInquiry = {
    id: createId("inq"),
    ...fields,
    orderNumber: orderNumber ? orderNumber.toUpperCase().replace(/^EL-?/, "EL-") : undefined,
    createdAt: new Date().toISOString(),
  };

  const automation = await dispatchEvent("contact.submitted", { inquiry, pageUrl: req.headers.get("referer") ?? undefined });
  return NextResponse.json({ ok: true, id: inquiry.id, automation: automation.mode });
}
