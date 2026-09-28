import type { CSSProperties } from "react";

export const styles = {
  cardTitle: { display: "flex", alignItems: "center", gap: 8 },
  importIcon: { color: "#fa8c16" },
  importText: { color: "#595959", fontSize: 14, marginBottom: 12 },
  bottomButton: { marginBottom: 12 },
  errorList: { margin: 0, paddingLeft: 16, fontSize: 12 },
} satisfies Record<string, CSSProperties>;
