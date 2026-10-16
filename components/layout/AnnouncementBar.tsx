"use client";

import { useEffect, useState } from "react";
import { ANNOUNCEMENTS } from "@/lib/site";

/** Quiet, rotating service messages. Pauses on hover/focus and for reduced motion. */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduce) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length), 4500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div
      className="relative z-50 bg-olive-dark text-ivory/90"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container-site flex h-9 items-center justify-center">
        <p key={index} className="animate-fade-in text-[0.68rem] font-normal uppercase tracking-[0.22em]" aria-live="off">
          {ANNOUNCEMENTS[index]}
        </p>
      </div>
    </div>
  );
}
