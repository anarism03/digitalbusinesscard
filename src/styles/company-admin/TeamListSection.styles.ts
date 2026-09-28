import type { CSSProperties } from "react";
import { COLORS } from "../../constants/ui";

export const styles = {
  pageRoot: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  listArea: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  searchInput: {
    borderRadius: 14,
    borderColor: COLORS.borderSubtle,
    height: 46,
    marginBottom: 16,
  },
  searchIcon: {
    color: COLORS.textMuted,
  },
  tabIcon: {
    marginRight: 6,
  },
  archiveBadge: {
    marginLeft: 6,
    background: "#8c8c8c",
  },
  archivedHint: {
    fontSize: 12,
    color: "#8c8c8c",
    marginBottom: 12,
    padding: "8px 12px",
    background: "#fafafa",
    borderRadius: 8,
    border: "1px dashed #d9d9d9",
  },
  licenseCard: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 1px 2px rgba(26,26,26,0.04), 0 8px 24px rgba(26,26,26,0.06)",
    padding: 16,
    marginBottom: 16,
  },
  licenseHeaderRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  licenseTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#1a1a1a",
  },
  licenseCount: {
    fontSize: 14,
    fontWeight: 700,
    color: "#d97706",
  },
  licenseTrack: {
    height: 6,
    borderRadius: 999,
    background: "#eceeed",
    overflow: "hidden",
  },
  licenseFill: {
    display: "block",
    height: "100%",
    borderRadius: 999,
    background: COLORS.primary,
  },
} satisfies Record<string, CSSProperties>;
