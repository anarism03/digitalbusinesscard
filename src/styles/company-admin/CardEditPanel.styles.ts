import type { CSSProperties } from "react";

export const styles = {
  wrap: {
    padding: "0 20px",
  },
  identityField: {
    marginTop: 20,
  },
  fieldLabel: {
    display: "block",
    color: "#667085",
    fontSize: 14,
    fontWeight: 700,
  },
  flatInput: {
    background: "#f8fafc",
    border: "1px solid #d7dde7",
    borderRadius: 14,
    padding: "12px 14px",
    fontSize: 16,
    height: "auto",
    marginBottom: 10,
    transition:
      "border-color var(--dur-fast) ease, background-color var(--dur-fast) ease, box-shadow var(--dur-fast) ease",
  },
  flatInputError: {
    borderColor: "#dc2626",
  },
  bottomBar: {
    position: "sticky",
    bottom: 0,
    zIndex: 5,
    marginInline: -20,
    marginTop: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    paddingTop: 12,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: "max(14px, env(safe-area-inset-bottom))",
    background: "var(--color-canvas, #f3f5f8)",
  },
  addLinkButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    background: "#eef4ff",
    border: "1px dashed #9dbbe9",
    borderRadius: 14,
    minHeight: 52,
    padding: "12px 16px",
    color: "#1e63d6",
    fontWeight: 800,
    fontSize: 16,
    cursor: "pointer",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
} satisfies Record<string, CSSProperties>;
