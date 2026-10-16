import type { Size } from "@/lib/types";

export interface SizeRow {
  size: Size;
  us: string;
  bust: [number, number];
  waist: [number, number];
  hips: [number, number];
}

/** Body measurements in centimetres. */
export const SIZE_CHART: SizeRow[] = [
  { size: "XS", us: "0–2", bust: [80, 84], waist: [62, 66], hips: [88, 92] },
  { size: "S", us: "4–6", bust: [84, 88], waist: [66, 70], hips: [92, 96] },
  { size: "M", us: "8–10", bust: [88, 93], waist: [70, 75], hips: [96, 101] },
  { size: "L", us: "12–14", bust: [93, 99], waist: [75, 81], hips: [101, 107] },
  { size: "XL", us: "16", bust: [99, 105], waist: [81, 87], hips: [107, 113] },
];

export const cmToIn = (cm: number) => Math.round((cm / 2.54) * 2) / 2;

export type Measure = "bust" | "waist" | "hips";

/**
 * Recommend a size from one or more body measurements (cm).
 * Picks the largest size suggested by any measurement, so the garment
 * is never tight at its narrowest point.
 */
export function recommendSize(measures: Partial<Record<Measure, number>>): Size | null {
  const order: Size[] = ["XS", "S", "M", "L", "XL"];
  let best = -1;
  (Object.keys(measures) as Measure[]).forEach((key) => {
    const value = measures[key];
    if (!value) return;
    let idx = SIZE_CHART.findIndex((row) => value <= row[key][1]);
    if (idx === -1) idx = order.length - 1;
    best = Math.max(best, idx);
  });
  return best >= 0 ? order[best] : null;
}
