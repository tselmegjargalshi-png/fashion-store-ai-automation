"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, CreditCard, Lock } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { SummaryRows } from "@/components/cart/OrderSummary";
import { useStore } from "@/components/providers/StoreProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import { COUNTRIES, SHIPPING_METHODS, getShippingCost } from "@/lib/data/shipping";
import type { ShippingMethodId } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { cardSchema, checkoutSchema } from "@/lib/validation";

const INITIAL = {
  email: "",
  firstName: "",
  lastName: "",
  country: "United States",
  address1: "",
  city: "",
  postalCode: "",
  phone: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};
type Fields = typeof INITIAL;
type FieldName = keyof Fields;

const formatCard = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
};
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function CheckoutView() {
  const router = useRouter();
  const { items, subtotal, hydrated, cartId, clearCart } = useStore();
  const [fields, setFields] = useState<Fields>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>("standard");
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const shipping = getShippingCost(shippingMethod, subtotal);
  const total = subtotal + shipping;

  // ── Abandoned-cart signal ────────────────────────────────────────
  // If the shopper has given a valid email and leaves without ordering,
  // notify the backend once; n8n decides whether/when to send a reminder.
  const abandonRef = useRef({ email: "", completed: false, items, cartId });
  abandonRef.current.email = isEmail(fields.email) ? fields.email : "";
  abandonRef.current.items = items;
  abandonRef.current.cartId = cartId;

  useEffect(() => {
    const send = () => {
      const { email, completed, items: lines, cartId: id } = abandonRef.current;
      if (!email || completed || lines.length === 0 || !id) return;
      const key = `elora:abandon:${id}:${email}`;
      try {
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");
      } catch {
        /* ignore */
      }
      const body = JSON.stringify({
        cartId: id,
        email,
        items: lines.map((l) => ({ productId: l.productId, color: l.color, size: l.size, quantity: l.quantity })),
      });
      if (navigator.sendBeacon) navigator.sendBeacon("/api/cart/abandoned", new Blob([body], { type: "application/json" }));
      else fetch("/api/cart/abandoned", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
    };
    const onHide = () => document.visibilityState === "hidden" && send();
    window.addEventListener("pagehide", send);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("pagehide", send);
      document.removeEventListener("visibilitychange", onHide);
      send(); // client-side navigation away from checkout
    };
  }, []);

  function validate(subset?: FieldName[]) {
    const base = checkoutSchema.omit({ items: true, shippingMethod: true, marketingOptIn: true }).safeParse(fields);
    const card = cardSchema.safeParse(fields);
    const next: Partial<Record<FieldName, string>> = {};
    if (!base.success) base.error.issues.forEach((i) => (next[i.path[0] as FieldName] ??= i.message));
    if (!card.success) card.error.issues.forEach((i) => (next[i.path[0] as FieldName] ??= i.message));
    if (subset) {
      setErrors((prev) => {
        const merged = { ...prev };
        subset.forEach((k) => {
          if (next[k]) merged[k] = next[k];
          else delete merged[k];
        });
        return merged;
      });
    } else {
      setErrors(next);
    }
    return next;
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const name = e.target.name as FieldName;
    let value = e.target.value;
    if (name === "cardNumber") value = formatCard(value);
    if (name === "expiry") value = formatExpiry(value);
    if (name === "cvc") value = value.replace(/\D/g, "").slice(0, 4);
    setFields((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  const onBlur = (name: FieldName) => () => fields[name] && validate([name]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    const found = validate();
    const firstError = Object.keys(found)[0];
    if (firstError) {
      document.getElementById(`co-${firstError}`)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      // Card details are intentionally NOT sent — in production they go
      // straight to the payment provider's hosted fields.
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fields.email,
          firstName: fields.firstName,
          lastName: fields.lastName,
          country: fields.country,
          address1: fields.address1,
          city: fields.city,
          postalCode: fields.postalCode,
          phone: fields.phone,
          shippingMethod,
          marketingOptIn,
          items: items.map((i) => ({ productId: i.productId, color: i.color, size: i.size, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        throw new Error(data.error ?? "We couldn't place your order.");
      }
      abandonRef.current.completed = true;
      try {
        sessionStorage.setItem("elora:last-order", JSON.stringify({ ...data.order, items }));
      } catch {
        /* ignore */
      }
      clearCart();
      router.push(`/checkout/success?order=${encodeURIComponent(data.order.number)}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (!hydrated) return <div className="container-site min-h-[60vh] py-16" aria-busy="true" />;

  if (items.length === 0 && !submitting) {
    return (
      <div className="container-site flex min-h-[55vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="text-5xl">Your bag is empty</h1>
        <p className="mt-4 text-stone">Add a few pieces before heading to checkout.</p>
        <ButtonLink href="/shop" className="mt-8">
          Continue shopping
        </ButtonLink>
      </div>
    );
  }

  const field = (name: FieldName, label: string, props: Partial<React.InputHTMLAttributes<HTMLInputElement>> = {}) => (
    <Field id={`co-${name}`} label={label} error={errors[name]}>
      <input
        id={`co-${name}`}
        name={name}
        value={fields[name]}
        onChange={onChange}
        onBlur={onBlur(name)}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `co-${name}-error` : undefined}
        className="field"
        {...props}
      />
    </Field>
  );

  const summary = (
    <div>
      <ul className="space-y-5">
        {items.map((item) => (
          <li key={item.lineId} className="flex items-center gap-4">
            <div className="relative aspect-[3/4] w-16 shrink-0 bg-sand">
              <Img media={item.image} sizes="64px" plainFallback />
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[0.6rem] text-ivory">{item.quantity}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{item.name}</p>
              <p className="text-xs text-stone">
                {item.color} · {item.size}
              </p>
            </div>
            <p className="text-sm tabular-nums">{formatPrice(item.unitPrice * item.quantity)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-8 border-t border-line pt-6">
        <SummaryRows subtotal={subtotal} shipping={shipping} shippingLabel={shippingMethod === "express" ? "Express" : "Standard"} />
      </div>
    </div>
  );

  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[1fr_minmax(380px,42%)]">
      {/* Mobile summary toggle */}
      <details className="group border-b border-line bg-cream lg:hidden">
        <summary className="container-site flex cursor-pointer list-none items-center justify-between py-4 text-sm [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2">
            <span className="group-open:hidden">Show order summary</span>
            <span className="hidden group-open:inline">Hide order summary</span>
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" strokeWidth={1.25} />
          </span>
          <span className="font-medium tabular-nums">{formatPrice(total)}</span>
        </summary>
        <div className="container-site pb-6">{summary}</div>
      </details>

      <div className="px-5 pb-20 pt-10 sm:px-8 lg:pl-12 lg:pr-16 xl:pl-[max(3rem,calc((100vw-1440px)/2+3rem))]">
        <div className="mx-auto max-w-xl lg:mx-0 lg:ml-auto">
          <h1 className="text-5xl">Checkout</h1>
          <p className="mt-3 flex items-center gap-2 text-xs text-stone">
            <Lock className="h-3.5 w-3.5" strokeWidth={1.5} /> Demo checkout — no payment is taken and no card data leaves your browser.
          </p>

          <form onSubmit={onSubmit} noValidate className="mt-10 space-y-12">
            <Section title="Contact" step="01">
              {field("email", "Email", { type: "email", autoComplete: "email", inputMode: "email" })}
              <label className="mt-4 flex items-center gap-3 text-sm text-stone">
                <input type="checkbox" checked={marketingOptIn} onChange={(e) => setMarketingOptIn(e.target.checked)} className="h-4 w-4 accent-ink" />
                Email me new arrivals and exclusive offers
              </label>
            </Section>

            <Section title="Delivery" step="02">
              <div className="grid gap-4 sm:grid-cols-2">
                {field("firstName", "First name", { autoComplete: "given-name" })}
                {field("lastName", "Last name", { autoComplete: "family-name" })}
              </div>
              <Field id="co-country" label="Country" error={errors.country}>
                <select id="co-country" name="country" value={fields.country} onChange={onChange} autoComplete="country-name" className="field">
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              {field("address1", "Address", { autoComplete: "street-address", placeholder: "Street and house number" })}
              <div className="grid gap-4 sm:grid-cols-2">
                {field("city", "City", { autoComplete: "address-level2" })}
                {field("postalCode", "Postal code", { autoComplete: "postal-code" })}
              </div>
              {field("phone", "Phone", { type: "tel", autoComplete: "tel", placeholder: "For delivery updates only" })}
            </Section>

            <Section title="Shipping method" step="03">
              <fieldset>
                <legend className="sr-only">Shipping method</legend>
                <div className="divide-y divide-line border border-line">
                  {SHIPPING_METHODS.map((m) => {
                    const cost = getShippingCost(m.id, subtotal);
                    return (
                      <label key={m.id} className={cn("flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors", shippingMethod === m.id && "bg-cream")}>
                        <input type="radio" name="shippingMethod" value={m.id} checked={shippingMethod === m.id} onChange={() => setShippingMethod(m.id)} className="h-4 w-4 accent-ink" />
                        <span className="flex-1">
                          <span className="block text-sm">{m.name}</span>
                          <span className="block text-xs text-stone">{m.description}</span>
                        </span>
                        <span className="text-sm tabular-nums">{cost === 0 ? "Free" : formatPrice(cost)}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </Section>

            <Section title="Payment" step="04">
              <div className="border border-line">
                <div className="flex items-center justify-between border-b border-line bg-cream px-5 py-4">
                  <span className="flex items-center gap-3 text-sm">
                    <CreditCard className="h-4 w-4" strokeWidth={1.25} /> Credit / Debit Card
                  </span>
                  <span className="text-[0.6rem] uppercase tracking-[0.16em] text-stone">Visa · MC · Amex</span>
                </div>
                <div className="space-y-4 p-5">
                  {field("cardNumber", "Card number", { inputMode: "numeric", autoComplete: "cc-number", placeholder: "4242 4242 4242 4242" })}
                  <div className="grid grid-cols-2 gap-4">
                    {field("expiry", "Expiry", { inputMode: "numeric", autoComplete: "cc-exp", placeholder: "MM / YY" })}
                    {field("cvc", "Security code", { inputMode: "numeric", autoComplete: "cc-csc", placeholder: "CVC" })}
                  </div>
                  {field("cardName", "Name on card", { autoComplete: "cc-name" })}
                </div>
              </div>
            </Section>

            {formError && (
              <p role="alert" className="border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">
                {formError}
              </p>
            )}

            <div>
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? "Placing order…" : `Place order · ${formatPrice(total)}`}
              </Button>
              <p className="mt-4 text-center text-xs text-stone">
                By placing your order you agree to our terms. <Link href="/faq#returns" className="underline underline-offset-4">Returns policy</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <aside aria-label="Order summary" className="hidden border-l border-line bg-cream lg:block">
        <div className="sticky top-[var(--header-h)] max-w-lg px-12 py-14">
          <h2 className="mb-8 font-sans text-xs font-medium uppercase tracking-[0.18em]">Order summary</h2>
          {summary}
        </div>
      </aside>
    </div>
  );
}

function Section({ title, step, children }: { title: string; step: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-6 flex items-baseline gap-3 font-sans text-xs font-medium uppercase tracking-[0.18em]">
        <span className="font-serif text-lg normal-case italic tracking-normal text-olive">{step}</span>
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
