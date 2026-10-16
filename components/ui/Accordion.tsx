"use client";

import { Minus, Plus } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface AccordionItemData {
  id?: string;
  title: ReactNode;
  content: ReactNode;
}

export function Accordion({ items, defaultOpen, className, size = "md" }: { items: AccordionItemData[]; defaultOpen?: number; className?: string; size?: "md" | "lg" }) {
  const [open, setOpen] = useState<number | null>(defaultOpen ?? null);
  const baseId = useId();

  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-b-${i}`;
        const panelId = `${baseId}-p-${i}`;
        return (
          <div key={i} id={item.id}>
            <h3 className="font-sans">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className={cn(
                  "flex w-full items-center justify-between gap-6 text-left transition-colors hover:text-olive",
                  size === "lg" ? "py-6 text-[1.05rem]" : "py-4 text-xs font-medium uppercase tracking-[0.16em]",
                )}
              >
                <span>{item.title}</span>
                {isOpen ? <Minus className="h-4 w-4 shrink-0" strokeWidth={1.25} /> : <Plus className="h-4 w-4 shrink-0" strokeWidth={1.25} />}
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={cn("grid transition-[grid-template-rows] duration-300 ease-editorial", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <div className={cn("text-stone", size === "lg" ? "max-w-2xl pb-7 text-[15px] leading-7" : "pb-5 text-sm leading-6")}>{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
