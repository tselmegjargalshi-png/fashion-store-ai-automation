import type { AutomationEventType } from "./events";

export interface WorkflowBlueprint {
  event: AutomationEventType;
  title: string;
  trigger: string;
  steps: string[];
  outcome: string;
}

/** Human-readable blueprint of each n8n workflow (rendered on /case-study and in docs). */
export const WORKFLOWS: WorkflowBlueprint[] = [
  {
    event: "contact.submitted",
    title: "Customer inquiry triage",
    trigger: "Contact form submission",
    steps: ["Verify signature", "Save inquiry (Airtable / Postgres)", "AI classifies topic & urgency", "Notify team in Slack", "AI drafts reply in Gmail"],
    outcome: "Every message is categorised and answered with a ready-to-send draft in minutes.",
  },
  {
    event: "newsletter.subscribed",
    title: "Welcome series",
    trigger: "Newsletter signup",
    steps: ["Verify signature", "Upsert subscriber in ESP", "Generate 10% welcome code", "Send welcome email", "Day 3: brand story email"],
    outcome: "New subscribers receive a consistent, on-brand welcome without manual work.",
  },
  {
    event: "order.created",
    title: "Order processing & confirmation",
    trigger: "Successful checkout",
    steps: ["Verify signature & dedupe", "Write order to Google Sheets / ERP", "Send customer confirmation", "Notify fulfilment team", "Flag high-value orders"],
    outcome: "Orders flow to operations instantly with a confirmation in the customer's inbox.",
  },
  {
    event: "cart.abandoned",
    title: "Abandoned cart recovery",
    trigger: "Checkout exited with email captured",
    steps: ["Verify signature", "Wait 1 hour", "Check if order was placed", "AI personalises message", "Send reminder (+ 24h follow-up)"],
    outcome: "Recovers lost revenue with a timely, personal nudge — never after a purchase.",
  },
  {
    event: "review.submitted",
    title: "Review sentiment monitor",
    trigger: "Product review submitted",
    steps: ["Verify signature", "AI sentiment & topic analysis", "Classify: publish / review / escalate", "Alert admin if negative", "Log to product insights"],
    outcome: "Negative experiences reach the team the same day; product feedback is captured as data.",
  },
  {
    event: "support.escalated",
    title: "Support hand-off",
    trigger: "AI assistant escalates to a human",
    steps: ["Verify signature", "Create ticket with transcript", "AI summarises the issue", "Route by intent", "Acknowledge customer by email"],
    outcome: "Customers never repeat themselves — agents start with full context.",
  },
];
