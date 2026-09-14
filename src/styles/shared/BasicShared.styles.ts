import type { CSSProperties } from "react";

export const styles = {
  pageLoader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "min(420px, 70dvh)",
    width: "100%",
    padding: 40,
  },
  loadingSkeleton: {
    padding: 24,
    borderRadius: 18,
    border: "1px solid rgba(15,23,42,.06)",
    background: "#fff",
    boxShadow: "var(--shadow-sm)",
  },
  setClappLogoImage: {
    display: "block",
    width: "auto",
    flexShrink: 0,
  },
  phoneInput: {
    fontFamily: "monospace",
    letterSpacing: 0.4,
  },
  errorBoundary: {
    minHeight: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f5f7",
  },
} satisfies Record<string, CSSProperties>;

export const getSetClappLogoImageStyle = (height: number): CSSProperties => ({
  ...styles.setClappLogoImage,
  height,
});
