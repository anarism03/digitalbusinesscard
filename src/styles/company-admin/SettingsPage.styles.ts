import type { CSSProperties } from "react";

export const styles = {
  employeeRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  employeeName: {
    fontWeight: 500,
    fontSize: 13,
  },
  employeeEmail: {
    fontSize: 11,
    color: "#8c8c8c",
  },
  cardTitle: {
    fontSize: 14,
  },
  cardTitleIcon: {
    marginRight: 8,
    color: "#1e63d6",
  },
  hint: {
    color: "#8c8c8c",
    fontSize: 13,
    marginBottom: 16,
  },
} satisfies Record<string, CSSProperties>;
