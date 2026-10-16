/**
 * Central photography registry.
 *
 * Every image on the site is referenced by key, so the entire visual set can
 * be re-shot or swapped (e.g. for a client's own campaign assets in /public)
 * by editing this one file. Demo photography is sourced from Unsplash.
 *
 * `src` may be a remote URL or a local path such as "/images/hero.jpg".
 */
export interface MediaAsset {
  src: string;
  alt: string;
}

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const media = {
  // Campaign & editorial
  "hero-campaign": { src: unsplash("1515372039744-b8f02a3ae446"), alt: "Woman in a soft ivory dress standing in warm natural light" },
  "editorial-everyday": { src: unsplash("1469334031218-e382a71b716b"), alt: "Model in a relaxed neutral outfit photographed against a sunlit wall" },
  "about-hero": { src: unsplash("1485968579580-b6d095142e6e"), alt: "Woman in a tailored coat walking through the city" },
  "about-studio": { src: unsplash("1490481651871-ab68de25d43d"), alt: "Neutral garments hanging on a rail in the ELORA studio" },
  "about-detail": { src: unsplash("1434389677669-e08b4cac3105"), alt: "Close-up of folded knitwear and linen in soft tones" },
  "founder-portrait": { src: unsplash("1524504388940-b1c1722653e1"), alt: "Editorial portrait of Mia Laurent, founder of ELORA" },
  "contact-hero": { src: unsplash("1483985988355-763728e1935b"), alt: "Woman carrying shopping bags on a bright afternoon" },

  // Categories
  "category-dresses": { src: unsplash("1496747611176-843222e1e57c"), alt: "Model wearing a flowing midi dress" },
  "category-tops": { src: unsplash("1529139574466-a303027c1d8b"), alt: "Model in a fitted top and relaxed trousers" },
  "category-bottoms": { src: unsplash("1509631179647-0177331693ae"), alt: "Model in tailored wide-leg trousers" },
  "category-outerwear": { src: unsplash("1539109136881-3be0616acf4b"), alt: "Model in a structured outer layer" },

  // Lookbook
  "look-morning": { src: unsplash("1508214751196-bcfd4ca60f91"), alt: "Morning light portrait in an easy linen look" },
  "look-structures": { src: unsplash("1487222477894-8943e31ef7b2"), alt: "Model in sharp tailoring with soft structure" },
  "look-city": { src: unsplash("1581044777550-4cfa60707c03"), alt: "City street look with a light blazer" },
  "look-weekend": { src: unsplash("1529626455594-4ff0802cfb7e"), alt: "Relaxed weekend outfit outdoors" },
  "look-after-hours": { src: unsplash("1517841905240-472988babdf9"), alt: "Evening portrait in a satin piece" },
  "look-everyday": { src: unsplash("1534528741775-53994a69daeb"), alt: "Close portrait in an everyday ribbed top" },
  "look-coast": { src: unsplash("1488426862026-3ee34a7d66df"), alt: "Sun-washed portrait by the coast" },

  // Products (primary + alternate)
  "p-livia-1": { src: unsplash("1595777457583-95e059d581b8"), alt: "The Livia Dress in ivory, front view" },
  "p-livia-2": { src: unsplash("1485462537746-965f33f7f6a7"), alt: "The Livia Dress styled on model" },
  "p-sienna-1": { src: unsplash("1572804013309-59a88b7e92f1"), alt: "Sienna Midi Dress, front view" },
  "p-sienna-2": { src: unsplash("1502716119720-b23a93e5fe1b"), alt: "Sienna Midi Dress styled outdoors" },
  "p-aurelie-1": { src: unsplash("1566174053879-31528523f8ae"), alt: "Aurelie Slip Dress, front view" },
  "p-aurelie-2": { src: unsplash("1550614000-4895a10e1bfd"), alt: "Aurelie Slip Dress styled for evening" },
  "p-marlowe-1": { src: unsplash("1612336307429-8a898d10e223"), alt: "Marlowe Shirt Dress, front view" },
  "p-marlowe-2": { src: unsplash("1506629082955-511b1aa562c8"), alt: "Marlowe Shirt Dress worn belted" },
  "p-juno-1": { src: unsplash("1515886657613-9f3515b0c78f"), alt: "Juno Knit Dress, front view" },
  "p-juno-2": { src: unsplash("1554412933-514a83d2f3c8"), alt: "Juno Knit Dress styled on model" },
  "p-softline-1": { src: unsplash("1564257631407-4deb1f99d992"), alt: "Softline Knit Top, front view" },
  "p-softline-2": { src: unsplash("1544441893-675973e31985"), alt: "Softline Knit Top styled on model" },
  "p-mira-1": { src: unsplash("1598554747436-c9293d6a588f"), alt: "Mira Linen Shirt, front view" },
  "p-mira-2": { src: unsplash("1520367445093-50dc08a59d9d"), alt: "Mira Linen Shirt styled open" },
  "p-clara-1": { src: unsplash("1503342217505-b0a15ec3261c"), alt: "Clara Ribbed Top, front view" },
  "p-clara-2": { src: unsplash("1475180098004-ca77a66827be"), alt: "Clara Ribbed Top styled on model" },
  "p-odette-1": { src: unsplash("1551163943-3f6a855d1153"), alt: "Odette Poplin Blouse, front view" },
  "p-odette-2": { src: unsplash("1495385794356-15371f348c31"), alt: "Odette Poplin Blouse styled tucked" },
  "p-talia-1": { src: unsplash("1576566588028-4147f3842f27"), alt: "Talia Cashmere-Blend Sweater, front view" },
  "p-talia-2": { src: unsplash("1558769132-cb1aea458c5e"), alt: "Talia Cashmere-Blend Sweater folded detail" },
  "p-elara-1": { src: unsplash("1594633312681-425c7b97ccd1"), alt: "Elara Wide-Leg Trousers, front view" },
  "p-elara-2": { src: unsplash("1525507119028-ed4c629a60a3"), alt: "Elara Wide-Leg Trousers styled on model" },
  "p-noa-1": { src: unsplash("1583496661160-fb5886a0aaaa"), alt: "Noa Satin Skirt, front view" },
  "p-noa-2": { src: unsplash("1479936343636-73cdc5aae0c3"), alt: "Noa Satin Skirt styled on model" },
  "p-reese-1": { src: unsplash("1541099649105-f69ad21f3246"), alt: "Reese Straight Jeans, front view" },
  "p-reese-2": { src: unsplash("1492707892479-7bc8d5a4ee93"), alt: "Reese Straight Jeans styled on model" },
  "p-lune-1": { src: unsplash("1577900232427-18219b9166a0"), alt: "Lune Pleated Midi Skirt, front view" },
  "p-lune-2": { src: unsplash("1512316609839-ce289d3eba0a"), alt: "Lune Pleated Midi Skirt in motion" },
  "p-isla-1": { src: unsplash("1591047139829-d91aecb6caea"), alt: "Isla Everyday Blazer, front view" },
  "p-isla-2": { src: unsplash("1611312449408-fcece27cdbb7"), alt: "Isla Everyday Blazer styled on model" },
  "p-margaux-1": { src: unsplash("1551803091-e20673f15770"), alt: "Margaux Wool Coat, front view" },
  "p-margaux-2": { src: unsplash("1516762689617-e1cffcef479d"), alt: "Margaux Wool Coat worn in the city" },
  "p-rowan-1": { src: unsplash("1548624313-0396c75e4b1a"), alt: "Rowan Trench, front view" },
  "p-rowan-2": { src: unsplash("1525562723836-dca67a71d5f1"), alt: "Rowan Trench worn open" },
  "p-wren-1": { src: unsplash("1544022613-e87ca75a784a"), alt: "Wren Cropped Jacket, front view" },
  "p-wren-2": { src: unsplash("1567401893414-76b7b1e5a7a5"), alt: "Wren Cropped Jacket on the rail" },
} satisfies Record<string, MediaAsset>;

export type MediaKey = keyof typeof media;

export function getMedia(key: string): MediaAsset {
  return (media as Record<string, MediaAsset>)[key] ?? { src: "", alt: "" };
}
