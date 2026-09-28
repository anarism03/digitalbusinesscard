import type { CSSProperties } from "react";

export const styles = {
  emptyChange: {
    color: "#bfbfbf",
  },
  deletedValue: {
    color: "#cf1322",
    textDecoration: "line-through",
  },
  addedValue: {
    color: "#389e0d",
  },
} satisfies Record<string, CSSProperties>;

export const getChangeListStyle = (expanded: boolean): CSSProperties => ({
  display: "grid",
  gap: expanded ? 0 : 5,
  gridTemplateColumns: expanded ? "repeat(2, minmax(0, 1fr))" : "1fr",
});

export const getChangeItemStyle = (expanded: boolean): CSSProperties => ({
  padding: expanded ? "8px 0" : 0,
  fontSize: 13,
  lineHeight: 1.42,
  minWidth: 0,
  overflow: expanded ? "visible" : "hidden",
  textOverflow: expanded ? undefined : "ellipsis",
  whiteSpace: expanded ? "normal" : "nowrap",
});
