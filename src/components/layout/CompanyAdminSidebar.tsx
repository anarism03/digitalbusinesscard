import { BankOutlined, CloseOutlined, RightOutlined } from "@ant-design/icons";
import AssetAvatar from "../shared/AssetAvatar";
import { strings } from "../../constants/strings";
import { styles } from "../../styles/layout/CompanyAdminSidebar.styles";
import type { SidebarNavItem } from "../../types";

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <g transform="scale(-1,1) translate(-24,0)">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </g>
    </svg>
  );
}

interface Props {
  isCompanyAdmin: boolean;
  companyLogoUrl?: string;
  companyName: string;
  companyUsedCount?: number;
  companyUserLimit?: number;
  adminPhotoUrl?: string;
  adminName: string;
  roleLabel: string;
  navItems: SidebarNavItem[];
  navDisabled: boolean;
  onOpenOwnCard: () => void;
  onSelectCompanyContext: () => void;
  onClose: () => void;
  onLogoutClick: () => void;
}

export default function CompanyAdminSidebar({
  isCompanyAdmin,
  companyLogoUrl,
  companyName,
  companyUsedCount,
  companyUserLimit,
  adminPhotoUrl,
  adminName,
  roleLabel,
  navItems,
  navDisabled,
  onOpenOwnCard,
  onSelectCompanyContext,
  onClose,
  onLogoutClick,
}: Props) {
  const usagePercent =
    companyUsedCount != null && companyUserLimit && companyUserLimit > 0
      ? Math.min(100, (companyUsedCount / companyUserLimit) * 100)
      : null;

  return (
    <aside className="cadmin-sidebar">
      <button
        type="button"
        className="cadmin-sidebar-close"
        aria-label="Menyunu bağla"
        onClick={onClose}
      >
        <CloseOutlined />
      </button>

      <div className="cadmin-sidebar-head-group">
        <button
          type="button"
          className="cadmin-sidebar-head"
          onClick={onOpenOwnCard}
        >
          <AssetAvatar src={adminPhotoUrl} name={adminName} size={40} />
          <span className="cadmin-sidebar-head-text">
            <span className="cadmin-sidebar-name">{adminName}</span>
            <span className="cadmin-sidebar-role">{roleLabel}</span>
          </span>
          <RightOutlined className="cadmin-sidebar-chevron" />
        </button>

        {isCompanyAdmin && (
          <button
            type="button"
            className="cadmin-sidebar-head"
            onClick={onSelectCompanyContext}
          >
            <AssetAvatar
              shape="square"
              src={companyLogoUrl}
              name={companyName}
              icon={<BankOutlined />}
              size={40}
              style={styles.companyAvatar}
              imageStyle={styles.companyAvatarImage}
            />
            <span className="cadmin-sidebar-head-text">
              <span className="cadmin-sidebar-name">{companyName}</span>
              {usagePercent !== null ? (
                <span className="cadmin-sidebar-usage-row">
                  <span className="cadmin-sidebar-usage-track">
                    <span
                      className="cadmin-sidebar-usage-fill"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </span>
                  <span className="cadmin-sidebar-usage-label">
                    {companyUsedCount} / {companyUserLimit}
                  </span>
                </span>
              ) : (
                <span className="cadmin-sidebar-role">Şirkət profili</span>
              )}
            </span>
            <RightOutlined className="cadmin-sidebar-chevron" />
          </button>
        )}
      </div>

      <nav className="cadmin-nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={
              item.active
                ? "cadmin-nav-item cadmin-nav-item--active"
                : "cadmin-nav-item"
            }
            disabled={navDisabled}
            onClick={item.onClick}
          >
            <span className="cadmin-nav-icon">{item.icon}</span>
            <span className="cadmin-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="cadmin-nav-divider" />

      <button type="button" className="cadmin-logout" onClick={onLogoutClick}>
        <LogoutIcon /> {strings.auth.logout}
      </button>
    </aside>
  );
}
