"use client";

import Link from "next/link";
import { useStore } from "@/components/providers/StoreProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { formatPrice } from "@/lib/utils";
import { CartLineItem } from "./CartLineItem";
import { FreeShippingProgress } from "./FreeShippingProgress";

export function CartDrawer() {
  const { cartOpen, setCartOpen, items, itemCount, subtotal } = useStore();
  const close = () => setCartOpen(false);

  return (
    <Drawer
      open={cartOpen}
      onClose={close}
      title={`Your bag (${itemCount})`}
      footer={
        items.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium uppercase tracking-[0.16em]">Subtotal</span>
              <span className="text-lg tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-stone">Shipping and taxes calculated at checkout.</p>
            <ButtonLink href="/checkout" onClick={close} className="w-full" size="lg">
              Checkout
            </ButtonLink>
            <Link href="/cart" onClick={close} className="block text-center text-xs uppercase tracking-[0.16em] underline underline-offset-4">
              View bag
            </Link>
          </div>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center px-8 py-16 text-center">
          <p className="font-serif text-3xl">Your bag is empty</p>
          <p className="mt-3 text-sm text-stone">Start with something new — or revisit the pieces you&apos;ve saved.</p>
          <div className="mt-8 flex w-full flex-col gap-3">
            <ButtonLink href="/shop/new-arrivals" onClick={close}>Shop new arrivals</ButtonLink>
            <ButtonLink href="/wishlist" onClick={close} variant="outline">View wishlist</ButtonLink>
          </div>
        </div>
      ) : (
        <div className="px-6 py-6">
          <FreeShippingProgress subtotal={subtotal} />
          <ul className="mt-6 divide-y divide-line">
            {items.map((item) => (
              <li key={item.lineId} className="py-5 first:pt-0">
                <CartLineItem item={item} onNavigate={close} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Drawer>
  );
}
