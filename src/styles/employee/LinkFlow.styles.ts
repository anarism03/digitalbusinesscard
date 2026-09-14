import type { CSSProperties } from "react";

export const styles = {
  search: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#98a2b3",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    margin: "14px 0 10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14,
  },
  gridItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    border: "none",
    background: "transparent",
    padding: 0,
    cursor: "pointer",
    fontSize: 11.5,
    fontWeight: 600,
    color: "#344054",
    textAlign: "center",
  },
  quickLinkHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    margin: "0 0 18px",
  },
  quickLinkIcon: {
    width: 68,
    height: 68,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    color: "#1e63d6",
    fontSize: 34,
    background: "#f4f7fc",
    boxShadow: "0 10px 24px rgba(15,23,42,.08)",
  },
  quickLinkIconImage: {
    width: 44,
    height: 44,
    objectFit: "contain",
  },
  quickLinkTitle: {
    color: "#0f172a",
    fontSize: 18,
    lineHeight: 1.25,
  },
  quickLinkRow: {
    padding: "14px 14px 2px",
    marginBottom: 12,
    borderRadius: 18,
    background: "#f8fafc",
    border: "1px solid #edf1f6",
  },
  quickLinkStepControls: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    margin: "4px 0 18px",
  },
  quickLinkActions: {
    display: "flex",
    gap: 10,
    marginTop: 4,
    paddingTop: 16,
    borderTop: "1px solid #eef0f3",
  },
  websiteLogoActions: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  websiteLogoUploadButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 40,
    padding: "7px 14px",
    border: "1px solid #d9d9d9",
    borderRadius: 10,
    background: "#fff",
    color: "#1e293b",
    cursor: "pointer",
    fontWeight: 600,
  },
  hiddenFileInput: {
    display: "none",
  },
} satisfies Record<string, CSSProperties>;

export const LINK_GRID_HOVER_CSS = `
.card-link-icon-badge {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.card-link-grid-item:hover .card-link-icon-badge {
  transform: scale(1.08);
  box-shadow: 0 4px 14px rgba(16, 24, 40, 0.18);
}
`;

export function getGridIconBadgeStyle(
  hasImage: boolean,
  tint: string,
): CSSProperties {
  if (hasImage) {
    return {
      width: 52,
      height: 52,
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff",
      border: "1px solid #eef0f3",
      boxShadow: "0 1px 3px rgba(16,24,40,0.08)",
    };
  }

  return {
    width: 52,
    height: 52,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: tint,
    color: "#fff",
    fontSize: 22,
    boxShadow: "0 1px 3px rgba(16,24,40,0.12)",
  };
}

export const gridIconImgStyle: CSSProperties = {
  width: 28,
  height: 28,
  objectFit: "contain",
};
