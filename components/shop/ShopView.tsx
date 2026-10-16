"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { CATEGORIES, getAllColors } from "@/lib/data/products";
import { PRICE_RANGES, SORT_OPTIONS, filterAndSort, scopeProducts, type ShopScope, type SortValue } from "@/lib/shop";
import type { Size } from "@/lib/types";
import { cn } from "@/lib/utils";

const SIZES: Size[] = ["XS", "S", "M", "L", "XL"];
const COLORS = getAllColors();

function list(params: URLSearchParams, key: string) {
  return params.get(key)?.split(",").filter(Boolean) ?? [];
}

export function ShopView({ scope }: { scope: ShopScope }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const base = useMemo(() => scopeProducts(scope), [scope]);

  const state = {
    categories: scope === "all" || scope === "new-arrivals" ? list(params, "category") : [],
    sizes: list(params, "size"),
    colors: list(params, "color"),
    prices: list(params, "price"),
    sort: (SORT_OPTIONS.some((o) => o.value === params.get("sort")) ? params.get("sort") : "featured") as SortValue,
  };

  const products = useMemo(() => filterAndSort(base, state), [base, params]); // eslint-disable-line react-hooks/exhaustive-deps
  const activeCount = state.categories.length + state.sizes.length + state.colors.length + state.prices.length;

  function update(mutator: (p: URLSearchParams) => void) {
    const next = new URLSearchParams(params.toString());
    mutator(next);
    const qs = next.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  function toggle(key: string, value: string) {
    update((p) => {
      const values = list(p, key);
      const nextValues = values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
      if (nextValues.length) p.set(key, nextValues.join(","));
      else p.delete(key);
    });
  }

  function clearAll() {
    update((p) => ["category", "size", "color", "price"].forEach((k) => p.delete(k)));
  }

  const chips = [
    ...state.categories.map((v) => ({ key: "category", value: v, label: CATEGORIES.find((c) => c.slug === v)?.name ?? v })),
    ...state.sizes.map((v) => ({ key: "size", value: v, label: `Size ${v}` })),
    ...state.colors.map((v) => ({ key: "color", value: v, label: COLORS.find((c) => c.name.toLowerCase() === v)?.name ?? v })),
    ...state.prices.map((v) => ({ key: "price", value: v, label: PRICE_RANGES.find((r) => r.value === v)?.label ?? v })),
  ];

  const filters = (
    <FilterPanel
      showCategories={scope === "all" || scope === "new-arrivals"}
      state={state}
      onToggle={toggle}
      counts={{
        category: (slug) => base.filter((p) => p.category === slug).length,
      }}
    />
  );

  return (
    <div className="container-site pb-24">
      {/* Toolbar */}
      <div className="sticky top-[var(--header-h)] z-30 -mx-5 mb-8 flex items-center justify-between gap-4 border-y border-line bg-ivory/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:border-x-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" strokeWidth={1.25} />
          Filter {activeCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[0.6rem] text-ivory">{activeCount}</span>}
        </button>
        <p className="hidden text-sm text-stone lg:block" aria-live="polite">
          {products.length} {products.length === 1 ? "piece" : "pieces"}
        </p>
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="hidden text-xs uppercase tracking-[0.16em] text-stone sm:block">
            Sort by
          </label>
          <select
            id="sort"
            value={state.sort}
            onChange={(e) => update((p) => (e.target.value === "featured" ? p.delete("sort") : p.set("sort", e.target.value)))}
            className="cursor-pointer border-none bg-transparent py-1 pr-1 text-sm focus:outline-none focus-visible:outline-2"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block xl:col-span-2" aria-label="Filters">
          <div className="sticky top-[calc(var(--header-h)+1.5rem)]">{filters}</div>
        </aside>

        <div className="lg:col-span-9 xl:col-span-10">
          {chips.length > 0 && (
            <div className="mb-8 flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <button
                  key={`${chip.key}-${chip.value}`}
                  type="button"
                  onClick={() => toggle(chip.key, chip.value)}
                  className="flex items-center gap-2 bg-cream px-3 py-1.5 text-xs transition-colors hover:bg-sand"
                  aria-label={`Remove filter ${chip.label}`}
                >
                  {chip.label} <X className="h-3 w-3" strokeWidth={1.5} />
                </button>
              ))}
              <button type="button" onClick={clearAll} className="ml-2 text-xs underline underline-offset-4">
                Clear all
              </button>
            </div>
          )}

          <p className="mb-6 text-sm text-stone lg:hidden" aria-live="polite">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>

          {products.length > 0 ? (
            <ProductGrid products={products} columns={3} priorityCount={3} className="xl:grid-cols-3" />
          ) : (
            <div className="flex flex-col items-center border border-dashed border-line px-6 py-20 text-center">
              <p className="font-serif text-3xl">No pieces match those filters</p>
              <p className="mt-3 text-stone">Try removing a filter or two.</p>
              <Button variant="outline" className="mt-8" onClick={clearAll}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filter"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={clearAll} disabled={activeCount === 0}>
              Clear
            </Button>
            <Button className="flex-[2]" onClick={() => setDrawerOpen(false)}>
              Show {products.length} {products.length === 1 ? "result" : "results"}
            </Button>
          </div>
        }
      >
        <div className="px-6 py-6">{filters}</div>
      </Drawer>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-line pb-7 pt-1 [&:not(:first-child)]:pt-7">
      <legend className="sr-only">{title}</legend>
      <p aria-hidden="true" className="mb-4 text-xs font-medium uppercase tracking-[0.18em]">
        {title}
      </p>
      {children}
    </fieldset>
  );
}

