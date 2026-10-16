"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { ButtonLink } from "@/components/ui/Button";
import { getShippingCost } from "@/lib/data/shipping";
import { CartLineItem } from "./CartLineItem";
import { FreeShippingProgress } from "./FreeShippingProgress";
import { SummaryRows } from "./OrderSummary";

export function CartPageView() {
  const { items, subtotal, itemCount, hydrated } = useStore();

  if (!hydrated) return <div className="container-site min-h-[50vh] py-16" aria-busy="true" />;

  if (items.length === 0) {
    return (
      <div className="container-site flex min-h-[55vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="text-5xl md:text-6xl">Your bag is empty</h1>
        <p className="mt-4 max-w-sm text-stone">Pieces you add will appear here. Start with what&apos;s new this season.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/shop/new-arrivals">Shop new arrivals</ButtonLink>
          <ButtonLink href="/shop" variant="outline">
            Continue shopping
          </ButtonLink>
        </div>
      </div>
    );
  }

  const shipping = getShippingCost("standard", subtotal);

  return (
    <div className="container-site pb-24 pt-10 md:pt-14">
      <div className="flex items-end justify-between gap-6 border-b border-line pb-8">
        <h1 className="text-5xl md:text-6xl">
          Your bag <span className="align-top font-sans text-base text-stone">({itemCount})</span>
        </h1>
        <Link href="/shop" className="hidden text-xs uppercase tracking-[0.16em] underline underline-offset-4 sm:block">
          Continue shopping
        </Link>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <section aria-label="Items in your bag" className="lg:col-span-7">
          <div className="hidden grid-cols-[1fr_auto] border-b border-line pb-3 text-xs uppercase tracking-[0.16em] text-stone sm:grid">
            <span>Product</span>
            <span>Price</span>
          </div>
          <ul className="divide-y divide-line">
            {items.map((item) => (
              <li key={item.lineId} className="py-7">
                <CartLineItem item={item} size="lg" />
              </li>
            ))}
          </ul>
        </section>

        <aside aria-label="Order summary" className="lg:col-span-5">
          <div className="bg-cream p-6 sm:p-8 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <h2 className="mb-6 font-sans text-xs font-medium uppercase tracking-[0.18em]">Order summary</h2>
            <FreeShippingProgress subtotal={subtotal} />
            <div className="mt-8">
              <SummaryRows subtotal={subtotal} shipping={shipping} shippingLabel="Standard" />
            </div>
            <p className="mt-3 text-xs text-stone">Taxes and express options are calculated at checkout.</p>
            <ButtonLink href="/checkout" size="lg" className="mt-8 w-full">
              <Lock className="h-3.5 w-3.5" strokeWidth={1.5} /> Checkout
            </ButtonLink>
            <ButtonLink href="/shop" variant="outline" size="lg" className="mt-3 w-full">
              Continue shopping
            </ButtonLink>
            <ul className="mt-8 space-y-2 border-t border-line/80 pt-6 text-xs text-stone">
              <li>Free returns within 30 days</li>
              <li>Secure, encrypted checkout</li>
              <li>Questions? Ask our assistant, bottom right</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
