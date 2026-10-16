"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { Img } from "@/components/ui/Img";
import { useDialog } from "@/components/ui/useDialog";
import { PRODUCTS } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";

const POPULAR = ["Linen", "Midi dress", "Blazer", "Satin", "Knit", "Olive"];

export function searchProducts(query: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return PRODUCTS.filter((p) => {
    const haystack = [p.name, p.category, p.shortDescription, p.fabric, ...p.colors.map((c) => c.name)].join(" ").toLowerCase();
    return terms.every((t) => haystack.includes(t.replace(/s$/, "")));
  });
}

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const results = useMemo(() => searchProducts(deferred), [deferred]);
  const close = () => setSearchOpen(false);
  useDialog(searchOpen, close, ref);

  useEffect(() => {
    if (!searchOpen) setQuery("");
  }, [searchOpen]);

  // Global shortcut: "/" opens search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 animate-fade-in bg-ink/35" onClick={close} aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-label="Search the store" className="relative max-h-[90vh] animate-slide-down overflow-y-auto bg-ivory">
        <div className="container-site py-6 md:py-10">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (results[0]) {
                router.push(`/products/${results[0].slug}`);
                close();
              }
            }}
            className="flex items-center gap-4 border-b border-ink pb-3"
          >
            <Search className="h-5 w-5 shrink-0" strokeWidth={1.25} />
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <input
              id="site-search"
              data-autofocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dresses, linen, olive…"
              autoComplete="off"
              className="w-full bg-transparent font-serif text-2xl placeholder:text-taupe focus:outline-none md:text-4xl"
            />
            <button type="button" onClick={close} className="grid h-10 w-10 shrink-0 place-items-center hover:text-olive" aria-label="Close search">
              <X className="h-5 w-5" strokeWidth={1.25} />
            </button>
          </form>

          {query.trim() === "" ? (
            <div className="pt-8">
              <p className="eyebrow mb-4 text-stone">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="border border-line px-4 py-2 text-sm transition-colors hover:border-ink"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-8">
              <p className="eyebrow mb-6 text-stone" aria-live="polite">
                {results.length} {results.length === 1 ? "result" : "results"}
              </p>
              {results.length === 0 ? (
                <p className="text-stone">
                  Nothing matched “{query}”. Try a category like <button className="underline" onClick={() => setQuery("dress")}>dress</button> or a colour like{" "}
                  <button className="underline" onClick={() => setQuery("ivory")}>ivory</button>.
                </p>
              ) : (
                <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
                  {results.slice(0, 6).map((p) => (
                    <li key={p.id}>
                      <Link href={`/products/${p.slug}`} onClick={close} className="group block">
                        <div className="relative aspect-[3/4] overflow-hidden bg-cream">
                          <Img media={p.images[0]} sizes="(min-width:1024px) 16vw, 45vw" fallbackLabel={p.name} className="transition-transform duration-700 group-hover:scale-[1.03]" />
                        </div>
                        <p className="mt-3 text-sm">{p.name}</p>
                        <p className="text-sm text-stone">{formatPrice(p.price)}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {results.length > 6 && (
                <Link href="/shop" onClick={close} className="mt-8 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em]">
                  View all products <ArrowRight className="h-4 w-4" strokeWidth={1.25} />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
