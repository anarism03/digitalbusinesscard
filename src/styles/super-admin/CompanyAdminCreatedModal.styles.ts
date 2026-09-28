import type { CSSProperties } from "react";

export const styles = {
  hiddenCancel: {
    display: "none",
  },
  successAlert: {
    marginBottom: 12,
  },
  paragraph: {
    marginBottom: 6,
  },
  copyButton: {
    marginLeft: 4,
  },
} satisfies Record<string, CSSProperties>;
