import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LOOKBOOK } from "@/lib/data/lookbook";

export function LookbookTeaser() {
  const looks = LOOKBOOK.slice(0, 4);
  return (
    <section aria-labelledby="lookbook-teaser-title" className="overflow-hidden border-t border-line py-20 md:py-28">
      <div className="container-site">
        <SectionHeading
          eyebrow="Lookbook"
          title={
            <span id="lookbook-teaser-title">
              The ELORA <em>Edit</em>
            </span>
          }
          description="Everyday moments, modern silhouettes."
          link={{ label: "View the lookbook", href: "/lookbook" }}
        />
      </div>
      <ul className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 sm:px-8 md:gap-6 lg:px-12" aria-label="Featured looks">
        {looks.map((look) => (
          <li key={look.id} className="w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-[28vw]">
            <Link href={`/lookbook#${look.id}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-cream">
                <Img media={look.image} sizes="(min-width:1024px) 28vw, 72vw" fallbackLabel={look.title} className="transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.03]" />
              </div>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-serif text-lg italic text-olive">{look.number}</span>
                <span className="text-xs font-medium uppercase tracking-[0.18em]">{look.title}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
