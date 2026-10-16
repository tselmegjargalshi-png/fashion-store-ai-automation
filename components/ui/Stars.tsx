import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({ rating, className, size = "h-3.5 w-3.5" }: { rating: number; className?: string; size?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn(size, i <= Math.round(rating) ? "fill-ink text-ink" : "fill-transparent text-taupe")} strokeWidth={1} />
      ))}
    </span>
  );
}
