import type { CSSProperties } from "react";
import { COLORS } from "../../constants/ui";

export const styles = {
  emptyStateIconBadge: {
    width: 64,
    height: 64,
    margin: "0 auto 4px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `linear-gradient(145deg, ${COLORS.primaryTint} 0%, #d8e6ff 100%)`,
    color: COLORS.primary,
    fontSize: 28,
  },
} satisfies Record<string, CSSProperties>;
