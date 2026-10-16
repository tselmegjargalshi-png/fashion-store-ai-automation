"use client";

import Link from "next/link";
import { useStore } from "@/components/providers/StoreProvider";
import { Img } from "@/components/ui/Img";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import type { CartItem } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

export function CartLineItem({ item, onNavigate, size = "sm" }: { item: CartItem; onNavigate?: () => void; size?: "sm" | "lg" }) {
  const { setQuantity, removeItem } = useStore();
  return (
    <div className="flex gap-4 sm:gap-5">
      <Link
        href={`/products/${item.slug}`}
        onClick={onNavigate}
        className={cn("relative shrink-0 overflow-hidden bg-cream", size === "lg" ? "aspect-[3/4] w-28 sm:w-32" : "aspect-[3/4] w-24")}
      >
        <Img media={item.image} sizes="140px" plainFallback />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/products/${item.slug}`} onClick={onNavigate} className={cn("hover:text-olive", size === "lg" ? "font-serif text-xl" : "text-sm")}>
              {item.name}
            </Link>
            <dl className="mt-1 flex gap-3 text-xs text-stone">
              <div className="flex gap-1"><dt>Colour:</dt><dd>{item.color}</dd></div>
              <div className="flex gap-1"><dt>Size:</dt><dd>{item.size}</dd></div>
            </dl>
          </div>
          <p className="shrink-0 text-sm tabular-nums">{formatPrice(item.unitPrice * item.quantity)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper size="sm" value={item.quantity} min={1} onChange={(q) => setQuantity(item.lineId, q)} label={`Quantity for ${item.name}`} />
          <button type="button" onClick={() => removeItem(item.lineId)} className="text-xs text-stone underline underline-offset-4 hover:text-ink">
            Remove<span className="sr-only"> {item.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
