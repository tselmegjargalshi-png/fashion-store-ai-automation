import type { Metadata } from "next";
import { Philosophy } from "@/components/brand/Philosophy";
import { ButtonLink } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";

export const metadata: Metadata = {
  title: "Our Story",
  description: "ELORA designs modern essentials and feminine silhouettes made to be worn, loved and lived in. Meet the brand and our founder.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      {/* Split hero */}
      <section className="grid lg:min-h-[calc(100svh-var(--header-h)-2.25rem)] lg:grid-cols-2">
        <div className="order-2 flex items-center bg-cream px-5 py-16 sm:px-8 lg:order-1 lg:px-16 xl:px-24">
          <div className="max-w-xl">
            <p className="eyebrow mb-6 text-stone">Our story</p>
            <h1 className="text-[3.2rem] uppercase leading-[0.92] tracking-[0.01em] sm:text-7xl xl:text-[5.5rem]">
              Designed for the way <em className="normal-case">you live</em>
            </h1>
            <p className="mt-8 max-w-md text-lg leading-8 text-stone">
              Everyday clothing should feel effortless, considered, and entirely your own.
            </p>
          </div>
        </div>
        <div className="relative order-1 min-h-[70svh] bg-sand lg:order-2 lg:min-h-0">
          <Img media="about-hero" priority sizes="(min-width:1024px) 50vw, 100vw" fallbackLabel="Our story" />
        </div>
      </section>

      {/* Story */}
      <section aria-labelledby="who-title" className="container-site py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="who-title" className="text-4xl sm:text-5xl">
            Who we are, <em>and what we stand for</em>
          </h2>
          <div className="mt-10 space-y-6 text-lg leading-8 text-stone">
            <p>ELORA was created around a simple idea: everyday clothing should feel effortless, considered, and entirely your own.</p>
            <p>We design modern essentials and feminine silhouettes that are made to be worn, loved, and lived in.</p>
            <p>Our collections focus on thoughtful details, timeless shapes, and versatile pieces that become part of your everyday wardrobe.</p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section aria-labelledby="philosophy-title" className="bg-ink py-24 text-ivory md:py-32">
        <div className="container-site">
          <div className="mb-16 grid gap-6 md:grid-cols-2 md:items-end">
            <h2 id="philosophy-title" className="text-5xl uppercase sm:text-6xl">
              Our <em className="normal-case">philosophy</em>
            </h2>
            <p className="max-w-md text-ivory/70 md:justify-self-end">
              Three principles shape every decision — from the first sketch to the final stitch.
            </p>
          </div>
          <div className="[&_.text-stone]:text-ivory/70 [&_.text-olive]:text-olive-light [&_li]:border-ivory/40">
            <Philosophy layout="row" />
          </div>
        </div>
      </section>

      {/* Founder */}
      <section aria-labelledby="founder-title" className="container-site py-24 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden bg-sand lg:col-span-6">
            <Img media="founder-portrait" sizes="(min-width:1024px) 45vw, 100vw" fallbackLabel="Mia Laurent" />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="eyebrow text-stone">Founder &amp; Creative Director</p>
            <h2 id="founder-title" className="mt-4 text-5xl sm:text-6xl">
              Mia Laurent
            </h2>
            <p className="mt-8 text-lg leading-8 text-stone">
              ELORA began with a belief that personal style does not need to be complicated. Mia Laurent founded ELORA to create clothing that feels modern,
              feminine, and effortless.
            </p>
            <blockquote className="mt-10 border-l border-olive pl-6 font-serif text-2xl italic leading-snug sm:text-3xl">
              “I wanted a wardrobe I didn&apos;t have to think about — pieces that simply work, every day, for years.”
            </blockquote>
            <p className="mt-10 text-xs text-taupe-dark">Mia Laurent is a fictional founder created for this portfolio demonstration.</p>
          </div>
        </div>
      </section>

      {/* Craft numbers */}
      <section aria-label="How we make" className="border-y border-line">
        <dl className="container-site grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {[
            ["3", "Family-run partner ateliers in Portugal, Lithuania and Turkey"],
            ["86%", "Of our fabrics are natural, organic or recycled fibres"],
            ["30", "Days to return or exchange, free of charge"],
          ].map(([value, label]) => (
            <div key={label} className="px-2 py-12 md:px-10 md:first:pl-0">
              <dt className="sr-only">{label}</dt>
              <dd>
                <span className="block font-serif text-6xl">{value}</span>
                <span className="mt-3 block max-w-xs text-sm text-stone">{label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-site py-24 text-center md:py-32">
        <h2 className="mx-auto max-w-2xl text-5xl sm:text-6xl">
          Made to be worn, <em>loved and lived in</em>
        </h2>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/shop/new-arrivals" size="lg">
            Shop new arrivals
          </ButtonLink>
          <ButtonLink href="/lookbook" variant="outline" size="lg">
            View the lookbook
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
