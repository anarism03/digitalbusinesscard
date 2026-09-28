import type { CSSProperties } from "react";

export const getQrFallbackStyle = (size: number): CSSProperties => ({
  width: size,
  height: size,
  borderRadius: 8,
  background: "#f5f7fb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#98a2b3",
  fontWeight: 700,
  cursor: "default",
});

export const getQrImageStyle = (size: number): CSSProperties => ({
  width: size,
  height: size,
  display: "block",
  borderRadius: 8,
  cursor: "default",
});
