import type { CSSProperties } from "react";

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
  limitTag: {
    margin: 0,
    fontWeight: 600,
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
  paginationWrap: {
    display: "flex",
    justifyContent: "center",
    marginTop: "auto",
    paddingTop: 16,
  },
} satisfies Record<string, CSSProperties>;
