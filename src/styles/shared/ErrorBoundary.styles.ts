import type { CSSProperties } from "react";

export const styles = {
  errorBoundary: {
    minHeight: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f5f7",
  },
} satisfies Record<string, CSSProperties>;
