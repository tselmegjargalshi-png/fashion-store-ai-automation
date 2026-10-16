import Link from "next/link";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "All", href: "/shop" },
  { label: "New Arrivals", href: "/shop/new-arrivals" },
  { label: "Dresses", href: "/shop/dresses" },
  { label: "Tops", href: "/shop/tops" },
  { label: "Bottoms", href: "/shop/bottoms" },
  { label: "Outerwear", href: "/shop/outerwear" },
];

export function ShopHeader({ title, eyebrow, description, active, crumbs }: { title: string; eyebrow: string; description: string; active: string; crumbs: Crumb[] }) {
  return (
    <header className="container-site pb-8 pt-8 md:pt-12">
      <Breadcrumbs items={crumbs} />
      <div className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-4 text-stone">{eyebrow}</p>
          <h1 className="text-[3.25rem] leading-[0.95] tracking-[-0.01em] sm:text-7xl lg:text-[5.5rem]">{title}</h1>
        </div>
        <p className="max-w-md text-stone lg:col-span-4 lg:col-start-9 lg:pb-3">{description}</p>
      </div>
      <nav aria-label="Categories" className="scrollbar-none -mx-5 mt-10 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <ul className="flex gap-2">
          {TABS.map((tab) => (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active === tab.href ? "page" : undefined}
                className={cn(
                  "block whitespace-nowrap border px-4 py-2 text-xs uppercase tracking-[0.14em] transition-colors",
                  active === tab.href ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink",
                )}
              >
                {tab.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
