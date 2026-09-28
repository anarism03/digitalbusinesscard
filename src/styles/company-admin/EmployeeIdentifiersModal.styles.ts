import type { CSSProperties } from "react";

export const styles = {
  title: { fontSize: 13 },
  titleIcon: { marginRight: 6, color: "#d46b08" },
  row: { marginBottom: 14 },
  label: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#667085",
    marginBottom: 6,
  },
  inputGroup: { display: "flex" },
  skeleton: { width: "100%" },
} satisfies Record<string, CSSProperties>;
