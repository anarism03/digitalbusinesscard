import type { CSSProperties } from "react";

export const styles = {
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    zIndex: 2000,
    pointerEvents: "none",
  },
  bar: {
    height: "100%",
    borderRadius: "0 999px 999px 0",
    background: "linear-gradient(90deg, #1657c9 0%, #1e63d6 52%, #2ad2e6 100%)",
    boxShadow: "0 0 12px rgba(30, 99, 214, 0.5)",
    transition:
      "width 220ms cubic-bezier(.4,0,.2,1), opacity 320ms cubic-bezier(.4,0,.2,1)",
  },
} satisfies Record<string, CSSProperties>;

export const getProgressBarStyle = (
  progress: number,
  visible: boolean,
): CSSProperties => ({
  ...styles.bar,
  width: `${progress}%`,
  opacity: visible ? 1 : 0,
});
