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
    background: "linear-gradient(135deg, #e7f1fd 0%, #cfe3fa 100%)",
    color: "#1e63d6",
    fontSize: 72,
    fontWeight: 700,
  },
} satisfies Record<string, CSSProperties>;
