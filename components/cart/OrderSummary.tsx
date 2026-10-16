import { formatPrice } from "@/lib/utils";

export function SummaryRows({ subtotal, shipping, shippingLabel }: { subtotal: number; shipping: number | null; shippingLabel?: string }) {
  const total = subtotal + (shipping ?? 0);
  return (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between">
        <dt className="text-stone">Subtotal</dt>
        <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-stone">Shipping{shippingLabel ? ` · ${shippingLabel}` : ""}</dt>
        <dd className="tabular-nums">{shipping === null ? "Calculated at checkout" : shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
      </div>
      <div className="flex justify-between border-t border-line pt-4 text-base">
        <dt className="font-medium">{shipping === null ? "Estimated total" : "Total"}</dt>
        <dd className="font-medium tabular-nums">
          <span className="mr-1.5 text-xs font-normal text-stone">USD</span>
          {formatPrice(total)}
        </dd>
      </div>
    </dl>
  );
}
