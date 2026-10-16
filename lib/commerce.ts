import { getProductById } from "@/lib/data/products";
import { getShippingCost } from "@/lib/data/shipping";
import type { Address, Order, OrderItem, ShippingMethodId, Size } from "@/lib/types";
import { createId } from "@/lib/utils";

export interface PricedLineInput {
  productId: string;
  color: string;
  size: Size;
  quantity: number;
}

/**
 * Builds an order from client-supplied line references.
 * Prices, availability and totals are always recomputed from the catalogue —
 * the client is never trusted for money values.
 */
export function buildOrder(params: {
  email: string;
  address: Address;
  shippingMethod: ShippingMethodId;
  lines: PricedLineInput[];
}): { order: Order } | { error: string } {
  const items: OrderItem[] = [];

  for (const line of params.lines) {
    const product = getProductById(line.productId);
    if (!product) return { error: `A product in your bag is no longer available.` };
    if (!product.colors.some((c) => c.name === line.color)) return { error: `${product.name} is not available in ${line.color}.` };
    if (!product.sizes.includes(line.size)) return { error: `${product.name} is not available in size ${line.size}.` };

    items.push({
      productId: product.id,
      sku: `${product.sku}-${line.color.slice(0, 3).toUpperCase()}-${line.size}`,
      name: product.name,
      color: line.color,
      size: line.size,
      quantity: line.quantity,
      unitPrice: product.price,
      lineTotal: product.price * line.quantity,
    });
  }

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const shipping = getShippingCost(params.shippingMethod, subtotal);

  const order: Order = {
    id: createId("ord"),
    number: `EL-${Math.floor(10000 + Math.random() * 89999)}`,
    customerEmail: params.email,
    shippingAddress: params.address,
    items,
    shippingMethod: params.shippingMethod,
    subtotal,
    shipping,
    total: subtotal + shipping,
    currency: "USD",
    status: "paid",
    createdAt: new Date().toISOString(),
  };

  return { order };
}
