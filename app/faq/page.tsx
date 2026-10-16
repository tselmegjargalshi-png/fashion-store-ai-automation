import type { Metadata } from "next";
import Link from "next/link";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { ButtonLink } from "@/components/ui/Button";
import { FAQ } from "@/lib/data/faq";

export const metadata: Metadata = {
  title: "FAQ — Orders, Shipping & Returns",
  description: "Answers to common questions about ELORA orders, shipping times, international delivery, returns, sizing and payment methods.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.flatMap((c) =>
      c.items.map((i) => ({ "@type": "Question", name: i.question, acceptedAnswer: { "@type": "Answer", text: i.answer } })),
    ),
  };

  return (
    <div className="container-site py-14 md:py-20">
      <header className="max-w-3xl">
        <p className="eyebrow text-stone">Help centre</p>
        <h1 className="mt-5 text-display">
          Questions, <em>answered</em>
        </h1>
        <p className="mt-6 max-w-lg text-lg text-stone">Everything you need to know about ordering, delivery, returns and finding your fit.</p>
      </header>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20 [&>*]:min-w-0">
        <nav aria-label="FAQ categories" className="lg:col-span-3">
          <ul className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:mx-0 lg:flex-col lg:gap-0 lg:px-0">
            {FAQ.map((c) => (
              <li key={c.id}>
                <Link
                  href={`#${c.id}`}
                  className="block whitespace-nowrap border border-line px-4 py-2 text-xs uppercase tracking-[0.14em] transition-colors hover:border-ink lg:border-0 lg:border-l lg:px-5 lg:py-3 lg:hover:border-ink"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-20 lg:col-span-8 lg:col-start-5">
          {FAQ.map((c) => (
            <FAQAccordion key={c.id} category={c} />
          ))}
          <div className="bg-cream p-8 sm:p-10">
            <h2 className="text-3xl">Still need help?</h2>
            <p className="mt-3 text-stone">Our care team replies within one business day — or ask our assistant for instant answers.</p>
            <ButtonLink href="/contact" className="mt-6">
              Contact us
            </ButtonLink>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
