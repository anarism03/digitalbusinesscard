import type { CSSProperties } from "react";

export const styles = {
  actions: {
    display: "flex",
    gap: 10,
    marginTop: 4,
  },
  divided: {
    paddingTop: 16,
    borderTop: "1px solid #eef0f3",
  },
  secondaryButton: { flex: 1 },
  primaryButton: { flex: 2 },
} satisfies Record<string, CSSProperties>;
