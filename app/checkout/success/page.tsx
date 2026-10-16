import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return <OrderConfirmation />;
}
