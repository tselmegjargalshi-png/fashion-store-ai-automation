/**
 * ELORA domain model.
 *
 * These types describe the commerce entities the storefront works with.
 * They are intentionally backend-agnostic: the same shapes map cleanly to a
 * relational schema (see docs/DATA_MODEL.md), a headless commerce API, or the
 * JSON payloads sent to n8n webhooks (see lib/automation/events.ts).
 */

export type CategorySlug = "dresses" | "tops" | "bottoms" | "outerwear";
export type Size = "XS" | "S" | "M" | "L" | "XL";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string; // media key (lib/media.ts)
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: CategorySlug;
  price: number; // USD, whole dollars for the demo
  compareAtPrice?: number;
  colors: ColorOption[];
  sizes: Size[];
  /** Sizes that are currently low in stock, used for urgency messaging. */
  lowStock?: Size[];
  images: string[]; // media keys, first is primary, second is hover
  badge?: "New" | "Bestseller" | "Limited" | "Back in stock";
  isNew: boolean;
  isBestseller: boolean;
  rating: number;
  reviewCount: number;
  /** Relative sales rank — higher sells more. Used for "Best Selling" sort. */
  popularity: number;
  createdAt: string; // ISO date
  shortDescription: string;
  description: string;
  details: string[];
  fabric: string;
  care: string[];
  fit: string;
  modelNote: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  acceptsMarketing: boolean;
  createdAt: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface CartItem {
  /** Stable line id: productId + color + size. */
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  color: string;
  size: Size;
  unitPrice: number;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  email?: string;
  updatedAt: string;
}

export type ShippingMethodId = "standard" | "express";

export interface ShippingMethod {
  id: ShippingMethodId;
  name: string;
  description: string;
  price: number;
  /** Order subtotal at or above which this method is free. */
  freeOver?: number;
}

export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  color: string;
  size: Size;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  number: string; // human-facing, e.g. EL-10421
  customerEmail: string;
  shippingAddress: Address;
  items: OrderItem[];
  shippingMethod: ShippingMethodId;
  subtotal: number;
  shipping: number;
  total: number;
  currency: "USD";
  status: OrderStatus;
  createdAt: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  location?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  sizePurchased?: Size;
  fit?: "Runs small" | "True to size" | "Runs large";
  verified: boolean;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  source: "footer" | "popup" | "checkout";
  subscribedAt: string;
}

export type InquiryTopic = "order" | "sizing" | "returns" | "product" | "wholesale" | "press" | "other";

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  topic?: InquiryTopic;
  orderNumber?: string;
  createdAt: string;
}

export interface LookbookLook {
  id: string;
  number: string;
  title: string;
  caption: string;
  image: string;
  productSlugs: string[];
  layout: "tall" | "wide" | "square";
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}
