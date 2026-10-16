import { cn } from "@/lib/utils";

export const PHILOSOPHY = [
  { n: "01", title: "Less, but better", text: "Thoughtful pieces designed to work beyond a single season." },
  { n: "02", title: "Effortless style", text: "Clothing that feels natural, comfortable, and confident." },
  { n: "03", title: "Made to last", text: "Timeless designs created with everyday wear in mind." },
];

export function Philosophy({ layout = "stack", className }: { layout?: "stack" | "row"; className?: string }) {
  return (
    <ol className={cn(layout === "row" ? "grid gap-12 md:grid-cols-3 md:gap-10" : "divide-y divide-line border-y border-line", className)}>
      {PHILOSOPHY.map((item) => (
        <li key={item.n} className={cn(layout === "row" ? "border-t border-ink/80 pt-6" : "grid grid-cols-[3.5rem_1fr] gap-4 py-6")}>
          <span className={cn("font-serif italic text-olive", layout === "row" ? "text-5xl" : "text-3xl leading-none")}>{item.n}</span>
          <div className={layout === "row" ? "mt-6" : undefined}>
            <h3 className="font-sans text-xs font-medium uppercase tracking-[0.18em]">{item.title}</h3>
            <p className="mt-2 text-stone">{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
