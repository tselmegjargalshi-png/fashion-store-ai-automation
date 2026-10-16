/**
 * Custom next/image loader.
 *
 * Remote photography is requested directly from the image CDN at the width
 * the browser needs (srcset), in modern formats, so pages stay light without
 * routing images through the Next.js server.
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("/")) return src;
  const url = new URL(src);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 72));
  return url.toString();
}
