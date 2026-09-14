import type { ReactNode } from "react";
import { BankOutlined, LogoutOutlined, RightOutlined } from "@ant-design/icons";
import AssetAvatar from "../shared/AssetAvatar";
import { strings } from "../../constants/strings";

interface Props {
  isCompanyAdmin: boolean;
  sidebarContext: "admin" | "company";
  switchPanelOpen: boolean;
  onToggleSwitchPanel: () => void;
  companyLogoUrl?: string;
  companyName: string;
  adminPhotoUrl?: string;
  adminName: string;
  roleLabel: string;
  onOpenOwnCard: () => void;
  onSelectCompanyContext: () => void;
  navButtons: ReactNode[];
  onLogoutClick: () => void;
}

export default function CompanyAdminSidebar({
  isCompanyAdmin,
  sidebarContext,
  switchPanelOpen,
  onToggleSwitchPanel,
  companyLogoUrl,
  companyName,
  adminPhotoUrl,
  adminName,
  roleLabel,
  onOpenOwnCard,
  onSelectCompanyContext,
  navButtons,
  onLogoutClick,
}: Props) {
  return (
    <aside className="cadmin-sidebar">
      <button
        type="button"
        className={`cadmin-sidebar-head ${
          isCompanyAdmin ? "" : "cadmin-sidebar-head--static"
        }`}
        disabled={!isCompanyAdmin}
        onClick={isCompanyAdmin ? onToggleSwitchPanel : undefined}
      >
        {sidebarContext === "company" ? (
          <>
            <AssetAvatar
              shape="square"
              src={companyLogoUrl}
              name={companyName}
              icon={<BankOutlined />}
              size={40}
            />
            <span className="cadmin-sidebar-head-text">
              <span className="cadmin-sidebar-name">{companyName}</span>
              <span className="cadmin-sidebar-role">Şirkət profili</span>
            </span>
          </>
        ) : (
          <>
            <AssetAvatar src={adminPhotoUrl} name={adminName} size={40} />
            <span className="cadmin-sidebar-head-text">
              <span className="cadmin-sidebar-name">{adminName}</span>
              <span className="cadmin-sidebar-role">{roleLabel}</span>
            </span>
          </>
        )}
        {isCompanyAdmin && (
          <RightOutlined
            className={`cadmin-sidebar-chevron ${
              switchPanelOpen ? "cadmin-sidebar-chevron--open" : ""
            }`}
          />
        )}
      </button>

      {isCompanyAdmin && switchPanelOpen && (
        <div className="cadmin-switch-panel">
          <button
            type="button"
            className="cadmin-switch-row"
            onClick={onOpenOwnCard}
          >
            <AssetAvatar src={adminPhotoUrl} name={adminName} size={28} />
            <span>Şirkət Administratoru </span>
          </button>
          <button
            type="button"
            className="cadmin-switch-row"
            onClick={onSelectCompanyContext}
          >
            <AssetAvatar
              shape="square"
              src={companyLogoUrl}
              name={companyName}
              icon={<BankOutlined />}
              size={28}
            />
            <span>{companyName}</span>
          </button>
        </div>
      )}

      <nav className="cadmin-nav">{navButtons}</nav>

      <button type="button" className="cadmin-logout" onClick={onLogoutClick}>
        <LogoutOutlined /> {strings.auth.logout}
      </button>
    </aside>
  );
}
