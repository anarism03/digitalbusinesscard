import type { CSSProperties } from "react";
import { COLORS } from "../../constants/ui";

export const styles = {
  searchInput: {
    borderRadius: 14,
    borderColor: COLORS.borderSubtle,
    height: 46,
    marginBottom: 16,
  },
  searchIcon: {
    color: COLORS.textMuted,
  },
  companyList: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 10,
  },
  skeletonCard: {
    borderRadius: 10,
  },
} satisfies Record<string, CSSProperties>;
