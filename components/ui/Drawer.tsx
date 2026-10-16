"use client";

import { X } from "lucide-react";
import { useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useDialog } from "./useDialog";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: "left" | "right";
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  /** Visually hide the header title (still announced to screen readers). */
  hideTitle?: boolean;
}

export function Drawer({ open, onClose, title, side = "right", children, footer, className, hideTitle }: DrawerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialog(open, onClose, ref);

  if (!open || typeof document === "undefined") return null;

  // Portal to <body> so the dialog escapes any ancestor stacking context.
  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 animate-fade-in bg-ink/35 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "absolute top-0 flex h-full w-full max-w-[440px] flex-col bg-ivory shadow-2xl",
          side === "right" ? "right-0 animate-slide-in-right" : "left-0 animate-slide-in-left",
          className,
        )}
      >
        <div className={cn("flex items-center justify-between border-b border-line px-6 py-5", hideTitle && "border-none pb-0")}>
          <h2 id={titleId} className={cn("font-sans text-xs font-medium uppercase tracking-[0.2em]", hideTitle && "sr-only")}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 ml-auto grid h-10 w-10 place-items-center text-ink transition-colors hover:text-olive"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="border-t border-line px-6 py-5">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
