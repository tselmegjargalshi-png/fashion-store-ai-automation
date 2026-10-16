import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Img } from "@/components/ui/Img";
import { getProductsBySlugs } from "@/lib/data/products";
import { LOOKBOOK } from "@/lib/data/lookbook";
import { cn, formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Lookbook — The ELORA Edit",
  description: "The ELORA Edit: a collection of everyday moments, modern silhouettes, and effortless style. Shop every look.",
  alternates: { canonical: "/lookbook" },
};

export default function LookbookPage() {
  const pairs = [0, 2, 4].map((i) => LOOKBOOK.slice(i, i + 2));
  return (
    <>
      <header className="container-site pb-16 pt-14 md:pb-24 md:pt-24">
        <p className="eyebrow text-stone">Spring / Summer 2026 — Lookbook</p>
        <h1 className="mt-6 text-display-xl uppercase">
          The ELORA <em className="normal-case">Edit</em>
        </h1>
        <div className="mt-10 grid gap-6 md:grid-cols-12">
          <p className="max-w-md text-lg leading-8 text-stone md:col-span-5">A collection of everyday moments, modern silhouettes, and effortless style.</p>
          <p className="text-xs uppercase tracking-[0.18em] text-stone md:col-span-3 md:col-start-10 md:text-right">
            Six looks · Photographed on location
          </p>
        </div>
      </header>

      <section aria-label="Looks" className="container-site space-y-20 pb-24 md:space-y-32 md:pb-32">
        {pairs.map((pair, p) => (
          <div key={p} className={cn("grid gap-16 md:grid-cols-12 md:items-end md:gap-6", p % 2 === 1 && "md:[&>*:first-child]:order-2")}>
            {pair.map((look) => {
              const products = getProductsBySlugs(look.productSlugs);
              const tall = look.layout === "tall";
              return (
                <figure
                  key={look.id}
                  id={look.id}
                  className={cn("scroll-mt-28", tall ? "md:col-span-5" : "md:col-span-6", !tall && (p % 2 === 1 ? "md:col-start-1" : "md:col-start-7"))}
                >
                  <div className={cn("relative overflow-hidden bg-sand", tall ? "aspect-[3/4]" : "aspect-[4/5] md:aspect-[5/4]")}>
                    <Img media={look.image} sizes="(min-width:768px) 45vw, 100vw" plainFallback />
                    <span className="absolute left-5 top-4 font-serif text-5xl italic text-ivory drop-shadow-sm md:text-6xl">{look.number}</span>
                  </div>
                  <figcaption className="mt-6">
                    <h2 className="font-sans text-xs font-medium uppercase tracking-[0.2em]">{look.title}</h2>
                    <p className="mt-2 max-w-md font-serif text-2xl leading-snug">{look.caption}</p>
                  </figcaption>
                  <div className="mt-5 border-t border-line pt-4">
                    <p className="eyebrow mb-3 text-stone">Shop the look</p>
                    <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      {products.map((prod) => (
                        <li key={prod.id}>
                          <Link href={`/products/${prod.slug}`} className="group inline-flex items-center gap-2 hover:text-olive">
                            {prod.name} <span className="text-stone">{formatPrice(prod.price)}</span>
                            <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" strokeWidth={1.25} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </figure>
              );
            })}
          </div>
        ))}
      </section>
    </>
  );
}
