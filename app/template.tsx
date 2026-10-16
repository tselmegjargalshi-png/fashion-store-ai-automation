import type { ReactNode } from "react";

/** Re-mounts on navigation for a subtle, fast page fade. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
