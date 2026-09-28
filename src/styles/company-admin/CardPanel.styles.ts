import type { CSSProperties } from "react";

export const styles = {
  wrap: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  editWrap: {
    width: "min(100%, 384px)",
    margin: "0 auto",
    padding: 0,
    position: "relative",
  },
  previewToggle: {
    position: "absolute",
    zIndex: 6,
    top: 10,
    right: 14,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    minHeight: 30,
    padding: "6px 11px 6px 10px",
    borderRadius: 999,
    border: "none",
    background: "rgba(15,23,42,.62)",
    backdropFilter: "blur(12px) saturate(1.12)",
    color: "#fff",
    fontSize: 11.5,
    fontWeight: 700,
    lineHeight: 1,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(15,23,42,.16)",
  },
} satisfies Record<string, CSSProperties>;
