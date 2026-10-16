import type { Metadata } from "next";
import { WishlistView } from "@/components/product/WishlistView";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default function WishlistPage() {
  return <WishlistView />;
}
