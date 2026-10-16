"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { Wordmark } from "@/components/ui/Wordmark";
import { MAIN_NAV } from "@/lib/site";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

const iconBtn = "relative grid h-10 w-10 place-items-center transition-opacity hover:opacity-60";

export function Header() {
  const pathname = usePathname();
  const { itemCount, wishlist, hydrated, setCartOpen, setSearchOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const overlay = pathname === "/";
  const transparent = overlay && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/shop" ? pathname === "/shop" : pathname.startsWith(href));

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 h-[var(--header-h)] transition-[background-color,color,border-color] duration-500 ease-editorial",
          transparent ? "border-b border-transparent bg-transparent text-ivory" : "border-b border-line/80 bg-ivory/95 text-ink backdrop-blur",
        )}
      >
        <div className="container-site flex h-full items-center justify-between gap-6">
          <div className="flex items-center gap-1 xl:hidden">
            <button type="button" className={cn(iconBtn, "-ml-2")} onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen}>
              <Menu className="h-5 w-5" strokeWidth={1.25} />
            </button>
            <button type="button" className={cn(iconBtn, "md:hidden")} onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search className="h-[18px] w-[18px]" strokeWidth={1.25} />
            </button>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 xl:static xl:translate-x-0">
            <Wordmark />
          </div>

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-7">
              {MAIN_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="link-underline py-2 text-[0.7rem] font-medium uppercase tracking-[0.18em]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="-mr-2 flex items-center">
            <button type="button" className={cn(iconBtn, "hidden md:grid")} onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search className="h-[18px] w-[18px]" strokeWidth={1.25} />
            </button>
            <Link href="/account" className={cn(iconBtn, "hidden md:grid")} aria-label="Account">
              <User className="h-[18px] w-[18px]" strokeWidth={1.25} />
            </Link>
            <Link href="/wishlist" className={cn(iconBtn, "hidden sm:grid")} aria-label={`Wishlist${hydrated && wishlist.length ? `, ${wishlist.length} saved` : ""}`}>
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.25} />
              {hydrated && wishlist.length > 0 && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />}
            </Link>
            <button type="button" className={iconBtn} onClick={() => setCartOpen(true)} aria-label={`Bag, ${hydrated ? itemCount : 0} items`}>
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.25} />
              {hydrated && itemCount > 0 && (
                <span
                  className={cn(
                    "absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[0.6rem] font-medium tabular-nums",
                    transparent ? "bg-ivory text-ink" : "bg-ink text-ivory",
                  )}
                  aria-hidden="true"
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
