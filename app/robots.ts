import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/cart", "/checkout", "/account", "/wishlist"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
