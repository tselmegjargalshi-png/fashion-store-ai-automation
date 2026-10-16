import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "light" | "ghost" | "olive";
type Size = "md" | "lg" | "sm";

const base =
  "group/btn inline-flex items-center justify-center gap-3 whitespace-nowrap font-sans text-[0.72rem] font-medium uppercase tracking-[0.18em] transition-[background-color,color,border-color,opacity] duration-300 ease-editorial disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-ivory hover:bg-olive-dark",
  olive: "bg-olive text-ivory hover:bg-olive-dark",
  secondary: "bg-cream text-ink hover:bg-sand",
  outline: "border border-ink/80 text-ink hover:bg-ink hover:text-ivory",
  light: "bg-ivory text-ink hover:bg-white",
  ghost: "border border-ivory/70 text-ivory hover:bg-ivory hover:text-ink",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5",
  md: "h-12 px-7",
  lg: "h-14 px-9",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />;
}

type LinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size; children: ReactNode };

export function ButtonLink({ variant, size, className, ...props }: LinkProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}
