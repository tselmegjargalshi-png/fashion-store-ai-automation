export const SITE = {
  name: "ELORA",
  title: "ELORA — Modern Women's Clothing",
  description:
    "Discover ELORA's collection of modern women's clothing, effortless everyday essentials, feminine silhouettes, and timeless wardrobe pieces.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "care@elora.studio",
  instagram: "@elora.studio",
  instagramUrl: "https://instagram.com",
  tiktokUrl: "https://tiktok.com",
  pinterestUrl: "https://pinterest.com",
  currency: "USD",
} as const;

export const FREE_SHIPPING_THRESHOLD = 100;

export const ANNOUNCEMENTS = [
  "Free shipping on orders over $100",
  "Free 30-day returns on every order",
  "New season — Spring / Summer 2026 is here",
];

export interface NavItem {
  label: string;
  href: string;
}

export const MAIN_NAV: NavItem[] = [
  { label: "New Arrivals", href: "/shop/new-arrivals" },
  { label: "Shop", href: "/shop" },
  { label: "Dresses", href: "/shop/dresses" },
  { label: "Tops", href: "/shop/tops" },
  { label: "Bottoms", href: "/shop/bottoms" },
  { label: "Outerwear", href: "/shop/outerwear" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "About", href: "/about" },
];

export const FOOTER_NAV: { title: string; links: NavItem[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", href: "/shop/new-arrivals" },
      { label: "Dresses", href: "/shop/dresses" },
      { label: "Tops", href: "/shop/tops" },
      { label: "Bottoms", href: "/shop/bottoms" },
      { label: "Outerwear", href: "/shop/outerwear" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Lookbook", href: "/lookbook" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Shipping", href: "/faq#shipping" },
      { label: "Returns", href: "/faq#returns" },
      { label: "Size Guide", href: "/size-guide" },
    ],
  },
];
