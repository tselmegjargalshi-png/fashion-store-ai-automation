"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Img } from "@/components/ui/Img";
import { getMedia } from "@/lib/media";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  function go(index: number) {
    const i = (index + images.length) % images.length;
    setActive(i);
    const track = trackRef.current;
    if (track) track.scrollTo({ left: track.clientWidth * i, behavior: "smooth" });
  }

  function onThumbKey(e: KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      go(active - 1);
    }
  }

  return (
    <div className="lg:grid lg:grid-cols-[84px_1fr] lg:gap-4">
      {/* Thumbnails (desktop) */}
      <div role="tablist" aria-label={`${name} images`} aria-orientation="vertical" className="hidden flex-col gap-3 lg:flex" onKeyDown={onThumbKey}>
        {images.map((key, i) => (
          <button
            key={key + i}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={`Image ${i + 1} of ${images.length}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => go(i)}
            className={cn("relative aspect-[3/4] overflow-hidden bg-cream transition-opacity", active === i ? "opacity-100 ring-1 ring-ink ring-offset-2 ring-offset-ivory" : "opacity-60 hover:opacity-100")}
          >
            <Img media={key} sizes="84px" alt="" plainFallback />
          </button>
        ))}
      </div>

      {/* Main image — swipeable on touch, synced with thumbnails */}
      <div className="relative">
        <div
          ref={trackRef}
          className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto lg:overflow-hidden"
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / el.clientWidth);
            if (i !== active) setActive(i);
          }}
        >
          {images.map((key, i) => (
            <div key={key + i} className="relative aspect-[3/4] w-full shrink-0 snap-center bg-cream" aria-hidden={active !== i}>
              <Img media={key} priority={i === 0} sizes="(min-width:1024px) 50vw, 100vw" alt={getMedia(key).alt || `${name} image ${i + 1}`} fallbackLabel={name} />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 lg:hidden" aria-hidden="true">
          {images.map((_, i) => (
            <span key={i} className={cn("h-1 rounded-full bg-ivory transition-all", active === i ? "w-6" : "w-1.5 opacity-60")} />
          ))}
        </div>
        <p className="absolute bottom-4 right-4 hidden bg-ivory/90 px-2.5 py-1 text-[0.65rem] tabular-nums tracking-[0.14em] lg:block" aria-live="polite">
          {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
