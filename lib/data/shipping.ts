import type { ShippingMethod, ShippingMethodId } from "@/lib/types";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/site";

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "3–5 business days",
    price: 8,
    freeOver: FREE_SHIPPING_THRESHOLD,
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "1–2 business days",
    price: 18,
  },
];

export function getShippingCost(methodId: ShippingMethodId, subtotal: number) {
  const method = SHIPPING_METHODS.find((m) => m.id === methodId) ?? SHIPPING_METHODS[0];
  if (subtotal === 0) return 0;
  if (method.freeOver !== undefined && subtotal >= method.freeOver) return 0;
  return method.price;
}

export const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "France",
  "Germany",
  "Netherlands",
  "Japan",
  "Singapore",
  "Mongolia",
];
