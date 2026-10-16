import type { Metadata } from "next";
import { SizeGuide } from "@/components/product/SizeGuide";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Find your ELORA size. Bust, waist and hip measurements for sizes XS to XL in centimetres and inches, plus a quick size finder.",
  alternates: { canonical: "/size-guide" },
};

export default function SizeGuidePage() {
  return (
    <div className="container-site py-14 md:py-20">
      <div className="grid gap-12 lg:grid-cols-12">
        <header className="lg:col-span-4">
          <p className="eyebrow text-stone">Fit &amp; sizing</p>
          <h1 className="mt-5 text-display">
            Size <em>guide</em>
          </h1>
          <p className="mt-6 max-w-sm text-stone">
            Our pieces are designed to be true to size unless noted. If you&apos;re between sizes, choose the larger size for tailoring and your usual size for knits.
          </p>
        </header>
        <div className="lg:col-span-7 lg:col-start-6">
          <SizeGuide />
        </div>
      </div>
    </div>
  );
}
