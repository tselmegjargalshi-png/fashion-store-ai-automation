"use client";

import { Check } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { contactSchema } from "@/lib/validation";

type Errors = Partial<Record<"name" | "email" | "subject" | "message" | "orderNumber", string>>;

/** Contact form → POST /api/contact → n8n inquiry triage (AI categorisation + draft reply). */
export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Errors = {};
      parsed.error.issues.forEach((i) => (next[i.path[0] as keyof Errors] ??= i.message));
      setErrors(next);
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        throw new Error(data.error ?? "Something went wrong.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col items-start bg-cream p-8 sm:p-10">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-olive text-ivory">
          <Check className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <h2 className="mt-6 text-4xl">Message received</h2>
        <p className="mt-3 max-w-md text-stone">Thank you for getting in touch. A member of our care team will reply within one business day.</p>
        <Button variant="outline" className="mt-8" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  const field = (name: keyof Errors, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`contact-${name}`} className="field-label">
        {label}
      </label>
      <input
        id={`contact-${name}`}
        name={name}
        className="field"
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `contact-${name}-error` : undefined}
        {...props}
      />
      {errors[name] && (
        <p id={`contact-${name}-error`} className="field-error">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {field("name", "Name", { autoComplete: "name" })}
        {field("email", "Email", { type: "email", autoComplete: "email" })}
      </div>
      <div className="grid gap-5 sm:grid-cols-[1fr_180px]">
        {field("subject", "Subject")}
        {field("orderNumber", "Order no. (optional)", { placeholder: "EL-10421" })}
      </div>
      <div>
        <label htmlFor="contact-message" className="field-label">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          className="field resize-y"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className="field-error">
            {errors.message}
          </p>
        )}
      </div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {status === "error" && (
        <p role="alert" className="field-error">
          {formError}
        </p>
      )}
      <Button type="submit" size="lg" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
