"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { getMedia } from "@/lib/media";
import { cn } from "@/lib/utils";

type Props = Omit<ImageProps, "src" | "alt"> & {
  /** Key from lib/media.ts */
  media: string;
  alt?: string;
  /** Visible label on the fallback tile if the image cannot load. */
  fallbackLabel?: string;
  /** Plain tonal fallback with no text — for images that already carry overlaid copy. */
  plainFallback?: boolean;
};

/**
 * Responsive image with a designed fallback.
 * Renders on a warm tonal ground so loading never flashes white, and if a
 * remote asset is unavailable the tile degrades into an intentional,
 * on-brand placeholder instead of a broken-image icon.
 */
export function Img({ media: key, alt, fallbackLabel, plainFallback, className, fill = true, sizes = "100vw", ...rest }: Props) {
  const asset = getMedia(key);
  const [failed, setFailed] = useState(!asset.src);
  const ref = useRef<HTMLImageElement>(null);

  // An image can fail before hydration, in which case onError never fires.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0 && img.currentSrc) setFailed(true);
  }, []);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt ?? asset.alt}
        className={cn("absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-cream via-sand to-[#d9cdb9]", className)}
      >
        {!plainFallback && (
          <span className="flex flex-col items-center gap-2 text-center text-ink/45">
            <span className="font-serif text-2xl tracking-[0.3em]">ELORA</span>
            {fallbackLabel && <span className="eyebrow px-4 text-ink/40">{fallbackLabel}</span>}
          </span>
        )}
      </div>
    );
  }

  return (
    <Image
      ref={ref}
      src={asset.src}
      alt={alt ?? asset.alt}
      fill={fill}
      sizes={sizes}
      className={cn("object-cover", className)}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
