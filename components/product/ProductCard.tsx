"use client";

import Link from "next/link";
import { Heart, Plus, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { Img } from "@/components/ui/Img";
import { Price } from "@/components/ui/Price";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  priority?: boolean;
  sizes?: string;
  aspect?: string;
  showBadge?: boolean;
  badgeOverride?: Product["badge"];
}

export function ProductCard({
  product,
  priority,
  sizes = "(min-width:1280px) 22vw, (min-width:768px) 30vw, 46vw",
  aspect = "aspect-[3/4]",
  showBadge = true,
  badgeOverride,
}: Props) {
  const { addToCart, toggleWishlist, isWishlisted, hydrated } = useStore();
  const [color, setColor] = useState(product.colors[0].name);
  const [quickOpen, setQuickOpen] = useState(false);
  const saved = hydrated && isWishlisted(product.id);
  const badge = badgeOverride ?? product.badge;
  const href = `/products/${product.slug}?color=${encodeURIComponent(color)}`;

  return (
    <article className="group/card relative flex flex-col" aria-label={product.name}>
      <div className={cn("relative overflow-hidden bg-cream", aspect)}>
        <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0">
          <Img
            media={product.images[0]}
            sizes={sizes}
            priority={priority}
            fallbackLabel={product.name}
            className="transition-transform duration-[900ms] ease-editorial group-hover/card:scale-[1.025]"
          />
          {product.images[1] && (
            <span className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-editorial group-hover/card:opacity-100">
              <Img media={product.images[1]} sizes={sizes} alt="" fallbackLabel={product.name} />
            </span>
          )}
        </Link>

        {showBadge && badge && (
          <span className="pointer-events-none absolute left-3 top-3 bg-ivory/95 px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-ink">
            {badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute right-2 top-2 grid h-10 w-10 place-items-center text-ink transition-transform hover:scale-110"
        >
          <Heart className={cn("h-[18px] w-[18px] transition-colors", saved ? "fill-ink" : "fill-ivory/40")} strokeWidth={1.25} />
        </button>

        {/* Quick add — revealed on hover (desktop) or via the + button (touch). */}
        <div
          className={cn(
            "absolute inset-x-2 bottom-2 bg-ivory/95 p-3 backdrop-blur transition-all duration-300 ease-editorial",
            quickOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0 lg:group-focus-within/card:pointer-events-auto lg:group-focus-within/card:translate-y-0 lg:group-focus-within/card:opacity-100 lg:group-hover/card:pointer-events-auto lg:group-hover/card:translate-y-0 lg:group-hover/card:opacity-100",
          )}
        >
          <p className="mb-2 text-center text-[0.62rem] font-medium uppercase tracking-[0.16em] text-stone">Quick add · {color}</p>
          <div className="grid grid-cols-5 gap-1">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  addToCart(product, { color, size }, { openDrawer: false });
                  setQuickOpen(false);
                }}
                className="h-8 border border-line text-xs transition-colors hover:border-ink hover:bg-ink hover:text-ivory"
                aria-label={`Add ${product.name}, ${color}, size ${size} to bag`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setQuickOpen((v) => !v)}
          aria-expanded={quickOpen}
          aria-label={quickOpen ? "Close quick add" : `Quick add ${product.name}`}
          className={cn(
            "absolute bottom-2 right-2 grid h-9 w-9 place-items-center bg-ivory/95 text-ink shadow-sm transition-opacity lg:hidden",
            quickOpen && "opacity-0 pointer-events-none",
          )}
        >
          {quickOpen ? <X className="h-4 w-4" strokeWidth={1.5} /> : <Plus className="h-4 w-4" strokeWidth={1.5} />}
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-sans text-[0.95rem] leading-snug">
            <Link href={href} className="hover:text-olive">
              {product.name}
            </Link>
          </h3>
          <Price price={product.price} compareAt={product.compareAtPrice} className="shrink-0 text-[0.95rem]" />
        </div>
        <div className="relative z-10 mt-2.5 flex items-center gap-1.5" role="radiogroup" aria-label={`${product.name} colours`}>
          {product.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={color === c.name}
              aria-label={c.name}
              title={c.name}
              onClick={() => setColor(c.name)}
              className={cn(
                "grid h-5 w-5 place-items-center rounded-full border transition-colors",
                color === c.name ? "border-ink" : "border-transparent hover:border-taupe",
              )}
            >
              <span className="h-3 w-3 rounded-full ring-1 ring-inset ring-black/10" style={{ backgroundColor: c.hex }} />
            </button>
          ))}
          <span className="ml-1 text-xs text-stone">{product.colors.length} colours</span>
        </div>
      </div>
    </article>
  );
}
