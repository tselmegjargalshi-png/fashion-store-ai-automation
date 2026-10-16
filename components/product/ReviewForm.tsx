"use client";

import { Star } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { reviewSchema } from "@/lib/validation";

/** Review submission → POST /api/reviews → n8n sentiment analysis & moderation. */
export function ReviewForm({ productId, productName, onDone }: { productId: string; productName: string; onDone?: () => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      productId,
      rating,
      author: String(fd.get("author") ?? ""),
      email: String(fd.get("email") ?? ""),
      title: String(fd.get("title") ?? ""),
      body: String(fd.get("body") ?? ""),
      fit: (fd.get("fit") as string) || undefined,
      company: String(fd.get("company") ?? ""),
    };
    const parsed = reviewSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (next[String(i.path[0])] ??= i.message));
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        throw new Error(data.error ?? "Something went wrong.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="bg-cream p-8 text-center">
        <p className="font-serif text-3xl">Thank you</p>
        <p className="mt-3 text-sm text-stone">Your review of the {productName} has been received and will appear once it has been checked by our team.</p>
        {onDone && (
          <Button variant="outline" className="mt-6" onClick={onDone}>
            Close
          </Button>
        )}
      </div>
    );
  }

  const shown = hover || rating;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <fieldset>
        <legend className="field-label">Your rating</legend>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onClick={() => setRating(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={rating === n}
              className="p-1"
            >
              <Star className={cn("h-6 w-6 transition-colors", n <= shown ? "fill-ink text-ink" : "text-taupe")} strokeWidth={1} />
            </button>
          ))}
        </div>
        {errors.rating && <p className="field-error">{errors.rating}</p>}
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="author" label="Name" error={errors.author} autoComplete="name" />
        <Field name="email" label="Email (not published)" type="email" error={errors.email} autoComplete="email" />
      </div>
      <Field name="title" label="Review title" error={errors.title} />
      <div>
        <label htmlFor="review-body" className="field-label">
          Your review
        </label>
        <textarea id="review-body" name="body" rows={4} className="field resize-y" aria-invalid={Boolean(errors.body)} aria-describedby={errors.body ? "review-body-error" : undefined} />
        {errors.body && <p id="review-body-error" className="field-error">{errors.body}</p>}
      </div>
      <div>
        <label htmlFor="review-fit" className="field-label">
          How did it fit?
        </label>
        <select id="review-fit" name="fit" className="field" defaultValue="">
          <option value="">Select (optional)</option>
          <option>Runs small</option>
          <option>True to size</option>
          <option>Runs large</option>
        </select>
      </div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {status === "error" && <p className="field-error" role="alert">{formError}</p>}
      <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? "Submitting…" : "Submit review"}
      </Button>
    </form>
  );
}

function Field({ name, label, error, type = "text", autoComplete }: { name: string; label: string; error?: string; type?: string; autoComplete?: string }) {
  const id = `review-${name}`;
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input id={id} name={name} type={type} autoComplete={autoComplete} className="field" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
      {error && <p id={`${id}-error`} className="field-error">{error}</p>}
    </div>
  );
}
