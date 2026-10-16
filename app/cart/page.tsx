import type { Metadata } from "next";
import { CartPageView } from "@/components/cart/CartPageView";

export const metadata: Metadata = {
  title: "Your Bag",
  description: "Review the pieces in your ELORA bag before checkout.",
  robots: { index: false },
};

export default function CartPage() {
  return <CartPageView />;
}
