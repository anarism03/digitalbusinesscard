import type { CSSProperties } from "react";

const messageBoxBase: CSSProperties = {
  background: "#fff",
  borderRadius: 22,
  border: "1px solid rgba(15,23,42,.07)",
  boxShadow: "var(--shadow-lg)",
};

export const styles = {
  centerBox: {
    minHeight: "100dvh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    background:
      "radial-gradient(90% 70% at 50% 0%, #e8f2ff 0%, #f3f6fa 56%, #eef1f5 100%)",
  },
  messageCard: {
    ...messageBoxBase,
    padding: "40px 24px",
    maxWidth: 360,
    width: "100%",
    textAlign: "center",
  },
  inactiveBody: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 28px",
    textAlign: "center",
  },
  loadingCard: {
    ...messageBoxBase,
    width: "100%",
    maxWidth: 390,
    padding: "32px 24px",
  },
  messageIcon: {
    fontSize: 48,
  },
  inactiveIconBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "linear-gradient(145deg, #eef3fb 0%, #dde8f7 100%)",
    marginBottom: 16,
  },
  inactiveIcon: {
    fontSize: 30,
    color: "#5b6b8c",
  },
  messageTitle: {
    marginTop: 16,
    fontFamily: "var(--font-display)",
    fontSize: 19,
    fontWeight: 750,
  },
  inactiveTitle: {
    margin: 0,
    fontSize: "clamp(15px, 4.2vw, 19px)",
    color: "#344054",
    fontWeight: 600,
    lineHeight: 1.4,
    whiteSpace: "nowrap",
  },
  messageSubtitle: {
    color: "#667085",
    fontSize: 14,
    lineHeight: 1.55,
  },
} satisfies Record<string, CSSProperties>;

export const getMessageIconStyle = (color: string): CSSProperties => ({
  ...styles.messageIcon,
  color,
});

export const getMessageTitleStyle = (color?: string): CSSProperties => ({
  ...styles.messageTitle,
  color,
});
