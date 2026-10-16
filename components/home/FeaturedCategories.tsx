import { SectionHeading } from "@/components/ui/SectionHeading";
import { CATEGORIES } from "@/lib/data/products";
import { CategoryCard } from "./CategoryCard";

export function FeaturedCategories() {
  return (
    <section aria-labelledby="categories-title" className="container-site py-20 md:py-28">
      <SectionHeading
        eyebrow="The Collection"
        title={
          <span id="categories-title">
            Dressed for <em>every</em> day
          </span>
        }
        description="Four edits, one wardrobe. Every piece is designed to work with the rest."
        link={{ label: "Shop all", href: "/shop" }}
      />
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {CATEGORIES.map((category, i) => (
          <li key={category.slug} className={i % 2 === 1 ? "md:mt-12" : undefined}>
            <CategoryCard category={category} index={i} />
          </li>
        ))}
      </ul>
    </section>
  );
}
