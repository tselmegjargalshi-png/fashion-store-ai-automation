import { ProductGrid } from "@/components/product/ProductGrid";
import { filterAndSort, scopeProducts, type ShopScope } from "@/lib/shop";

/**
 * Server-rendered product list shown before the interactive filters hydrate,
 * so every collection page ships its products in the initial HTML (SEO, no-JS).
 */
export function ShopFallback({ scope }: { scope: ShopScope }) {
  const products = filterAndSort(scopeProducts(scope), { categories: [], sizes: [], colors: [], prices: [], sort: "featured" });
  return (
    <div className="container-site pb-24">
      <div className="mb-8 flex h-[3.25rem] items-center border-y border-line text-sm text-stone lg:border-x-0">{products.length} pieces</div>
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="hidden lg:col-span-3 lg:block xl:col-span-2" />
        <div className="lg:col-span-9 xl:col-span-10">
          <ProductGrid products={products} columns={3} priorityCount={3} className="xl:grid-cols-3" />
        </div>
      </div>
    </div>
  );
}
