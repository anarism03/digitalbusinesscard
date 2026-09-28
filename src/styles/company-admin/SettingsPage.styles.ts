import type { CSSProperties } from "react";
import { COLORS, SHADOWS } from "../../constants/ui";

export const styles = {
  card: {
    borderRadius: 14,
    border: "none",
    boxShadow: SHADOWS.card,
  },
  tableGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) auto",
    rowGap: 0,
    columnGap: 0,
    marginBottom: 4,
  },
  tableHeaderCell: {
    background: COLORS.surfaceSubtle,
    padding: "10px",
    fontSize: 12,
    fontWeight: 700,
    color: COLORS.labelMuted,
    whiteSpace: "nowrap",
  },
  tableHeaderCellFirst: {
    paddingLeft: 16,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  tableHeaderCellLast: {
    paddingRight: 16,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },
  tableHeaderCenter: {
    textAlign: "center",
  },
  tableCell: {
    display: "flex",
    alignItems: "center",
    padding: "12px 10px",
    borderBottom: "1px solid rgba(15,23,42,0.05)",
    minWidth: 0,
  },
  tableCellFirst: {
    paddingLeft: 16,
  },
  tableCellLast: {
    paddingRight: 16,
  },
  tableCellCenter: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  tableFooter: {
    color: COLORS.textSubtle,
    fontSize: 13,
    textAlign: "center",
    padding: "12px 0 0",
    margin: 0,
  },
  employeeRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
    width: "100%",
  },
  employeeAvatar: {
    background: COLORS.avatarMuted,
    color: COLORS.textSubtle,
  },
  employeeTextCol: {
    minWidth: 0,
  },
  employeeName: {
    fontWeight: 600,
    fontSize: 14,
    color: COLORS.text,
    overflowX: "auto",
    whiteSpace: "nowrap",
  },
  employeeEmail: {
    fontSize: 12,
    color: COLORS.textSubtle,
    marginTop: 2,
    overflowX: "auto",
    whiteSpace: "nowrap",
  },
  cardTitle: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 17,
    fontWeight: 500,
    color: COLORS.text,
  },
  cardTitleIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: COLORS.primaryTint,
    color: COLORS.primary,
    flexShrink: 0,
  },
  cardTitleIcon: {
    fontSize: 16,
  },
  hint: {
    color: COLORS.textSubtle,
    fontSize: 13,
    marginBottom: 16,
  },
  adminPill: {
    display: "inline-block",
    borderRadius: 10,
    fontSize: 12,
    whiteSpace: "nowrap",
    padding: "6px 12px",
    fontWeight: 700,
    background: COLORS.primaryTint,
    color: COLORS.primary,
  },
} satisfies Record<string, CSSProperties>;
