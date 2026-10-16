"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import type { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface LastOrder {
  number: string;
  email: string;
  firstName: string;
  subtotal: number;
  shipping: number;
  total: number;
  shippingMethod: "standard" | "express";
  items: CartItem[];
}

export function OrderConfirmation() {
  const [order, setOrder] = useState<LastOrder | null>(null);
  const [number, setNumber] = useState<string | null>(null);

  useEffect(() => {
    setNumber(new URLSearchParams(window.location.search).get("order"));
    try {
      const saved = sessionStorage.getItem("elora:last-order");
      if (saved) setOrder(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  const orderNumber = order?.number ?? number;

  return (
    <div className="container-site py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-olive text-ivory">
          <Check className="h-6 w-6" strokeWidth={1.5} />
        </span>
        <p className="eyebrow mt-8 text-stone">Order {orderNumber ?? "confirmed"}</p>
        <h1 className="mt-4 text-5xl md:text-6xl">
          Thank you{order?.firstName ? `, ${order.firstName}` : ""}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-stone">
          Your order is confirmed. {order?.email ? <>A confirmation is on its way to <span className="text-ink">{order.email}</span>.</> : null} We&apos;ll email you again when it ships.
        </p>
      </div>

      {order && (
        <div className="mx-auto mt-14 max-w-xl bg-cream p-6 sm:p-8">
          <ul className="space-y-4">
            {order.items.map((item) => (
              <li key={item.lineId} className="flex items-center gap-4">
                <div className="relative aspect-[3/4] w-14 shrink-0 bg-sand">
                  <Img media={item.image} sizes="56px" plainFallback />
                </div>
                <div className="flex-1 text-sm">
                  <p>{item.name}</p>
                  <p className="text-xs text-stone">
                    {item.color} · {item.size} · Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm tabular-nums">{formatPrice(item.unitPrice * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 border-t border-line pt-6 text-sm">
            <div className="flex justify-between"><dt className="text-stone">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-stone">Shipping ({order.shippingMethod})</dt><dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd></div>
            <div className="flex justify-between pt-2 text-base font-medium"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
          </dl>
        </div>
      )}

      <div className="mx-auto mt-12 max-w-xl border border-dashed border-line p-6 text-sm text-stone">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-ink">Behind the scenes</p>
        This order emitted an <code className="bg-cream px-1.5 py-0.5 text-ink">order.created</code> event. Connected to n8n, it triggers order processing, a team
        notification and the customer confirmation email. In this demo no payment is taken and nothing is shipped.
      </div>

      <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/shop">Continue shopping</ButtonLink>
        <ButtonLink href="/case-study#automation" variant="outline">
          See the automation flow
        </ButtonLink>
      </div>
    </div>
  );
}
