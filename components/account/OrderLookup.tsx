"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { findDemoOrder, type DemoOrderStatus } from "@/lib/data/orders";
import { cn } from "@/lib/utils";

const STEPS = ["processing", "shipped", "delivered"] as const;

export function OrderLookup() {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState<DemoOrderStatus | null | undefined>(undefined);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setResult(findDemoOrder(number.trim()) ?? null);
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="lookup-number" className="field-label">
            Order number
          </label>
          <input id="lookup-number" value={number} onChange={(e) => setNumber(e.target.value)} required placeholder="EL-10421" className="field" />
        </div>
        <Button type="submit" size="md" className="h-[50px]">
          Track order
        </Button>
      </form>
      <p className="mt-2 text-xs text-stone">Demo orders: EL-10421, EL-10388, EL-10455</p>

      <div aria-live="polite">
        {result === null && <p className="mt-6 text-sm text-danger">We couldn&apos;t find that order. Please check the number in your confirmation email.</p>}
        {result && (
          <div className="mt-8 border border-line p-6">
            <div className="flex items-baseline justify-between">
              <p className="font-serif text-2xl">{result.number}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-olive">{result.status}</p>
            </div>
            <ol className="mt-6 grid grid-cols-3 gap-2" aria-label="Order progress">
              {STEPS.map((step, i) => {
                const reached = STEPS.indexOf(result.status) >= i;
                return (
                  <li key={step}>
                    <span className={cn("block h-[3px]", reached ? "bg-olive" : "bg-sand")} />
                    <span className={cn("mt-2 block text-xs capitalize", reached ? "text-ink" : "text-stone")}>{step}</span>
                  </li>
                );
              })}
            </ol>
            <ul className="mt-6 space-y-1 text-sm text-stone">
              {result.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {result.eta && <p className="mt-4 text-sm">Expected delivery: {result.eta} · {result.carrier} {result.tracking}</p>}
            {result.deliveredAt && <p className="mt-4 text-sm">Delivered {result.deliveredAt} via {result.carrier}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
