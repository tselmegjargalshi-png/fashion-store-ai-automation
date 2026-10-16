import Link from "next/link";
import { cn } from "@/lib/utils";

/** ELORA wordmark — wide-tracked serif capitals with a fine optical balance. */
export function Wordmark({ className, asLink = true }: { className?: string; asLink?: boolean }) {
  const mark = (
    <span className={cn("font-serif text-[1.65rem] font-medium leading-none tracking-[0.34em]", className)} aria-label="ELORA">
      ELORA
    </span>
  );
  return asLink ? (
    <Link href="/" aria-label="ELORA — home" className="inline-flex items-center pl-[0.34em]">
      {mark}
    </Link>
  ) : (
    mark
  );
}
