import type { CSSProperties } from "react";

export const styles = {
  field: {
    marginBottom: 10,
  },
  input: {
    background: "#f3f4f6",
    border: "1px solid transparent",
    borderRadius: 14,
    padding: "12px 16px",
    fontSize: 15,
    fontWeight: 700,
    textAlign: "center",
  },
  textarea: {
    textAlign: "left",
  },
  datePicker: {
    width: "100%",
  },
  hint: {
    display: "block",
    textAlign: "center",
    fontSize: 12,
    color: "#98a2b3",
    margin: "4px 0 0",
  },
} satisfies Record<string, CSSProperties>;
