/**
 * Fictional orders used by the AI support assistant to demonstrate
 * order-status lookups. In production this would query the commerce backend.
 */
export interface DemoOrderStatus {
  number: string;
  status: "processing" | "shipped" | "delivered";
  placedAt: string;
  items: string[];
  carrier?: string;
  tracking?: string;
  eta?: string;
  deliveredAt?: string;
}

export const DEMO_ORDERS: DemoOrderStatus[] = [
  {
    number: "EL-10421",
    status: "shipped",
    placedAt: "2026-10-12",
    items: ["The Livia Dress — Ivory, S", "Clara Ribbed Top — Black, S"],
    carrier: "UPS",
    tracking: "1Z 999 AA1 01 2345 6784",
    eta: "Friday, October 17",
  },
  {
    number: "EL-10388",
    status: "delivered",
    placedAt: "2026-10-03",
    items: ["Isla Everyday Blazer — Sand, M"],
    carrier: "DHL Express",
    deliveredAt: "October 7",
  },
  {
    number: "EL-10455",
    status: "processing",
    placedAt: "2026-10-15",
    items: ["Margaux Wool Coat — Camel, S"],
  },
];

export function findDemoOrder(number: string) {
  const normalized = number.toUpperCase().replace(/\s+/g, "");
  return DEMO_ORDERS.find((o) => o.number === normalized);
}
