import type { CSSProperties } from "react";

export const styles = {
  actionsItem: { marginBottom: 0 },
  actions: { display: "flex", gap: 12, justifyContent: "flex-end" },
} satisfies Record<string, CSSProperties>;
