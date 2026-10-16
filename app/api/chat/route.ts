import { NextResponse } from "next/server";
import { dispatchEvent } from "@/lib/automation/dispatch";
import { badRequest, readJson, tooManyRequests } from "@/lib/server/http";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";
import { detectIntent, respond } from "@/lib/support/assistant";
import { chatSchema } from "@/lib/validation";

/** AI support assistant endpoint. Escalations go to n8n "Support hand-off". */
export async function POST(req: Request) {
  if (!rateLimit(clientKey(req, "chat"), 30).ok) return tooManyRequests();

  const parsed = chatSchema.safeParse(await readJson(req));
  if (!parsed.success) return badRequest(parsed.error);
  const { message, history, escalateEmail } = parsed.data;

  if (escalateEmail) {
    const lastQuestion = [...history].reverse().find((h) => h.role === "user")?.content ?? message;
    await dispatchEvent("support.escalated", {
      email: escalateEmail.toLowerCase(),
      question: lastQuestion,
      transcript: history,
      detectedIntent: detectIntent(lastQuestion),
    });
    return NextResponse.json({
      intent: "human",
      reply: `Thank you — our care team will reply to ${escalateEmail} within one business day. Your conversation has been shared with them.`,
      suggestions: [],
    });
  }

  // Small delay keeps the typing indicator natural; remove when backed by an LLM.
  await new Promise((r) => setTimeout(r, 450));
  return NextResponse.json(respond(message, history));
}
