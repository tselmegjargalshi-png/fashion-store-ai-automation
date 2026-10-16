import type { MetadataRoute } from "next";
import { CATEGORIES, PRODUCTS } from "@/lib/data/products";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/shop", "/shop/new-arrivals", "/lookbook", "/about", "/contact", "/faq", "/size-guide", "/case-study"];
  return [
    ...staticRoutes.map((path) => ({ url: `${SITE.url}${path}`, lastModified: now, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })),
    ...CATEGORIES.map((c) => ({ url: `${SITE.url}/shop/${c.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...PRODUCTS.map((p) => ({ url: `${SITE.url}/products/${p.slug}`, lastModified: new Date(p.createdAt), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
