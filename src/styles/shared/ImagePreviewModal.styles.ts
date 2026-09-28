import type { CSSProperties } from "react";

export const modalStyles = {
  body: { paddingTop: 8 },
};

export const styles = {
  image: {
    width: "100%",
    maxHeight: "70vh",
    objectFit: "contain",
    borderRadius: 12,
    display: "block",
    background: "#f5f8ff",
  },
  fallback: {
    width: "min(320px, 100%)",
    aspectRatio: "1 / 1",
    margin: "0 auto",
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #e6eef6 0%, #c8d9ea 100%)",
    color: "#1b4a75",
    fontSize: 72,
    fontWeight: 700,
  },
} satisfies Record<string, CSSProperties>;
