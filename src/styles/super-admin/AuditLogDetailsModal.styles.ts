import type { CSSProperties } from "react";

export const styles = {
  metaRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr 1fr 1fr",
    gap: 14,
    alignItems: "center",
    paddingBottom: 12,
    borderBottom: "1px solid #eef2f7",
  },
  metaItem: {
    minWidth: 0,
  },
  metaLabel: {
    fontSize: 11,
    color: "#8c8c8c",
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: 700,
    color: "#1f2937",
  },
} satisfies Record<string, CSSProperties>;
