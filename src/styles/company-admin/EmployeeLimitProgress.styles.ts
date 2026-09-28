import type { CSSProperties } from "react";
import { COLORS } from "../../constants/ui";

export const styles = {
  progressRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: COLORS.textSubtle,
    whiteSpace: "nowrap",
  },
  progressTrack: {
    flex: 1,
    height: 7,
    borderRadius: 10,
    background: COLORS.avatarMuted,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
  },
} satisfies Record<string, CSSProperties>;
