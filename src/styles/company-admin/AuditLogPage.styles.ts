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
  tableRow: {
    height: 76,
  },
  detailMetaRow: {
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
