import type { CSSProperties } from "react";

export const styles = {
  wrapper: {
    borderRadius: "24px 24px 0 0",
    overflow: "hidden",
    boxShadow: "0 -18px 54px rgba(15,23,42,.2)",
  },
  header: {
    padding: "14px 56px 10px",
    borderBottom: "1px solid rgba(15,23,42,.05)",
    background: "rgba(255,255,255,.96)",
    backdropFilter: "blur(18px) saturate(1.12)",
  },
  body: {
    padding: "10px 24px max(28px, env(safe-area-inset-bottom))",
    maxHeight: "min(80dvh, 720px)",
    overflowY: "auto",
    overscrollBehavior: "contain",
    background: "#fff",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    background: "#d7dde7",
    margin: "0 auto 12px",
    flexShrink: 0,
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: 17,
    fontWeight: 700,
    color: "#0f172a",
    textAlign: "center",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },
  footer: {
    marginTop: 16,
    paddingTop: 14,
    borderTop: "1px solid var(--color-border)",
    background: "#fff",
  },
} satisfies Record<string, CSSProperties>;
