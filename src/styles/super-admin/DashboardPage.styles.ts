import type { CSSProperties } from "react";

export const styles = {
  statsRow: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 14,
    boxShadow: "0 12px 30px rgba(20,36,140,0.08)",
  },
  titleIcon: {
    marginRight: 8,
    color: "#1e63d6",
  },
  activeValue: {
    color: "#1e63d6",
  },
  recentCompanyRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
  },
  recentCompanyName: {
    fontWeight: 700,
  },
  recentCompanyMeta: {
    fontSize: 12,
    color: "#8c8c8c",
  },
} satisfies Record<string, CSSProperties>;
