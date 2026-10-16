import type { FaqCategory } from "@/lib/types";

export const FAQ: FaqCategory[] = [
  {
    id: "orders",
    title: "Orders",
    items: [
      {
        question: "Can I change or cancel my order?",
        answer:
          "We start preparing orders quickly, so we can only guarantee changes or cancellations within 1 hour of purchase. Email care@elora.studio with your order number and we'll do our best — if your order has already shipped, you can return it free of charge.",
      },
      {
        question: "How do I track my order?",
        answer:
          "As soon as your order leaves our studio, you'll receive a shipping confirmation with a tracking link. You can also ask our assistant — just share your order number (for example EL-10421).",
      },
      {
        question: "I received the wrong or a faulty item. What should I do?",
        answer:
          "We're sorry. Contact us within 14 days of delivery with your order number and a photo, and we'll send a replacement or issue a full refund — including shipping.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping",
    items: [
      {
        question: "How long does shipping take?",
        answer:
          "Standard Shipping takes 3–5 business days within the US and is free on orders over $100 (otherwise $8). Express Shipping takes 1–2 business days for $18. Orders placed before 1 pm ET on a business day ship the same day.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes — we ship to Canada, the UK, the EU, Australia, Japan, Singapore and Mongolia. International delivery usually takes 5–10 business days. Duties and taxes are calculated at checkout so there are no surprises on delivery.",
      },
      {
        question: "Which carriers do you use?",
        answer: "We ship with UPS and DHL Express depending on your destination and chosen method.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns",
    items: [
      {
        question: "What is your return policy?",
        answer:
          "You can return unworn items with their tags attached within 30 days of delivery for a full refund. Returns are free within the US. Refunds are issued to your original payment method within 5 business days of the return reaching us.",
      },
      {
        question: "Can I exchange an item for a different size?",
        answer:
          "Yes. Start an exchange from your account or contact us, and we'll reserve your new size as soon as your return is scanned by the carrier.",
      },
      {
        question: "Are sale items returnable?",
        answer: "Items marked final sale cannot be returned. Everything else follows our standard 30-day policy.",
      },
    ],
  },
  {
    id: "sizing",
    title: "Sizing",
    items: [
      {
        question: "How do I choose my size?",
        answer:
          "Measure your bust, waist and hips and compare them with our size guide. If you're between sizes, choose the larger size for structured pieces and your usual size for knits. Each product page also has fit notes and the model's size.",
      },
      {
        question: "Do your pieces run true to size?",
        answer:
          "Most of our collection is true to size. Where a style runs relaxed or oversized, we say so in the fit notes on the product page.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    items: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept Visa, Mastercard, American Express, Apple Pay and Google Pay. All payments are processed securely and we never store your full card details.",
      },
      {
        question: "When will I be charged?",
        answer: "Your payment is authorised when you place your order and captured when it ships.",
      },
    ],
  },
  {
    id: "products",
    title: "Products",
    items: [
      {
        question: "Where are ELORA pieces made?",
        answer:
          "We work with a small group of family-run partners in Portugal, Lithuania and Turkey, chosen for their craft and working conditions.",
      },
      {
        question: "How should I care for my pieces?",
        answer:
          "Wash less, wash cool and dry flat whenever you can. Care instructions for every item are listed on its product page and the inside label.",
      },
      {
        question: "Will a sold-out item be restocked?",
        answer:
          "Our core styles are restocked regularly. Join the ELORA Edit newsletter to hear when pieces return.",
      },
    ],
  },
];
