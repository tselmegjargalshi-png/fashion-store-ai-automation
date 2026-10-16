import type { Review } from "@/lib/types";

/** Seed reviews. Products without bespoke reviews fall back to the general pool. */
const REVIEWS: Review[] = [
  {
    id: "rev_01",
    productId: "prd_livia",
    author: "Hannah K.",
    location: "Portland, OR",
    rating: 5,
    title: "The dress I've worn the most this year",
    body: "Light, doesn't crease badly and the waist tie makes it feel considered without being fussy. Wore it to a wedding and to the office the following week.",
    sizePurchased: "S",
    fit: "True to size",
    verified: true,
    createdAt: "2026-10-02",
  },
  {
    id: "rev_02",
    productId: "prd_livia",
    author: "Priya M.",
    location: "London, UK",
    rating: 5,
    title: "Beautiful fabric",
    body: "The lyocell-linen blend has a lovely weight. Pockets are deep enough for a phone. I'm 165 cm and the length hits mid-calf.",
    sizePurchased: "M",
    fit: "True to size",
    verified: true,
    createdAt: "2026-09-21",
  },
  {
    id: "rev_03",
    productId: "prd_livia",
    author: "Jess T.",
    location: "Sydney, AU",
    rating: 4,
    title: "Lovely, slightly roomy",
    body: "Gorgeous colour and drape. It's a touch roomy in the bust for me so I'd consider sizing down if you're between sizes.",
    sizePurchased: "M",
    fit: "Runs large",
    verified: true,
    createdAt: "2026-09-12",
  },
  {
    id: "rev_04",
    productId: "*",
    author: "Amélie R.",
    location: "Lyon, FR",
    rating: 5,
    title: "Quality you can feel",
    body: "Exactly as pictured, and it washes well. Delivery was quick and the packaging was entirely paper.",
    fit: "True to size",
    verified: true,
    createdAt: "2026-09-30",
  },
  {
    id: "rev_05",
    productId: "*",
    author: "Nora L.",
    location: "Toronto, CA",
    rating: 5,
    title: "Already ordered a second colour",
    body: "Simple, well cut and easy to style. The kind of piece you stop thinking about because it just works.",
    fit: "True to size",
    verified: true,
    createdAt: "2026-09-08",
  },
  {
    id: "rev_06",
    productId: "*",
    author: "Sofia G.",
    location: "Austin, TX",
    rating: 4,
    title: "Great everyday piece",
    body: "Soft and comfortable. I'd have liked one more colour option but the neutral tones are lovely.",
    fit: "True to size",
    verified: true,
    createdAt: "2026-08-27",
  },
];

export function getReviewsForProduct(productId: string): Review[] {
  const own = REVIEWS.filter((r) => r.productId === productId);
  const general = REVIEWS.filter((r) => r.productId === "*").map((r) => ({ ...r, productId }));
  return own.length >= 3 ? own : [...own, ...general].slice(0, 4);
}
