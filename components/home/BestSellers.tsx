import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import { BEST_SELLER_SLUGS, getProductsBySlugs } from "@/lib/data/products";

/** Editorial split: a feature image beside a 2×2 grid — distinct from the New Arrivals grid. */
export function BestSellers() {
  const products = getProductsBySlugs(BEST_SELLER_SLUGS);
  return (
    <section aria-labelledby="most-loved-title" className="bg-cream py-20 md:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <p className="eyebrow mb-4 text-stone">Customer favourites</p>
            <h2 id="most-loved-title" className="text-[2.6rem] uppercase leading-[0.95] tracking-[0.02em] sm:text-6xl lg:text-[4.5rem]">
              Most
              <br />
              <em className="normal-case tracking-normal">Loved</em>
            </h2>
            <p className="mt-5 max-w-sm text-stone">Pieces our customers keep coming back to.</p>
            <div className="relative mt-10 hidden aspect-[4/5] overflow-hidden lg:block">
              <Img media="look-coast" sizes="40vw" fallbackLabel="Most loved" />
            </div>
            <ButtonLink href="/shop?sort=best-selling" variant="outline" className="mt-8">
              Shop best sellers
            </ButtonLink>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:col-span-7 lg:gap-y-16">
          {products.map((product, i) => (
            <li key={product.id} className={i % 2 === 1 ? "sm:mt-16" : undefined}>
              <ProductCard product={product} badgeOverride="Bestseller" aspect="aspect-[4/5]" sizes="(min-width:1024px) 28vw, 46vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
