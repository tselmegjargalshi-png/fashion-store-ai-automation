import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Img } from "@/components/ui/Img";
import type { Category } from "@/lib/types";

export function CategoryCard({ category, index }: { category: Category; index: number }) {
  return (
    <Link href={`/shop/${category.slug}`} className="group relative block aspect-[3/4] overflow-hidden bg-cream text-ivory md:aspect-[2/3]">
      <Img
        media={category.image}
        sizes="(min-width:768px) 25vw, 50vw"
        plainFallback
        className="transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-90" aria-hidden="true" />
      <span className="absolute left-4 top-4 font-serif text-lg italic text-ivory/85 md:left-5 md:top-5">{String(index + 1).padStart(2, "0")}</span>
      <div className="absolute inset-x-4 bottom-4 md:inset-x-6 md:bottom-6">
        <h3 className="font-serif text-[1.75rem] uppercase tracking-[0.06em] sm:text-3xl md:text-[2.4rem]">{category.name}</h3>
        <span className="mt-2 inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-ivory/90">
          Explore<span className="hidden sm:inline"> {category.name.toLowerCase()}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
        </span>
      </div>
    </Link>
  );
}
