import type { CSSProperties } from "react";

export const styles = {
  pageLoader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "min(420px, 70dvh)",
    width: "100%",
    padding: 40,
  },
} satisfies Record<string, CSSProperties>;
