import type { CSSProperties } from "react";
import { COLORS } from "../../constants/ui";

export const styles = {
  footer: {
    width: "100%",
    minHeight: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "10px 17px",
    background: "#fff",
    color: COLORS.textSecondary,
    fontSize: 12.5,
    fontWeight: 500,
    borderTop: "1px solid rgba(15,23,42,.06)",
    boxShadow: "none",
    marginTop: "auto",
  },
  logoLink: {
    display: "flex",
    alignItems: "center",
  },
} satisfies Record<string, CSSProperties>;
