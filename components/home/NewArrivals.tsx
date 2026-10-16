import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getProductsBySlugs, NEW_ARRIVAL_SLUGS } from "@/lib/data/products";

export function NewArrivals() {
  const products = getProductsBySlugs(NEW_ARRIVAL_SLUGS);
  return (
    <section aria-labelledby="new-arrivals-title" className="container-site pb-24 md:pb-32">
      <SectionHeading
        eyebrow="Just in"
        title={<span id="new-arrivals-title">New arrivals</span>}
        description="Eight new pieces for the season ahead — light layers, fluid shapes and quiet colour."
        link={{ label: "View all new", href: "/shop/new-arrivals" }}
      />
      <ProductGrid products={products} />
    </section>
  );
}
