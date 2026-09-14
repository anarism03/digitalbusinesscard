import type { CSSProperties } from "react";

export const styles = {
  title: {
    fontSize: 14,
  },
  titleIcon: {
    marginRight: 8,
    color: "#1e63d6",
  },
  card: {
    marginBottom: 16,
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  bankIcon: {
    fontSize: 29,
  },
  logoImage: {
    objectFit: "cover",
  },
  logoAvatar: {
    borderRadius: 14,
    background: "#e7f1fd",
    color: "#1e63d6",
    border: "1px solid #dbe8fb",
    flexShrink: 0,
  },
  voenTag: {
    fontFamily: "monospace",
  },
  divider: {
    margin: "12px 0",
  },
} satisfies Record<string, CSSProperties>;
