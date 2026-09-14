import type { CSSProperties } from "react";

export const getBurgerWrapStyle = (size: number): CSSProperties => ({
  position: "relative",
  display: "inline-block",
  width: size,
  height: 16,
  verticalAlign: "middle",
});

export const getBurgerBarStyle = (
  color: string,
  top: number,
  transform: string,
  opacity = 1,
): CSSProperties => ({
  position: "absolute",
  left: 0,
  top,
  height: 2,
  width: "100%",
  background: color,
  borderRadius: 2,
  transformOrigin: "center",
  transition:
    "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.18s ease",
  transform,
  opacity,
});
