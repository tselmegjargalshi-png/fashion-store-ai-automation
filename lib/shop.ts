import { PRODUCTS } from "@/lib/data/products";
import type { CategorySlug, Product, Size } from "@/lib/types";

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "best-selling", label: "Best Selling" },
] as const;
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const PRICE_RANGES = [
  { value: "under-75", label: "Under $75", min: 0, max: 74.99 },
  { value: "75-100", label: "$75 – $100", min: 75, max: 100 },
  { value: "100-150", label: "$100 – $150", min: 100.01, max: 150 },
  { value: "150-plus", label: "$150 +", min: 150.01, max: Infinity },
] as const;

export type ShopScope = CategorySlug | "new-arrivals" | "all";

export function scopeProducts(scope: ShopScope) {
  if (scope === "all") return PRODUCTS;
  if (scope === "new-arrivals") return PRODUCTS.filter((p) => p.isNew);
  return PRODUCTS.filter((p) => p.category === scope);
}

export function filterAndSort(products: Product[], opts: { categories: string[]; sizes: string[]; colors: string[]; prices: string[]; sort: SortValue }) {
  let result = products.filter((p) => {
    if (opts.categories.length && !opts.categories.includes(p.category)) return false;
    if (opts.sizes.length && !opts.sizes.some((s) => p.sizes.includes(s as Size))) return false;
    if (opts.colors.length && !p.colors.some((c) => opts.colors.includes(c.name.toLowerCase()))) return false;
    if (opts.prices.length) {
      const ok = PRICE_RANGES.filter((r) => opts.prices.includes(r.value)).some((r) => p.price >= r.min && p.price <= r.max);
      if (!ok) return false;
    }
    return true;
  });

  switch (opts.sort) {
    case "newest":
      result = [...result].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "price-asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "best-selling":
      result = [...result].sort((a, b) => b.popularity - a.popularity);
      break;
    default:
      // Featured: new + bestsellers first, then by popularity.
      result = [...result].sort((a, b) => Number(b.isNew) + Number(b.isBestseller) - (Number(a.isNew) + Number(a.isBestseller)) || b.popularity - a.popularity);
  }
  return result;
}

