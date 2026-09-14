import type { CSSProperties } from "react";

export const styles = {
  limitIcon: {
    fontSize: 13,
  },
  limitProgress: {
    flex: 1,
    maxWidth: 200,
  },
} satisfies Record<string, CSSProperties>;

export const getQrFallbackStyle = (
  size: number,
  clickable: boolean,
  style?: CSSProperties,
): CSSProperties => ({
  width: size,
  height: size,
  borderRadius: 8,
  background: "#f5f7fb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#98a2b3",
  fontWeight: 700,
  cursor: clickable ? "pointer" : "default",
  ...style,
});

export const getQrImageStyle = (
  size: number,
  clickable: boolean,
  style?: CSSProperties,
): CSSProperties => ({
  width: size,
  height: size,
  display: "block",
  borderRadius: 8,
  cursor: clickable ? "pointer" : "default",
  ...style,
});
