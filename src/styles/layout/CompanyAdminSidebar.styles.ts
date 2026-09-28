import type { CSSProperties } from "react";

export const styles = {
  companyAvatar: {
    width: 56,
    minWidth: 56,
    height: 40,
    background: "#eef4fa",
  },
  companyAvatarImage: {
    objectFit: "contain",
    padding: 3,
  },
} satisfies Record<string, CSSProperties>;
