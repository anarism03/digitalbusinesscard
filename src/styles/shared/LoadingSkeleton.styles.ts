import type { CSSProperties } from "react";

export const styles = {
  loadingSkeleton: {
    padding: 24,
    borderRadius: 18,
    border: "1px solid rgba(15,23,42,.06)",
    background: "#fff",
    boxShadow: "var(--shadow-sm)",
  },
} satisfies Record<string, CSSProperties>;
