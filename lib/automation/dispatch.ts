import "server-only";
import { createHmac } from "node:crypto";
import { createId } from "@/lib/utils";
import { EVENT_ROUTES, type AutomationEnvelope, type AutomationEventMap, type AutomationEventType } from "./events";

export interface DispatchResult {
  eventId: string;
  delivered: boolean;
  mode: "live" | "dry-run";
  status?: number;
  error?: string;
}

function resolveWebhookUrl(type: AutomationEventType): string | null {
  const route = EVENT_ROUTES[type];
  const override = process.env[route.env];
  if (override) return override;
  const base = process.env.N8N_WEBHOOK_BASE_URL;
  if (!base) return null;
  return `${base.replace(/\/$/, "")}/${route.path}`;
}

/**
 * Sends an automation event to n8n.
 *
 * - Signs the body with HMAC-SHA256 (header `X-Elora-Signature: sha256=<hex>`)
 *   so the n8n workflow can reject forged requests.
 * - Includes an idempotency key (`X-Elora-Event-Id`) for safe retries.
 * - Never throws: automation must not break the customer's action. Failures
 *   are logged and reported in the result for observability.
 * - Without configuration it runs in dry-run mode and logs the envelope,
 *   which keeps local development and the portfolio demo fully functional.
 */
export async function dispatchEvent<T extends AutomationEventType>(
  type: T,
  data: AutomationEventMap[T],
): Promise<DispatchResult> {
  const envelope: AutomationEnvelope<T> = {
    id: createId("evt"),
    type,
    version: 1,
    occurredAt: new Date().toISOString(),
    source: "elora-web",
    data,
  };

  const url = resolveWebhookUrl(type);
  const body = JSON.stringify(envelope);

  if (!url) {
    if (process.env.NODE_ENV !== "test") {
      console.info(`[automation:dry-run] ${type} → ${EVENT_ROUTES[type].workflow}`, envelope.id);
    }
    return { eventId: envelope.id, delivered: false, mode: "dry-run" };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Elora-Event": type,
    "X-Elora-Event-Id": envelope.id,
  };
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (secret) {
    headers["X-Elora-Signature"] = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, { method: "POST", headers, body, signal: controller.signal, cache: "no-store" });
    if (!res.ok) console.error(`[automation] ${type} webhook responded ${res.status}`);
    return { eventId: envelope.id, delivered: res.ok, mode: "live", status: res.status };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[automation] ${type} webhook failed: ${message}`);
    return { eventId: envelope.id, delivered: false, mode: "live", error: message };
  } finally {
    clearTimeout(timeout);
  }
}
