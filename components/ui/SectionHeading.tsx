import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
  align = "left",
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  link?: { label: string; href: string };
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-6 md:mb-14",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="eyebrow mb-4 text-stone">{eyebrow}</p>}
        <Tag className="text-[2.6rem] leading-[1] tracking-[-0.01em] sm:text-5xl lg:text-[3.75rem]">{title}</Tag>
        {description && <p className="mt-4 max-w-md text-stone">{description}</p>}
      </div>
      {link && (
        <Link href={link.href} className="group inline-flex shrink-0 items-center gap-3 text-xs font-medium uppercase tracking-[0.18em]">
          <span className="link-underline">{link.label}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.25} />
        </Link>
      )}
    </div>
  );
}
