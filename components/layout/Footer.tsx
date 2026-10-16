import Link from "next/link";
import { InstagramIcon, PinterestIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import { FOOTER_NAV, SITE } from "@/lib/site";
import { Newsletter } from "./Newsletter";

export function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="container-site pb-10 pt-20 lg:pt-24">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-5 text-ivory/60">Join the ELORA Edit</p>
            <p className="max-w-md font-serif text-4xl leading-[1.05] sm:text-5xl">
              New arrivals, styling notes and <em>first access</em> — once a fortnight.
            </p>
            <div className="mt-8 max-w-md">
              <Newsletter tone="dark" />
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-6 lg:col-start-7">
            {FOOTER_NAV.map((group) => (
              <div key={group.title}>
                <h2 className="eyebrow mb-5 font-sans text-ivory/60">{group.title}</h2>
                <ul className="space-y-3 text-sm">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-ivory/85 transition-colors hover:text-ivory">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h2 className="eyebrow mb-5 font-sans text-ivory/60">Social</h2>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href={SITE.instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-ivory/85 hover:text-ivory">
                    <InstagramIcon className="h-4 w-4" /> Instagram
                  </a>
                </li>
                <li>
                  <a href={SITE.tiktokUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-ivory/85 hover:text-ivory">
                    <TikTokIcon className="h-4 w-4" /> TikTok
                  </a>
                </li>
                <li>
                  <a href={SITE.pinterestUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-ivory/85 hover:text-ivory">
                    <PinterestIcon className="h-4 w-4" /> Pinterest
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <p aria-hidden="true" className="mt-20 select-none text-center font-serif text-[22vw] leading-[0.8] tracking-[0.12em] text-ivory/[0.07] lg:text-[17rem]">
          ELORA
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-ivory/15 pt-8 text-xs text-ivory/55 md:flex-row md:items-center md:justify-between">
          <p>© 2026 ELORA. All rights reserved.</p>
          <p>
            ELORA is a fictional brand created as a portfolio project. No orders are fulfilled or charged.{" "}
            <Link href="/case-study" className="underline underline-offset-4 hover:text-ivory">
              Read the case study
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
