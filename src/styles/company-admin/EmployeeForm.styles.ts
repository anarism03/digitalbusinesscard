import type { CSSProperties } from "react";

export const styles = {
  fullWidth: { width: "100%" },
  resetPasswordInput: { width: "100%", marginBottom: 12 },
  cardTitle: { fontSize: 13 },
  resetIcon: { marginRight: 6, color: "#d46b08" },
  resetSuccessAlert: { marginBottom: 12 },
  hiddenCancel: { display: "none" },
  actions: { display: "flex", gap: 12, justifyContent: "flex-end" },
  identifierRow: { marginBottom: 14 },
  identifierInputGroup: { display: "flex" },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#667085",
    marginBottom: 6,
  },
} satisfies Record<string, CSSProperties>;
