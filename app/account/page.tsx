import type { Metadata } from "next";
import Link from "next/link";
import { OrderLookup } from "@/components/account/OrderLookup";

export const metadata: Metadata = { title: "Account & Order Tracking", robots: { index: false } };

export default function AccountPage() {
  return (
    <div className="container-site py-14 md:py-20">
      <header className="max-w-2xl">
        <p className="eyebrow text-stone">Your account</p>
        <h1 className="mt-5 text-display">
          Welcome <em>back</em>
        </h1>
      </header>
      <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-24">
        <section aria-labelledby="track-title">
          <h2 id="track-title" className="text-3xl">
            Track an order
          </h2>
          <p className="mb-8 mt-3 text-stone">No account needed — enter the order number from your confirmation email.</p>
          <OrderLookup />
        </section>
        <section aria-labelledby="signin-title" className="bg-cream p-8 sm:p-10">
          <h2 id="signin-title" className="text-3xl">
            Customer accounts
          </h2>
          <p className="mt-3 text-stone">
            Saved addresses, order history and one-click returns live here in production. In this portfolio build, accounts are intentionally out of scope — the
            architecture is ready to plug into Shopify Customer Accounts, Auth.js or Supabase Auth.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            <li>
              <Link href="/wishlist" className="underline underline-offset-4">
                View your wishlist
              </Link>{" "}
              <span className="text-stone">— saved on this device</span>
            </li>
            <li>
              <Link href="/faq#returns" className="underline underline-offset-4">
                Start a return
              </Link>
            </li>
            <li>
              <Link href="/case-study" className="underline underline-offset-4">
                Read how the platform is built
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
