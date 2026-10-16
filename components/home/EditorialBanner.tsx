import { ButtonLink } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";

export function EditorialBanner() {
  return (
    <section aria-labelledby="everyday-title" className="relative flex min-h-[78svh] items-center overflow-hidden bg-taupe text-ivory">
      <Img media="editorial-everyday" sizes="100vw" plainFallback className="object-[50%_35%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/25 to-transparent" aria-hidden="true" />
      <div className="container-site relative py-24">
        <div className="max-w-xl">
          <p className="eyebrow mb-6 text-ivory/80">The ELORA Edit — Chapter 02</p>
          <h2 id="everyday-title" className="text-display uppercase">
            Made for your <em className="normal-case">everyday</em>
          </h2>
          <p className="mt-6 max-w-md text-base text-ivory/90 md:text-lg">
            Thoughtfully designed pieces that move effortlessly from slow mornings to late evenings.
          </p>
          <ButtonLink href="/about" variant="light" size="lg" className="mt-10">
            Discover ELORA
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
