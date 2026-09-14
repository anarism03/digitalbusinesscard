import type { CSSProperties } from "react";

export const imageStyleBase = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
} satisfies CSSProperties;

export const getAssetImageStyle = (
  imageStyle?: CSSProperties,
): CSSProperties => ({
  ...imageStyleBase,
  ...imageStyle,
});
