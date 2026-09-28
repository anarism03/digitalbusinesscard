import type { CSSProperties } from "react";

export const styles = {
  root: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 8,
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  title: {
    margin: 0,
  },
  extraOnlyRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
} satisfies Record<string, CSSProperties>;
