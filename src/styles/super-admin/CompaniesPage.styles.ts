import type { CSSProperties } from "react";

export const styles = {
  companyList: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 10,
  },
  skeletonCard: {
    borderRadius: 10,
  },
  paginationWrap: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 16,
  },
} satisfies Record<string, CSSProperties>;
