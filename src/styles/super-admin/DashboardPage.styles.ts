import type { CSSProperties } from "react";
import { COLORS } from "../../constants/ui";

export const styles = {
  topRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px",
    borderRadius: 10,
    cursor: "pointer",
  },
  topRowFirst: {
    background: COLORS.surfaceSubtle,
    marginBottom: 4,
  },
  medalIcon: {
    fontSize: 18,
    width: 20,
    textAlign: "center",
    flexShrink: 0,
  },
  rankNumber: {
    fontSize: 12,
    fontWeight: 600,
    color: COLORS.textMuted,
    width: 20,
    textAlign: "center",
    flexShrink: 0,
  },
  topAvatar: {
    borderRadius: 8,
    background: COLORS.avatarMuted,
    flexShrink: 0,
  },
  topName: {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    fontWeight: 600,
    color: COLORS.text,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  topNameFirst: {
    fontWeight: 700,
  },
  topInactivePill: {
    fontSize: 10,
    fontWeight: 600,
    color: COLORS.danger,
    background: COLORS.dangerSoft,
    padding: "1px 6px",
    borderRadius: 6,
    flexShrink: 0,
  },
  topCount: {
    fontSize: 13,
    fontWeight: 700,
    color: COLORS.primary,
    fontVariantNumeric: "tabular-nums",
    flexShrink: 0,
  },
  statsRow: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 14,
    boxShadow: "0 12px 30px rgba(20,36,140,0.08)",
  },
  titleIcon: {
    marginRight: 8,
    color: "#1b4a75",
  },
  activeValue: {
    color: "#1b4a75",
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