function FilterPanel({
  showCategories,
  state,
  onToggle,
  counts,
}: {
  showCategories: boolean;
  state: { categories: string[]; sizes: string[]; colors: string[]; prices: string[] };
  onToggle: (key: string, value: string) => void;
  counts: { category: (slug: string) => number };
}) {
  return (
    <div>
      {showCategories && (
        <FilterGroup title="Category">
          <ul className="space-y-2.5">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <label className="flex cursor-pointer items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={state.categories.includes(c.slug)}
                    onChange={() => onToggle("category", c.slug)}
                    className="h-4 w-4 cursor-pointer accent-ink"
                  />
                  <span className="flex-1">{c.name}</span>
                  <span className="text-xs text-stone">{counts.category(c.slug)}</span>
                </label>
              </li>
            ))}
          </ul>
        </FilterGroup>
      )}

      <FilterGroup title="Size">
        <div className="grid grid-cols-5 gap-1.5">
          {SIZES.map((size) => {
            const active = state.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                aria-pressed={active}
                onClick={() => onToggle("size", size)}
                className={cn("h-10 border text-xs transition-colors", active ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink")}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Colour">
        <div className="grid grid-cols-2 gap-x-2 gap-y-3">
          {COLORS.map((c) => {
            const value = c.name.toLowerCase();
            const active = state.colors.includes(value);
            return (
              <button
                key={c.name}
                type="button"
                aria-pressed={active}
                onClick={() => onToggle("color", value)}
                className="group flex items-center gap-2.5 text-left text-sm"
              >
                <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors", active ? "border-ink" : "border-transparent group-hover:border-taupe")}>
                  <span className="h-4 w-4 rounded-full ring-1 ring-inset ring-black/10" style={{ backgroundColor: c.hex }} />
                </span>
                <span className={active ? "underline underline-offset-4" : undefined}>{c.name}</span>
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Price">
        <ul className="space-y-2.5">
          {PRICE_RANGES.map((r) => (
            <li key={r.value}>
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input type="checkbox" checked={state.prices.includes(r.value)} onChange={() => onToggle("price", r.value)} className="h-4 w-4 cursor-pointer accent-ink" />
                {r.label}
              </label>
            </li>
          ))}
        </ul>
      </FilterGroup>
    </div>
  );
}
