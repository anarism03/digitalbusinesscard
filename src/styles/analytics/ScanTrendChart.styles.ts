import type { CSSProperties } from "react";
import { COLORS } from "../../constants/ui";

export const styles = {
  card: {
    marginBottom: 16,
    borderRadius: 20,
  },
  body: {
    padding: 16,
  },
  header: {
    display: "flex",
    alignItems: "baseline",
    marginBottom: 16,
  },
  title: {
    margin: 0,
    flexGrow: 1,
    fontSize: 15,
    lineHeight: "22px",
    fontWeight: 600,
    color: "#1a1a1a",
  },
  headerLabel: {
    fontSize: 12,
    color: COLORS.textSubtle,
  },
  empty: {
    padding: 24,
  },
  chartWrap: {
    position: "relative",
    height: 120,
  },
  svg: {
    display: "block",
    width: "100%",
    height: "100%",
    overflow: "visible",
  },
  hitZones: {
    position: "absolute",
    inset: 0,
    display: "flex",
  },
  hitZone: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    border: "none",
    background: "transparent",
    padding: 0,
    cursor: "pointer",
  },
  tooltip: {
    position: "absolute",
    background: "#1a1a1a",
    color: "#fff",
    fontSize: 12,
    fontWeight: 600,
    lineHeight: "16px",
    padding: "6px 10px",
    borderRadius: 7,
    whiteSpace: "nowrap",
    pointerEvents: "none",
    transition: "opacity 0.15s ease, transform 0.15s ease",
    zIndex: 5,
  },
  axisRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 8,
  },
  axisLabel: {
    fontSize: 11,
    color: COLORS.textSubtle,
  },
} satisfies Record<string, CSSProperties>;
