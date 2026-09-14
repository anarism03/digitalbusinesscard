import type { CSSProperties } from "react";

export const styles = {
  columnStack: { display: "flex", flexDirection: "column", gap: 16 },
  cardTitle: { display: "flex", alignItems: "center", gap: 8 },
  excelIcon: { color: "#1e63d6" },
  importIcon: { color: "#fa8c16" },
  sectionText: { color: "#595959", fontSize: 14, marginBottom: 20 },
  importText: { color: "#595959", fontSize: 14, marginBottom: 12 },
  select: { width: "100%", marginTop: 12 },
  topButton: { marginTop: 12 },
  bottomButton: { marginBottom: 12 },
  resultAlert: { marginBottom: 12 },
  errorList: { margin: 0, paddingLeft: 16, fontSize: 12 },
  pageControls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    fontSize: 12,
    color: "#8c8c8c",
  },
} satisfies Record<string, CSSProperties>;
