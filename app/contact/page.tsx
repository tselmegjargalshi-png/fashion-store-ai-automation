import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Img } from "@/components/ui/Img";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about your order, sizing or our collection? Get in touch with the ELORA care team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="container-site grid gap-16 py-14 md:py-20 lg:grid-cols-12 lg:gap-20">
      <div className="lg:col-span-5">
        <p className="eyebrow text-stone">Client care</p>
        <h1 className="mt-5 text-display uppercase">
          Let&apos;s <em className="normal-case">talk</em>
        </h1>
        <p className="mt-8 max-w-md text-lg leading-8 text-stone">
          Have a question about your order, sizing, or collection? We&apos;d love to hear from you.
        </p>

        <ul className="mt-12 space-y-6 border-t border-line pt-8">
          <li className="flex gap-4">
            <Mail className="mt-0.5 h-5 w-5 text-olive" strokeWidth={1.1} />
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em]">Email</p>
              <a href={`mailto:${SITE.email}`} className="mt-1 block hover:text-olive">
                {SITE.email}
              </a>
            </div>
          </li>
          <li className="flex gap-4">
            <InstagramIcon className="mt-0.5 h-5 w-5 text-olive" />
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em]">Instagram</p>
              <a href={SITE.instagramUrl} target="_blank" rel="noreferrer" className="mt-1 block hover:text-olive">
                {SITE.instagram}
              </a>
            </div>
          </li>
          <li className="flex gap-4">
            <Clock className="mt-0.5 h-5 w-5 text-olive" strokeWidth={1.1} />
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em]">Hours</p>
              <p className="mt-1 text-stone">Monday – Friday, 9am – 6pm ET. We reply within one business day.</p>
            </div>
          </li>
        </ul>

        <div className="relative mt-12 hidden aspect-[4/3] overflow-hidden bg-sand lg:block">
          <Img media="contact-hero" sizes="35vw" fallbackLabel="Client care" />
        </div>
      </div>

      <div className="lg:col-span-6 lg:col-start-7 lg:pt-6">
        <div className="mb-10 bg-cream p-6 text-sm text-stone">
          <span className="text-ink">Looking for a quick answer?</span> Our{" "}
          <Link href="/faq" className="underline underline-offset-4">
            FAQ
          </Link>{" "}
          covers shipping, returns and sizing — or ask our assistant, bottom right, for order updates.
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
