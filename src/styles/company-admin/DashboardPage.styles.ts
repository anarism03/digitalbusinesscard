import type { CSSProperties } from "react";
import { COLORS } from "../../constants/ui";

export const styles = {
  rankingButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "none",
    background: "transparent",
    padding: 0,
    textAlign: "left",
    cursor: "pointer",
    font: "inherit",
  },
  rankingAvatar: {
    background: "#e7f1fd",
    color: COLORS.primary,
  },
  rankingName: {
    fontSize: 13,
    fontWeight: 500,
  },
  rankingJob: {
    fontSize: 11,
    color: "#8c8c8c",
  },
  scanCount: {
    fontWeight: 700,
    color: COLORS.primary,
  },
  filterCard: {
    marginBottom: 16,
  },
  filterBody: {
    padding: "12px 14px",
  },
  filterRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "center",
  },
  activeOnlyLabel: {
    fontSize: 13,
  },
  totalCard: {
    marginBottom: 16,
    borderTop: `3px solid ${COLORS.primary}`,
  },
  totalBody: {
    padding: "16px 20px",
  },
  totalRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  scanIcon: {
    fontSize: 28,
    color: COLORS.primary,
  },
  totalLabel: {
    fontSize: 12,
    color: "#8c8c8c",
  },
  totalValue: {
    fontSize: 32,
    fontWeight: 800,
    color: COLORS.primary,
    lineHeight: 1.2,
  },
  rankingTitle: {
    fontSize: 14,
  },
  trophyIcon: {
    marginRight: 8,
    color: "#fa8c16",
  },
} satisfies Record<string, CSSProperties>;

export const getEmployeeSelectStyle = (isMobile: boolean): CSSProperties => ({
  width: isMobile ? "100%" : 200,
});

export const getDashboardGridStyle = (isMobile: boolean): CSSProperties => ({
  display: "grid",
  gridTemplateColumns: isMobile ? "1fr" : "1fr 380px",
  gap: 12,
});
