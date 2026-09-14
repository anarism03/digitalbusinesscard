import type { CSSProperties } from "react";
import { COLORS, SIZES } from "../../constants/ui";

export const SIDER_WIDTH = 220;
export const SIDER_WIDTH_COLLAPSED = 80;

const BORDER = "1px solid var(--color-border)";

export const drawerStyles = {
  body: {
    padding: 0,
    background: "#fff",
    display: "flex",
    flexDirection: "column",
  } satisfies CSSProperties,
};

export const styles = {
  root: {
    minHeight: "100vh",
    background: COLORS.background,
    display: "flex",
    flexDirection: "column",
  },
  frame: {
    display: "flex",
    flex: "1 0 auto",
    minHeight: 0,
  },
  menu: {
    borderRight: 0,
    flex: 1,
    paddingTop: 12,
  },
  desktopSider: {
    position: "sticky",
    top: 0,
    height: "100vh",
    flexShrink: 0,
    background: "rgba(255,255,255,.97)",
    borderRight: BORDER,
    boxShadow: "8px 0 30px rgba(15,23,42,.035)",
    backdropFilter: "blur(18px) saturate(1.08)",
    zIndex: 200,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transition: "width 0.2s",
  },
  desktopLogo: {
    height: 64,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    borderBottom: BORDER,
    overflow: "hidden",
  },
  logoSubtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 1,
    marginTop: 5,
    whiteSpace: "nowrap",
    letterSpacing: 0.2,
  },
  navScroll: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
  },
  sidebarFooter: {
    padding: 12,
    borderTop: BORDER,
    flexShrink: 0,
  },
  desktopLogoutButton: {
    width: "100%",
    height: 44,
    color: "#e5484d",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 18px",
    borderBottom: BORDER,
    flexShrink: 0,
  },
  mobileLogoWrap: {
    display: "grid",
    gap: 3,
  },
  mobileLogoSubtitle: {
    color: COLORS.textMuted,
    fontSize: 10.5,
    lineHeight: 1,
    letterSpacing: 0.2,
  },
  mobileCloseButton: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "1px solid #eceef1",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    padding: 0,
  },
  closeIcon: {
    fontSize: 14,
    color: "#475467",
  },
  mobileNavScroll: {
    flex: 1,
    overflowY: "auto",
  },
  mobileDrawerFooter: {
    padding: 16,
    borderTop: BORDER,
    flexShrink: 0,
  },
  mobileLogoutButton: {
    width: "100%",
    height: 46,
    color: "#e5484d",
    fontWeight: 600,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
  },
  mainLayout: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    background: COLORS.background,
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(255,255,255,.9)",
    padding: "0 12px 0 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: BORDER,
    boxShadow: "0 8px 28px rgba(15,23,42,.045)",
    backdropFilter: "blur(18px) saturate(1.12)",
  },
  headerToggle: {
    flexShrink: 0,
  },
  profileButton: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
    minHeight: 42,
    padding: "5px 10px 5px 6px",
    borderRadius: 14,
    border: "1px solid rgba(30,99,214,.15)",
    background: "linear-gradient(145deg, #fff 0%, #f4f8ff 100%)",
    font: "inherit",
    boxShadow: "var(--shadow-sm)",
  },
  profileAvatar: {
    background: COLORS.primary,
    flexShrink: 0,
  },
  profileText: {
    lineHeight: 1.3,
    textAlign: "left",
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
  },
  profileName: {
    fontWeight: 600,
    color: "#262626",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  profileRole: {
    fontSize: 11,
    color: "#8c8c8c",
    whiteSpace: "nowrap",
  },
  profileChevron: {
    fontSize: 11,
    color: "#667085",
    flexShrink: 0,
    marginLeft: 2,
    transition: "transform 0.18s ease",
  },
  contentInner: {
    maxWidth: SIZES.contentMaxWidth,
    margin: "0 auto",
  },
} satisfies Record<string, CSSProperties>;

export const getMenuStyle = (disabled: boolean): CSSProperties => ({
  ...styles.menu,
  opacity: disabled ? 0.55 : 1,
});

export const getDesktopSiderStyle = (width: number): CSSProperties => ({
  ...styles.desktopSider,
  width,
});

export const getDesktopLogoStyle = (
  collapsed: boolean,
  locked = false,
): CSSProperties => ({
  ...styles.desktopLogo,
  padding: collapsed ? "0 10px" : "0 18px",
  width: "100%",
  border: "none",
  background: "transparent",
  font: "inherit",
  cursor: locked ? "not-allowed" : "pointer",
  opacity: locked ? 0.55 : 1,
});

export const getMobileLogoButtonStyle = (locked = false): CSSProperties => ({
  ...styles.mobileLogoWrap,
  border: "none",
  background: "transparent",
  padding: 0,
  textAlign: "left",
  font: "inherit",
  cursor: locked ? "not-allowed" : "pointer",
  opacity: locked ? 0.55 : 1,
});

export const getDesktopLogoutButtonStyle = (
  collapsed: boolean,
): CSSProperties => ({
  ...styles.desktopLogoutButton,
  justifyContent: collapsed ? "center" : "flex-start",
});

export const getMobileNavRowStyle = (
  active: boolean,
  locked: boolean,
): CSSProperties => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "16px 20px",
  border: "none",
  borderBottom: "1px solid #f2f4f7",
  background: active ? "#f5f9ff" : "transparent",
  color: active ? COLORS.primary : "#1f2937",
  fontSize: 15.5,
  fontWeight: active ? 700 : 500,
  textAlign: "left",
  cursor: locked ? "not-allowed" : "pointer",
  opacity: locked ? 0.55 : 1,
});

export const getMobileNavIconStyle = (active: boolean): CSSProperties => ({
  fontSize: 17,
  display: "flex",
  color: active ? COLORS.primary : "#8c98ac",
});

export const getHeaderStyle = (isDesktop: boolean): CSSProperties => ({
  ...styles.header,
  height: isDesktop ? 64 : 56,
  lineHeight: isDesktop ? "64px" : "56px",
});

export const getProfileButtonStyle = (isMedium: boolean): CSSProperties => ({
  ...styles.profileButton,
  width: isMedium ? 220 : 190,
});

export const getProfileNameStyle = (isMedium: boolean): CSSProperties => ({
  ...styles.profileName,
  fontSize: isMedium ? 13 : 12,
});

export const getProfileChevronStyle = (open: boolean): CSSProperties => ({
  ...styles.profileChevron,
  transform: open ? "rotate(180deg)" : "rotate(0deg)",
});

export const getContentStyle = (
  isLarge: boolean,
  isMedium: boolean,
): CSSProperties => ({
  padding: isLarge ? "28px 32px" : isMedium ? 20 : "12px 10px",
  boxSizing: "border-box",
  flex: 1,
});
