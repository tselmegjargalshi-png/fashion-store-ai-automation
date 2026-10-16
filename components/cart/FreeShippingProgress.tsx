import { FREE_SHIPPING_THRESHOLD } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

export function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  return (
    <div>
      <p className="text-sm">
        {remaining > 0 ? (
          <>
            You&apos;re <strong className="font-medium">{formatPrice(remaining)}</strong> away from free shipping.
          </>
        ) : (
          <>You&apos;ve unlocked free standard shipping.</>
        )}
      </p>
      <div className="mt-3 h-[3px] w-full bg-sand" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label="Progress to free shipping">
        <div className="h-full bg-olive transition-[width] duration-500 ease-editorial" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
