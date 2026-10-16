"use client";

import { useState } from "react";
import { SIZE_CHART, cmToIn, recommendSize } from "@/lib/data/size-guide";
import { cn } from "@/lib/utils";

type Unit = "cm" | "in";

/** Size table with unit toggle, measuring tips and a quick size finder. */
export function SizeGuide({ compact = false }: { compact?: boolean }) {
  const [unit, setUnit] = useState<Unit>("cm");
  const [measures, setMeasures] = useState({ bust: "", waist: "", hips: "" });
  const fmt = ([a, b]: [number, number]) => (unit === "cm" ? `${a}–${b}` : `${cmToIn(a)}–${cmToIn(b)}`);

  const toCm = (v: string) => {
    const n = parseFloat(v);
    if (!n) return undefined;
    return unit === "in" ? n * 2.54 : n;
  };
  const recommendation = recommendSize({ bust: toCm(measures.bust), waist: toCm(measures.waist), hips: toCm(measures.hips) });

  return (
    <div className="space-y-10">
      <div>
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm text-stone">Body measurements in {unit === "cm" ? "centimetres" : "inches"}.</p>
          <div className="inline-flex border border-line p-0.5" role="group" aria-label="Units">
            {(["cm", "in"] as Unit[]).map((u) => (
              <button
                key={u}
                type="button"
                aria-pressed={unit === u}
                onClick={() => setUnit(u)}
                className={cn("px-3 py-1 text-xs uppercase tracking-[0.14em] transition-colors", unit === u ? "bg-ink text-ivory" : "hover:bg-cream")}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-left text-sm">
            <caption className="sr-only">ELORA size chart, measurements in {unit}</caption>
            <thead>
              <tr className="border-b border-ink text-xs uppercase tracking-[0.14em]">
                <th scope="col" className="py-3 pr-4 font-medium">Size</th>
                <th scope="col" className="py-3 pr-4 font-medium">US</th>
                <th scope="col" className="py-3 pr-4 font-medium">Bust</th>
                <th scope="col" className="py-3 pr-4 font-medium">Waist</th>
                <th scope="col" className="py-3 font-medium">Hips</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((row) => (
                <tr key={row.size} className={cn("border-b border-line tabular-nums transition-colors", recommendation === row.size && "bg-cream")}>
                  <th scope="row" className="py-3.5 pr-4 font-medium">
                    {row.size}
                    {recommendation === row.size && <span className="ml-2 text-[0.6rem] uppercase tracking-[0.14em] text-olive">Your size</span>}
                  </th>
                  <td className="py-3.5 pr-4 text-stone">{row.us}</td>
                  <td className="py-3.5 pr-4">{fmt(row.bust)}</td>
                  <td className="py-3.5 pr-4">{fmt(row.waist)}</td>
                  <td className="py-3.5">{fmt(row.hips)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-cream p-6">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em]">Find your size</p>
        <div className="grid grid-cols-3 gap-3">
          {(["bust", "waist", "hips"] as const).map((key) => (
            <div key={key}>
              <label htmlFor={`sg-${key}-${compact ? "c" : "p"}`} className="field-label capitalize">
                {key} ({unit})
              </label>
              <input
                id={`sg-${key}-${compact ? "c" : "p"}`}
                inputMode="decimal"
                value={measures[key]}
                onChange={(e) => setMeasures((m) => ({ ...m, [key]: e.target.value.replace(/[^\d.]/g, "") }))}
                className="field bg-ivory py-2.5"
                placeholder={unit === "cm" ? "e.g. 88" : "e.g. 35"}
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm" aria-live="polite">
          {recommendation ? (
            <>
              We recommend <strong className="font-medium">size {recommendation}</strong>. Between sizes? Size up for tailoring, stay true for knits.
            </>
          ) : (
            <span className="text-stone">Enter one or more measurements for a recommendation.</span>
          )}
        </p>
      </div>

      {!compact && (
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            ["Bust", "Measure around the fullest part of your bust, keeping the tape parallel to the floor."],
            ["Waist", "Measure around the narrowest part of your natural waist, usually just above the navel."],
            ["Hips", "Stand with feet together and measure around the fullest part of your hips."],
          ].map(([title, text], i) => (
            <div key={title} className="border-t border-ink/80 pt-4">
              <p className="font-serif text-2xl italic text-olive">0{i + 1}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em]">{title}</p>
              <p className="mt-2 text-sm text-stone">{text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
