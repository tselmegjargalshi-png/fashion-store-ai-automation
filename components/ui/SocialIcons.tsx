import type { SVGProps } from "react";

/** Minimal line-style brand marks (lucide no longer ships brand icons). */
export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3c.4 2.6 2.3 4.6 5 4.9" />
    </svg>
  );
}

export function PinterestIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10.6 8.6c2.6-1.3 5.4.3 4.8 3-.4 1.8-1.9 2.9-3.4 2.4-1-.3-1.3-1.2-1.1-2.2" />
      <path d="M11.3 11.2 9 20.5" />
    </svg>
  );
}
