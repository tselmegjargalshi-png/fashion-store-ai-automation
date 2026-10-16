"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  label = "Quantity",
  size = "md",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  size?: "sm" | "md";
}) {
  const btn = cn("grid place-items-center transition-colors hover:bg-cream disabled:opacity-30", size === "sm" ? "h-8 w-8" : "h-12 w-11");
  return (
    <div className="inline-flex items-center border border-line" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
      <output aria-live="polite" className={cn("text-center tabular-nums", size === "sm" ? "w-7 text-sm" : "w-10")}>
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
