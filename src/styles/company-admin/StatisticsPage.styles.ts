import type { CSSProperties } from "react";
import { COLORS } from "../../constants/ui";

export const styles = {
  rankingButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "none",
    background: "transparent",
    padding: "12px 0",
    textAlign: "left",
    cursor: "pointer",
    font: "inherit",
    borderBottom: `1px solid ${COLORS.border}`,
  },
  rankingIndex: {
    width: 16,
    fontSize: 14,
    fontWeight: 600,
    color: COLORS.textMuted,
    textAlign: "center",
    flexShrink: 0,
  },
  rankingAvatar: {
    background: COLORS.primaryTint,
    color: COLORS.primary,
    flexShrink: 0,
  },
  rankingName: {
    fontSize: 15,
    fontWeight: 500,
    color: "#1a1a1a",
  },
  rankingJob: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
    marginBottom: 6,
  },
  rankingBarTrack: {
    height: 4,
    borderRadius: 999,
    background: "#eceeed",
    overflow: "hidden",
  },
  rankingBarFill: {
    height: "100%",
    borderRadius: 999,
    background: COLORS.primary,
  },
  scanCount: {
    fontSize: 16,
    fontWeight: 600,
    color: "#1a1a1a",
    flexShrink: 0,
  },
  periodSegmented: {
    marginBottom: 8,
  },
  filterField: {
    width: "100%",
    marginBottom: 8,
  },
  toggleCard: {
    marginBottom: 16,
  },
  toggleBody: {
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activeOnlyLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: COLORS.text,
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 1px 2px rgba(15,23,42,0.06)",
  },
  statCardBody: {
    padding: 16,
  },
  statLabel: {
    margin: 0,
    fontSize: 12,
    lineHeight: "16px",
    color: COLORS.textSubtle,
  },
  statValue: {
    margin: "4px 0 0",
    fontSize: 34,
    fontWeight: 600,
    color: "#1a1a1a",
  },
  changeValue: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 30,
    whiteSpace: "nowrap",
  },
  changeArrow: {
    fontSize: 24,
    lineHeight: 1,
  },
  statCaption: {
    margin: "2px 0 0",
    fontSize: 12,
    fontWeight: 500,
    color: COLORS.textSubtle,
  },
  rankingTitle: {
    fontSize: 14,
  },
  trophyIcon: {
    marginRight: 8,
    color: "#fa8c16",
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 12,
  },
  rankingInfo: {
    flex: 1,
    textAlign: "left",
    minWidth: 0,
  },
} satisfies Record<string, CSSProperties>;
