import { cn, formatPrice } from "@/lib/utils";

export function Price({ price, compareAt, className }: { price: number; compareAt?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-2 tabular-nums", className)}>
      {compareAt ? (
        <>
          <span className="sr-only">Sale price</span>
          <span className="text-olive">{formatPrice(price)}</span>
          <span className="sr-only">Original price</span>
          <s className="text-[0.85em] text-taupe-dark">{formatPrice(compareAt)}</s>
        </>
      ) : (
        <span>{formatPrice(price)}</span>
      )}
    </span>
  );
}
