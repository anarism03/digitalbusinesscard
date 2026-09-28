import type { CSSProperties } from "react";

export const styles = {
  form: { maxWidth: 680 },
  divider: { margin: "4px 0 20px" },
  textArea: { resize: "none" },
  fullWidth: { width: "100%" },
  actionItem: { marginBottom: 0, marginTop: 8 },
  actions: { display: "flex", gap: 12 },
} satisfies Record<string, CSSProperties>;
