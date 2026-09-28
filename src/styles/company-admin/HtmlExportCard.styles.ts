import type { CSSProperties } from "react";

export const styles = {
  cardTitle: { display: "flex", alignItems: "center", gap: 8 },
  excelIcon: { color: "#1b4a75" },
  select: { width: "100%", marginTop: 12 },
  topButton: { marginTop: 12 },
  pageControls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    fontSize: 12,
    color: "#8c8c8c",
  },
} satisfies Record<string, CSSProperties>;
