"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

/** Newsletter signup → POST /api/newsletter → n8n welcome series. */
export function Newsletter({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer", company: String(form.get("company") ?? "") }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.fieldErrors?.email ?? data.error ?? "Something went wrong.");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const dark = tone === "dark";

  if (status === "success") {
    return (
      <div className="flex items-start gap-3" role="status">
        <span className={cn("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full", dark ? "bg-ivory text-ink" : "bg-ink text-ivory")}>
          <Check className="h-3.5 w-3.5" />
        </span>
        <p className={cn("text-sm", dark ? "text-ivory/80" : "text-stone")}>
          You&apos;re on the list. Look out for a welcome note — with 10% off your first order — in your inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <label htmlFor={`newsletter-${tone}`} className="sr-only">
        Email address
      </label>
      <div className={cn("flex items-center border-b", dark ? "border-ivory/40 focus-within:border-ivory" : "border-ink/40 focus-within:border-ink")}>
        <input
          id={`newsletter-${tone}`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? `newsletter-${tone}-error` : undefined}
          className={cn("min-w-0 flex-1 bg-transparent py-3 text-[15px] focus:outline-none", dark ? "placeholder:text-ivory/50" : "placeholder:text-taupe-dark")}
        />
        {/* Honeypot */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <button
          type="submit"
          disabled={status === "loading"}
          className="group flex shrink-0 items-center gap-2 py-3 pl-4 text-[0.7rem] font-medium uppercase tracking-[0.18em] disabled:opacity-50"
        >
          {status === "loading" ? "Joining…" : "Subscribe"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.25} />
        </button>
      </div>
      {status === "error" && (
        <p id={`newsletter-${tone}-error`} className={cn("mt-2 text-xs", dark ? "text-[#E8B4A6]" : "text-danger")}>
          {error}
        </p>
      )}
    </form>
  );
}
