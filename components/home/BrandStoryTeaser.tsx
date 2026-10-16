import { Philosophy } from "@/components/brand/Philosophy";
import { ButtonLink } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";

export function BrandStoryTeaser() {
  return (
    <section aria-labelledby="story-title" className="container-site py-24 md:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
        <div className="relative lg:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Img media="about-studio" sizes="(min-width:1024px) 45vw, 100vw" fallbackLabel="The ELORA studio" />
          </div>
          <div className="absolute -bottom-8 right-4 hidden w-[42%] border-[10px] border-ivory sm:block md:right-[-2rem]">
            <div className="relative aspect-square">
              <Img media="about-detail" sizes="20vw" fallbackLabel="Details" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="eyebrow mb-5 text-stone">Our story</p>
          <h2 id="story-title" className="text-[2.6rem] uppercase leading-[0.98] tracking-[0.01em] sm:text-5xl lg:text-[3.6rem]">
            Designed for the way <em className="normal-case">you live</em>
          </h2>
          <p className="mt-6 text-stone">
            ELORA was created around a simple idea: everyday clothing should feel effortless, considered, and entirely your own.
          </p>
          <Philosophy className="mt-10" />
          <ButtonLink href="/about" variant="outline" className="mt-10">
            Read our story
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
