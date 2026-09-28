import type { CSSProperties } from "react";

export const styles = {
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    margin: "0 0 18px",
  },
  icon: {
    width: 68,
    height: 68,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    color: "#1b4a75",
    fontSize: 34,
    background: "#f4f7fc",
    boxShadow: "0 10px 24px rgba(15,23,42,.08)",
  },
  iconImage: {
    width: 44,
    height: 44,
    objectFit: "contain",
  },
  title: {
    color: "#0f172a",
    fontSize: 18,
    lineHeight: 1.25,
  },
} satisfies Record<string, CSSProperties>;
