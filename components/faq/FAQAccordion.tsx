import { Accordion } from "@/components/ui/Accordion";
import type { FaqCategory } from "@/lib/types";

export function FAQAccordion({ category }: { category: FaqCategory }) {
  return (
    <section id={category.id} aria-labelledby={`${category.id}-title`} className="scroll-mt-32">
      <h2 id={`${category.id}-title`} className="mb-4 text-4xl">
        {category.title}
      </h2>
      <Accordion size="lg" items={category.items.map((item) => ({ title: item.question, content: <p>{item.answer}</p> }))} />
    </section>
  );
}
