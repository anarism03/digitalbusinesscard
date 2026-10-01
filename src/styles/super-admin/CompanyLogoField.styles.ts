import type { CSSProperties } from "react";

export const styles = {
  logoLabel: { fontSize: 13, display: "block", marginBottom: 12 },
  logoItem: { marginBottom: 20 },
  logoRow: { display: "flex", alignItems: "center", gap: 16 },
  previewWrap: { position: "relative", flexShrink: 0 },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 22,
    height: 22,
    minWidth: 0,
    padding: 0,
    borderRadius: "50%",
    background: "#fff",
    border: "1px solid #ffccc7",
  },
  uploadLabel: { cursor: "pointer" },
  uploadButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 12px",
    border: "1px solid #d9d9d9",
    borderRadius: 6,
    fontSize: 13,
    color: "#262626",
  },
  hiddenFile: { display: "none" },
  logoHint: { fontSize: 11, color: "#8c8c8c", marginTop: 4 },
} satisfies Record<string, CSSProperties>;
