import type { ThemeConfig } from "antd";

export const APP_THEME: ThemeConfig = {
  token: {
    colorPrimary: "#1b4a75",
    colorPrimaryHover: "#2a5d8f",
    colorPrimaryActive: "#123a5c",
    colorInfo: "#1b4a75",
    colorSuccess: "#16a34a",
    colorWarning: "#d98a0b",
    colorError: "#dc2626",
    colorBgBase: "#ffffff",
    colorBgContainer: "#ffffff",
    colorFillAlter: "#f7f8fa",
    borderRadius: 12,
    borderRadiusLG: 18,
    borderRadiusSM: 9,
    colorText: "#0f172a",
    colorTextSecondary: "#667085",
    colorBorderSecondary: "#eceef1",
    colorBgLayout: "#f3f5f8",
    controlHeight: 40,
    controlHeightLG: 48,
    lineHeight: 1.5,
    boxShadow: "0 2px 6px rgba(15,23,42,0.05), 0 14px 32px rgba(15,23,42,0.07)",
    boxShadowSecondary:
      "0 8px 20px rgba(15,23,42,0.08), 0 30px 70px rgba(15,23,42,0.13)",
    fontFamily: "'Poppins', system-ui, sans-serif",
  },
  components: {
    Layout: {
      bodyBg: "#f3f5f8",
    },
    Button: {
      fontWeight: 600,
      primaryShadow: "none",
      defaultShadow: "none",
      controlHeight: 40,
      borderRadius: 12,
    },
    Input: {
      controlHeight: 40,
      borderRadius: 12,
      activeShadow: "0 0 0 3px rgba(27,74,117,0.12)",
    },
    Card: { borderRadiusLG: 18 },
    Table: {
      headerBg: "#f7f8fa",
      headerColor: "#667085",
      borderColor: "#eef0f2",
    },
    Message: {
      contentBg: "rgba(255,255,255,0.96)",
      contentPadding: "12px 16px",
    },
    Skeleton: {
      gradientFromColor: "rgba(226,232,240,0.72)",
      gradientToColor: "rgba(248,250,252,0.96)",
    },
    Segmented: {
      borderRadius: 20,
      borderRadiusSM: 18,
      trackPadding: 5,
      boxShadowTertiary: "0 2px 8px rgba(15,23,42,0.12)",
      itemSelectedBg: "#ffffff",
    },
    DatePicker: {
      cellActiveWithRangeBg: "#e6eef6",
    },
  },
};
