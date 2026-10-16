"use client";

import { useStore } from "@/components/providers/StoreProvider";
import { ButtonLink } from "@/components/ui/Button";
import { PRODUCTS } from "@/lib/data/products";
import { ProductGrid } from "./ProductGrid";

export function WishlistView() {
  const { wishlist, hydrated } = useStore();
  const products = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="container-site pb-24 pt-14 md:pt-20">
      <header className="mb-12 flex flex-col gap-4 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-stone">Saved for later</p>
          <h1 className="mt-4 text-5xl md:text-6xl">Wishlist</h1>
        </div>
        {hydrated && products.length > 0 && <p className="text-sm text-stone">{products.length} saved pieces</p>}
      </header>
      {!hydrated ? (
        <div className="min-h-[30vh]" aria-busy="true" />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="font-serif text-3xl">Nothing saved yet</p>
          <p className="mt-3 max-w-sm text-stone">Tap the heart on any piece to keep it here for later.</p>
          <ButtonLink href="/shop" className="mt-8">
            Explore the collection
          </ButtonLink>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
