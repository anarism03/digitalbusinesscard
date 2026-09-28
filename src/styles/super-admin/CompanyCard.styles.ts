import type { CSSProperties } from "react";
import { COLORS, SHADOWS } from "../../constants/ui";

export const styles = {
  card: {
    borderRadius: 14,
    border: "none",
    boxShadow: SHADOWS.card,
    cursor: "pointer",
  },
  cardBody: {
    padding: 14,
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  logoAvatar: {
    borderRadius: 10,
    background: COLORS.primaryTint,
    color: COLORS.primary,
    flexShrink: 0,
  },
  avatarIcon: {
    fontSize: 20,
  },
  logoImage: {
    objectFit: "cover",
  },
  identityText: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontWeight: 600,
    fontSize: 14,
    color: COLORS.text,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  voen: {
    fontSize: 12,
    color: COLORS.textSubtle,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  statusPillActive: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 600,
    background: COLORS.successSoft,
    color: COLORS.successStrong,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  statusPillInactive: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 600,
    background: COLORS.surfaceNeutral,
    color: COLORS.textSubtle,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  limitRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  limitLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  limitValue: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: 600,
  },
  progressTrack: {
    height: 5,
    borderRadius: 10,
    background: COLORS.avatarMuted,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
    background: COLORS.primary,
  },
  actionsRow: {
    display: "flex",
    gap: 6,
  },
  actionButton: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    padding: "7px 0",
    border: "none",
    borderRadius: 9,
    background: COLORS.surfaceSubtle,
    cursor: "pointer",
  },
  actionButtonDanger: {
    background: COLORS.dangerSoft,
  },
  actionIcon: {
    fontSize: 15,
    color: COLORS.labelMuted,
  },
  actionIconDanger: {
    color: COLORS.danger,
  },
  actionLabel: {
    fontSize: 9.5,
    color: COLORS.textSubtle,
  },
  actionLabelDanger: {
    color: COLORS.danger,
  },
} satisfies Record<string, CSSProperties>;
