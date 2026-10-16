import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { Toast } from "@/components/ui/Toast";
import { SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: "%s — ELORA" },
  description: SITE.description,
  applicationName: "ELORA",
  keywords: ["women's clothing", "modern essentials", "midi dresses", "linen", "tailoring", "ELORA"],
  openGraph: {
    type: "website",
    siteName: "ELORA",
    title: SITE.title,
    description: SITE.description,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#F8F5EF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap"
        />
      </head>
      <body>
        <StoreProvider>
          <a href="#main" className="sr-only z-[100] bg-ink px-4 py-3 text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
            Skip to content
          </a>
          <AnnouncementBar />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
          <SearchOverlay />
          <ChatWidget />
          <Toast />
        </StoreProvider>
      </body>
    </html>
  );
}
