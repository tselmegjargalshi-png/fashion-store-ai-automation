import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ShopFallback } from "@/components/shop/ShopFallback";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopView } from "@/components/shop/ShopView";
import type { ShopScope } from "@/lib/shop";
import { CATEGORIES } from "@/lib/data/products";

const NEW_ARRIVALS = {
  name: "New Arrivals",
  eyebrow: "Just in",
  description: "The latest pieces from our Spring / Summer 2026 collection — light layers, fluid shapes and quiet colour.",
  seoDescription: "Shop new arrivals at ELORA: the latest modern women's clothing, from midi dresses to linen shirts and soft tailoring.",
};

function resolve(slug: string) {
  if (slug === "new-arrivals") return { scope: "new-arrivals" as ShopScope, ...NEW_ARRIVALS };
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) return null;
  return {
    scope: category.slug as ShopScope,
    name: category.name,
    eyebrow: "Shop",
    description: category.description,
    seoDescription: `Shop women's ${category.name.toLowerCase()} at ELORA. ${category.description}`,
  };
}

export function generateStaticParams() {
  return [{ category: "new-arrivals" }, ...CATEGORIES.map((c) => ({ category: c.slug }))];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const data = resolve(category);
  if (!data) return {};
  return {
    title: category === "new-arrivals" ? "New Arrivals" : `Women's ${data.name}`,
    description: data.seoDescription,
    alternates: { canonical: `/shop/${category}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const data = resolve(category);
  if (!data) notFound();

  return (
    <>
      <ShopHeader
        eyebrow={data.eyebrow}
        title={data.name}
        description={data.description}
        active={`/shop/${category}`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: data.name }]}
      />
      <Suspense fallback={<ShopFallback scope={data.scope} />}>
        <ShopView scope={data.scope} />
      </Suspense>
    </>
  );
}
