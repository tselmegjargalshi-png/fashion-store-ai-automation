import { Leaf, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const SERVICES = [
  { icon: Truck, title: "Free shipping", text: "On orders over $100" },
  { icon: RotateCcw, title: "30-day returns", text: "Free and easy, always" },
  { icon: Leaf, title: "Considered materials", text: "Linen, organic cotton, recycled fibres" },
  { icon: ShieldCheck, title: "Secure checkout", text: "Every major card and wallet" },
];

export function ServiceBar() {
  return (
    <section aria-label="Our service" className="border-b border-line">
      <ul className="container-site grid grid-cols-2 gap-y-6 py-8 lg:grid-cols-4">
        {SERVICES.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3 pr-4 lg:justify-center">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-olive" strokeWidth={1.1} aria-hidden="true" />
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em]">{title}</p>
              <p className="mt-1 text-sm text-stone">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
