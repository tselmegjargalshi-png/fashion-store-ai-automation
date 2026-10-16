import { BestSellers } from "@/components/home/BestSellers";
import { BrandStoryTeaser } from "@/components/home/BrandStoryTeaser";
import { EditorialBanner } from "@/components/home/EditorialBanner";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { Hero } from "@/components/home/Hero";
import { LookbookTeaser } from "@/components/home/LookbookTeaser";
import { NewArrivals } from "@/components/home/NewArrivals";
import { ServiceBar } from "@/components/home/ServiceBar";
import { SITE } from "@/lib/site";

export default function HomePage() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ELORA",
    url: SITE.url,
    email: SITE.email,
    sameAs: [SITE.instagramUrl, SITE.tiktokUrl, SITE.pinterestUrl],
  };
  return (
    <>
      <Hero />
      <ServiceBar />
      <FeaturedCategories />
      <NewArrivals />
      <BestSellers />
      <EditorialBanner />
      <BrandStoryTeaser />
      <LookbookTeaser />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
    </>
  );
}
