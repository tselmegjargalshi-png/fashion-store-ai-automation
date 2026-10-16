"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { InstagramIcon, PinterestIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import { MAIN_NAV, SITE } from "@/lib/site";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const close = onClose;
  return (
    <Drawer open={open} onClose={close} title="Menu" side="left" hideTitle>
      <nav aria-label="Mobile" className="flex min-h-full flex-col px-6 pb-8 pt-4">
        <ul className="space-y-1">
          {MAIN_NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={close} className="group flex items-center justify-between py-2.5 font-serif text-[2rem] leading-tight">
                {item.label}
                <ArrowRight className="h-5 w-5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" strokeWidth={1} />
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-10 grid grid-cols-2 gap-y-3 border-t border-line pt-8 text-sm text-stone">
          {[
            ["Account", "/account"],
            ["Wishlist", "/wishlist"],
            ["Contact", "/contact"],
            ["FAQ", "/faq"],
            ["Size Guide", "/size-guide"],
            ["Case Study", "/case-study"],
          ].map(([label, href]) => (
            <li key={href}>
              <Link href={href} onClick={close} className="hover:text-ink">
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex gap-4 pt-10 text-stone">
          <a href={SITE.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon className="h-5 w-5" /></a>
          <a href={SITE.tiktokUrl} target="_blank" rel="noreferrer" aria-label="TikTok"><TikTokIcon className="h-5 w-5" /></a>
          <a href={SITE.pinterestUrl} target="_blank" rel="noreferrer" aria-label="Pinterest"><PinterestIcon className="h-5 w-5" /></a>
        </div>
      </nav>
    </Drawer>
  );
}
