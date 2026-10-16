import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { Reviews } from "@/components/product/Reviews";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PRODUCTS, getCategory, getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { getReviewsForProduct } from "@/lib/data/reviews";
import { getMedia } from "@/lib/media";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const image = getMedia(product.images[0]);
  return {
    title: `${product.name} — ${getCategory(product.category)?.name}`,
    description: `${product.shortDescription} ${product.fabric} Free shipping on orders over $100.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | ELORA`,
      description: product.shortDescription,
      images: image.src ? [{ url: `${image.src}?w=1200&q=80&auto=format&fit=crop`, alt: image.alt }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategory(product.category)!;
  const related = getRelatedProducts(product, 4);
  const reviews = getReviewsForProduct(product.id);
  const gallery = [...product.images, "about-detail"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description,
    image: product.images.map((k) => getMedia(k).src).filter(Boolean),
    brand: { "@type": "Brand", name: "ELORA" },
    category: category.name,
    color: product.colors.map((c) => c.name).join(", "),
    material: product.fabric,
    aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount },
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/products/${product.slug}`,
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <div className="container-site pt-6 md:pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: category.name, href: `/shop/${category.slug}` },
            { label: product.name },
          ]}
        />
      </div>

      <div className="container-site mt-6 grid grid-cols-1 gap-10 md:mt-8 lg:grid-cols-12 lg:gap-14 [&>*]:min-w-0">
        <div className="-mx-5 sm:mx-0 lg:col-span-7">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <ProductGallery images={gallery} name={product.name} />
          </div>
        </div>
        <div className="lg:col-span-5 xl:col-span-4 xl:col-start-9">
          <ProductInfo product={product} />
        </div>
      </div>

      <div className="container-site mt-20">
        <Reviews product={product} reviews={reviews} />
      </div>

      <section aria-labelledby="related-title" className="container-site border-t border-line pb-24 pt-20 md:pt-24">
        <SectionHeading eyebrow="Wear it with" title={<span id="related-title">Complete the look</span>} link={{ label: "Shop all", href: "/shop" }} />
        <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-4">
          {related.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
