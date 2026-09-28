import type { CSSProperties } from "react";
import { COLORS } from "../../constants/ui";

export const styles = {
  mask: {
    background: "rgba(15,23,42,.48)",
    backdropFilter: "blur(5px)",
  },
  content: {
    padding: 0,
    borderRadius: 28,
    overflow: "hidden",
    boxShadow: "0 28px 80px rgba(15,23,42,.24)",
  },
  body: {
    padding: "34px 22px 24px",
  },
  iconWrap: {
    width: 82,
    height: 82,
    margin: "0 auto 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
    background: "linear-gradient(145deg, #fff 0%, #eef3fa 100%)",
    boxShadow: "0 12px 28px rgba(15,23,42,.12)",
  },
  icon: {
    width: 52,
    height: 52,
    objectFit: "contain",
  },
  iconFallback: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 44,
    lineHeight: 1,
  },
  list: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 12,
  },
  row: {
    minHeight: 62,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "4px 8px",
    padding: "14px 18px",
    border: "1px solid rgba(15,23,42,.035)",
    borderRadius: 18,
    background: "#f4f5f7",
    color: COLORS.text,
    textAlign: "center",
    textDecoration: "none",
    boxShadow: "0 8px 20px rgba(15,23,42,.055)",
  },
  headline: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 1.4,
    fontWeight: 500,
  },
  value: {
    minWidth: 0,
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 1.4,
    fontWeight: 500,
    overflowWrap: "anywhere",
  },
} satisfies Record<string, CSSProperties>;
