import type { CSSProperties } from "react";

export const styles = {
  card: {
    borderRadius: 10,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  cardBody: {
    padding: "12px 14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 14,
    alignItems: "center",
    minHeight: 58,
  },
  avatarIcon: {
    fontSize: 24,
  },
  logoImage: {
    objectFit: "cover",
  },
  logoAvatar: {
    borderRadius: 12,
    background: "linear-gradient(135deg, #e7f1fd 0%, #cfe3fa 100%)",
    color: "#1e63d6",
    border: "1px solid #e6eefb",
    flexShrink: 0,
  },
  identityText: {
    minWidth: 0,
  },
  name: {
    fontWeight: 800,
    fontSize: 15,
    color: "#16224f",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  meta: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 3,
    fontSize: 12,
    color: "#667085",
  },
  address: {
    fontSize: 12,
    color: "#667085",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginTop: 2,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    justifySelf: "end",
    flexWrap: "wrap",
  },
  limitTag: {
    borderRadius: 8,
    fontSize: 12,
    padding: "3px 10px",
    marginInlineEnd: 0,
  },
  limitIcon: {
    marginRight: 6,
  },
} satisfies Record<string, CSSProperties>;
