import type { ReactNode } from "react";

export interface MobileBottomSheetProps {
  open: boolean;
  title?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  heightMode?: "content" | "large";
  rootClassName?: string;
}

export interface NavItem {
  key: string;
  icon: ReactNode;
  label: string;
}

export interface SidebarNavItem extends NavItem {
  active: boolean;
  onClick: () => void;
}
