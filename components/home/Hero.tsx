import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative -mt-[var(--header-h)] flex min-h-[92svh] items-end overflow-hidden bg-taupe text-ivory md:min-h-[100svh]">
      <Img media="hero-campaign" priority sizes="100vw" plainFallback className="object-[50%_30%]" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/15 to-ink/25" aria-hidden="true" />

      <div className="container-site relative pb-12 pt-40 md:pb-16 lg:pb-20">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-6 animate-fade-up text-ivory/85">Spring / Summer 2026</p>
            <h1 id="hero-title" className="animate-fade-up text-display-xl [animation-delay:80ms]">
              Effortlessly
              <br />
              <em className="pl-[0.6em] font-normal">yours</em>
            </h1>
            <p className="mt-6 max-w-sm animate-fade-up text-base text-ivory/90 [animation-delay:160ms] md:text-lg">
              Modern pieces designed for everyday confidence.
            </p>
            <div className="mt-9 flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row">
              <ButtonLink href="/shop/new-arrivals" variant="light" size="lg">
                Shop New Arrivals
              </ButtonLink>
              <ButtonLink href="/shop" variant="ghost" size="lg">
                Explore the Collection
              </ButtonLink>
            </div>
          </div>

          {/* Shoppable look callout */}
          <Link
            href="/products/the-livia-dress"
            className="group hidden items-center justify-between gap-6 border-t border-ivory/40 pt-4 lg:col-span-3 lg:col-start-10 lg:flex"
          >
            <span>
              <span className="eyebrow block text-ivory/70">Look 01 — Worn here</span>
              <span className="mt-1 block font-serif text-2xl">The Livia Dress · $89</span>
            </span>
            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.25} />
          </Link>
        </div>
      </div>
    </section>
  );
}
