"use client";

import { BadgeCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Stars } from "@/components/ui/Stars";
import type { Product, Review } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ReviewForm } from "./ReviewForm";

/** Approximates a star distribution from the average for the summary bars. */
function distribution(rating: number, count: number) {
  const five = Math.round(count * Math.min(0.92, Math.max(0.4, (rating - 3.6) / 1.4)));
  const four = Math.round((count - five) * 0.7);
  const three = Math.round((count - five - four) * 0.6);
  const two = Math.round((count - five - four - three) * 0.6);
  return [five, four, three, two, Math.max(0, count - five - four - three - two)];
}

export function Reviews({ product, reviews }: { product: Product; reviews: Review[] }) {
  const [open, setOpen] = useState(false);
  const dist = distribution(product.rating, product.reviewCount);

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="scroll-mt-28 border-t border-line py-20 md:py-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-4 text-stone">Reviews</p>
          <h2 id="reviews-title" className="text-5xl">
            {product.rating.toFixed(1)} <span className="text-2xl text-stone">/ 5</span>
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <Stars rating={product.rating} size="h-4 w-4" />
            <span className="text-sm text-stone">Based on {product.reviewCount} reviews</span>
          </div>
          <ul className="mt-8 space-y-2" aria-label="Rating distribution">
            {dist.map((n, i) => (
              <li key={i} className="flex items-center gap-3 text-xs">
                <span className="w-10 tabular-nums">{5 - i} star</span>
                <span className="h-[3px] flex-1 bg-sand">
                  <span className="block h-full bg-ink" style={{ width: `${(n / product.reviewCount) * 100}%` }} />
                </span>
                <span className="w-8 text-right tabular-nums text-stone">{n}</span>
              </li>
            ))}
          </ul>
          <Button variant="outline" className="mt-10" onClick={() => setOpen(true)}>
            Write a review
          </Button>
        </div>

        <ul className="divide-y divide-line lg:col-span-7 lg:col-start-6">
          {reviews.map((r) => (
            <li key={r.id} className="py-8 first:pt-0">
              <div className="flex items-start justify-between gap-4">
                <Stars rating={r.rating} />
                <time className="text-xs text-stone" dateTime={r.createdAt}>
                  {formatDate(r.createdAt)}
                </time>
              </div>
              <h3 className="mt-4 font-sans text-base font-medium">{r.title}</h3>
              <p className="mt-2 leading-7 text-stone">{r.body}</p>
              <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone">
                <span className="text-ink">{r.author}</span>
                {r.location && <span>{r.location}</span>}
                {r.verified && (
                  <span className="flex items-center gap-1 text-olive">
                    <BadgeCheck className="h-3.5 w-3.5" strokeWidth={1.5} /> Verified buyer
                  </span>
                )}
                {r.sizePurchased && <span>Size bought: {r.sizePurchased}</span>}
                {r.fit && <span>Fit: {r.fit}</span>}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={`Review the ${product.name.replace(/^The /, "")}`}>
        <ReviewForm productId={product.id} productName={product.name} onDone={() => setOpen(false)} />
      </Modal>
    </section>
  );
}
