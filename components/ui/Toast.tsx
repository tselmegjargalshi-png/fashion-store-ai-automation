"use client";

import Link from "next/link";
import { useStore } from "@/components/providers/StoreProvider";

export function Toast() {
  const { toast } = useStore();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4">
      {toast && (
        <div key={toast.id} className="pointer-events-auto flex animate-fade-up items-center gap-6 bg-ink px-5 py-3.5 text-sm text-ivory shadow-xl">
          <span>{toast.message}</span>
          {toast.action && (
            <Link href={toast.action.href} className="text-xs font-medium uppercase tracking-[0.16em] underline underline-offset-4">
              {toast.action.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
