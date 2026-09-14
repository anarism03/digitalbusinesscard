import type { CSSProperties } from "react";

export const styles = {
  formItem: {
    marginBottom: 16,
  },
  passwordItem: {
    marginBottom: 22,
  },
  inputIcon: {
    color: "#bfbfbf",
  },
  loginButton: {
    height: 50,
    background: "linear-gradient(140deg,#14248c 0%,#1f6fe5 55%,#16d3d6 100%)",
    border: "none",
    fontWeight: 700,
    fontSize: 16,
  },
} satisfies Record<string, CSSProperties>;
