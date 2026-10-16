"use client";

import { useRouter } from "next/navigation";
import { Heart, Ruler, RotateCcw, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Price } from "@/components/ui/Price";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Stars } from "@/components/ui/Stars";
import { CATEGORIES } from "@/lib/data/products";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/site";
import type { Product, Size } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SizeGuide } from "./SizeGuide";

export function ProductInfo({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isWishlisted, hydrated } = useStore();

  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const saved = hydrated && isWishlisted(product.id);
  const category = CATEGORIES.find((c) => c.slug === product.category);

  // Preselect the colour chosen on the product card (?color=…) without
  // opting the page out of static rendering.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("color");
    const match = product.colors.find((c) => c.name === requested);
    if (match) setColor(match.name);
  }, [product.colors]);

  function add(buyNow = false) {
    if (!size) {
      setSizeError(true);
      document.getElementById("size-options")?.focus();
      return;
    }
    addToCart(product, { color, size, quantity }, { openDrawer: !buyNow });
    if (buyNow) router.push("/checkout");
  }

  return (
    <div>
      <p className="eyebrow text-stone">{category?.name}</p>
      <h1 className="mt-3 text-[2.6rem] uppercase leading-[0.98] tracking-[0.01em] sm:text-5xl">{product.name}</h1>
      <div className="mt-4 flex items-center justify-between gap-4">
        <Price price={product.price} compareAt={product.compareAtPrice} className="text-xl" />
        <a href="#reviews" className="flex items-center gap-2 text-xs text-stone hover:text-ink">
          <Stars rating={product.rating} />
          <span className="underline underline-offset-4">{product.reviewCount} reviews</span>
        </a>
      </div>
      <p className="mt-6 leading-7 text-stone">{product.description}</p>

      {/* Colour */}
      <fieldset className="mt-8">
        <legend className="mb-3 text-xs font-medium uppercase tracking-[0.16em]">
          Colour: <span className="font-normal normal-case tracking-normal text-stone">{color}</span>
        </legend>
        <div className="flex gap-2" role="radiogroup" aria-label="Colour">
          {product.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={color === c.name}
              aria-label={c.name}
              onClick={() => setColor(c.name)}
              className={cn("grid h-10 w-10 place-items-center rounded-full border transition-colors", color === c.name ? "border-ink" : "border-transparent hover:border-taupe")}
            >
              <span className="h-7 w-7 rounded-full ring-1 ring-inset ring-black/10" style={{ backgroundColor: c.hex }} />
            </button>
          ))}
        </div>
      </fieldset>

      {/* Size */}
      <fieldset className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <legend className="text-xs font-medium uppercase tracking-[0.16em]">
            Size{size && <span className="font-normal normal-case tracking-normal text-stone">: {size}</span>}
          </legend>
          <button type="button" onClick={() => setGuideOpen(true)} className="flex items-center gap-1.5 text-xs underline underline-offset-4 hover:text-olive">
            <Ruler className="h-3.5 w-3.5" strokeWidth={1.25} /> Size guide
          </button>
        </div>
        <div
          id="size-options"
          tabIndex={-1}
          role="radiogroup"
          aria-label="Size"
          aria-invalid={sizeError}
          aria-describedby={sizeError ? "size-error" : undefined}
          className="grid grid-cols-5 gap-2 focus:outline-none"
        >
          {product.sizes.map((s) => {
            const low = product.lowStock?.includes(s);
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                onClick={() => {
                  setSize(s);
                  setSizeError(false);
                }}
                className={cn(
                  "relative h-12 border text-sm transition-colors",
                  size === s ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink",
                  sizeError && "border-danger/60",
                )}
              >
                {s}
                {low && <span className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full bg-gold" aria-label="Low stock" />}
              </button>
            );
          })}
        </div>
        {sizeError ? (
          <p id="size-error" className="field-error" role="alert">
            Please select a size.
          </p>
        ) : size && product.lowStock?.includes(size) ? (
          <p className="mt-2 text-xs text-gold">Only a few left in {size}.</p>
        ) : (
          <p className="mt-2 text-xs text-stone">{product.fit}</p>
        )}
      </fieldset>

      {/* Actions */}
      <div className="mt-8 flex gap-2 sm:gap-3">
        <QuantityStepper value={quantity} onChange={setQuantity} />
        <Button size="lg" className="min-w-0 flex-1 px-4" onClick={() => add(false)}>
          Add to Cart
        </Button>
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-pressed={saved}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          className="grid h-14 w-14 shrink-0 place-items-center border border-line transition-colors hover:border-ink"
        >
          <Heart className={cn("h-5 w-5", saved && "fill-ink")} strokeWidth={1.25} />
        </button>
      </div>
      <Button variant="olive" size="lg" className="mt-3 w-full" onClick={() => add(true)}>
        Buy Now
      </Button>

      <ul className="mt-8 space-y-3 border-y border-line py-5 text-sm">
        <li className="flex items-center gap-3">
          <Truck className="h-4 w-4 text-olive" strokeWidth={1.25} /> Free shipping on orders over ${FREE_SHIPPING_THRESHOLD}
        </li>
        <li className="flex items-center gap-3">
          <RotateCcw className="h-4 w-4 text-olive" strokeWidth={1.25} /> Free returns and exchanges within 30 days
        </li>
      </ul>

      <Accordion
        className="mt-8"
        defaultOpen={0}
        items={[
          {
            title: "Product details",
            content: (
              <>
                <ul className="list-disc space-y-1 pl-4">
                  {product.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <p className="mt-3">{product.modelNote}</p>
                <p className="mt-1 text-xs">SKU {product.sku}</p>
              </>
            ),
          },
          {
            title: "Fabric & care",
            content: (
              <>
                <p>{product.fabric}</p>
                <ul className="mt-3 list-disc space-y-1 pl-4">
                  {product.care.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </>
            ),
          },
          {
            title: "Shipping",
            content: (
              <p>
                Standard Shipping (3–5 business days) is free on orders over ${FREE_SHIPPING_THRESHOLD}, otherwise $8. Express Shipping (1–2 business days) is $18. We ship
                internationally to selected countries in 5–10 business days.
              </p>
            ),
          },
          {
            title: "Returns",
            content: <p>Return unworn items with tags attached within 30 days of delivery for a full refund. Returns and exchanges are free within the US.</p>,
          },
        ]}
      />

      <Modal open={guideOpen} onClose={() => setGuideOpen(false)} title="Size guide">
        <SizeGuide compact />
      </Modal>
    </div>
  );
}
