import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products, columns = 4, priorityCount = 0, className }: { products: Product[]; columns?: 3 | 4; priorityCount?: number; className?: string }) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 md:gap-y-14",
        columns === 4 ? "xl:grid-cols-4" : "",
        className,
      )}
    >
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard product={product} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
