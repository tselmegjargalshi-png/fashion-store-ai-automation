"use client";

import { X } from "lucide-react";
import { useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useDialog } from "./useDialog";

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialog(open, onClose, ref);
  if (!open || typeof document === "undefined") return null;

  // Portal to <body> so the dialog escapes any ancestor stacking context.
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade-in bg-ink/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn("relative max-h-[90vh] w-full max-w-2xl animate-fade-up overflow-y-auto bg-ivory p-6 sm:p-10", className)}
      >
        <div className="mb-6 flex items-start justify-between gap-6">
          <h2 id={titleId} className="text-3xl sm:text-4xl">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="-mr-2 -mt-1 grid h-10 w-10 shrink-0 place-items-center hover:text-olive" aria-label="Close">
            <X className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
