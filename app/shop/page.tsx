import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopFallback } from "@/components/shop/ShopFallback";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopView } from "@/components/shop/ShopView";

export const metadata: Metadata = {
  title: "Shop All Women's Clothing",
  description: "Shop the full ELORA collection — dresses, tops, bottoms and outerwear designed for effortless everyday elegance.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <>
      <ShopHeader
        eyebrow="Spring / Summer 2026"
        title="Shop all"
        description="The complete ELORA wardrobe — modern essentials and feminine silhouettes, designed to be worn together."
        active="/shop"
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
      />
      <Suspense fallback={<ShopFallback scope={"all"} />}>
        <ShopView scope="all" />
      </Suspense>
    </>
  );
}
