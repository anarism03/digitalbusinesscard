import type { CSSProperties } from "react";

export const styles = {
  row: {
    padding: "14px 14px 2px",
    marginBottom: 12,
    borderRadius: 18,
    background: "#f8fafc",
    border: "1px solid #edf1f6",
  },
  logoActions: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  logoUploadButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 40,
    padding: "7px 14px",
    border: "1px solid #d9d9d9",
    borderRadius: 10,
    background: "#fff",
    color: "#1e293b",
    cursor: "pointer",
    fontWeight: 600,
  },
  hiddenFileInput: {
    display: "none",
  },
} satisfies Record<string, CSSProperties>;
