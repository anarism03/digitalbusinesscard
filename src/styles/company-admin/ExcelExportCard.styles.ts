import type { CSSProperties } from "react";

export const styles = {
  cardTitle: { display: "flex", alignItems: "center", gap: 8 },
  excelIcon: { color: "#1b4a75" },
  sectionText: { color: "#595959", fontSize: 14, marginBottom: 20 },
  select: { width: "100%", marginTop: 12 },
  topButton: { marginTop: 12 },
} satisfies Record<string, CSSProperties>;
