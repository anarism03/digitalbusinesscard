import {
  EditOutlined,
  ShareAltOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { ReactNode, RefObject } from "react";
import { useCallback, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FrameContainerProvider } from "./FrameContainerContext";
import { TopbarTitleProvider } from "./TopbarTitleContext";
import CompanyAdminSidebar from "./CompanyAdminSidebar";
import ChangePasswordModal from "../auth/ChangePasswordModal";
import FirstLoginPasswordModal from "../auth/FirstLoginPasswordModal";
import LogoutConfirmModal from "../auth/LogoutConfirmModal";
import PasswordExpiryWarningModal from "../auth/PasswordExpiryWarningModal";
import SetClappPublicFooter from "../business-card/parts/SetClappPublicFooter";
import BurgerIcon from "../shared/BurgerIcon";
import ShareProfileSheet from "../shared/ShareProfileSheet";
import TopProgress from "../shared/TopProgress";
import CompanyShareSheet from "../../pages/company-admin/shared/CompanyShareSheet";
import { COMPANY_ADMIN_ITEMS, EMPLOYEE_ITEMS } from "../../constants/navItems";
import { ROLE_LABELS } from "../../constants/roles";
import { strings } from "../../constants/strings";
import { COLORS } from "../../constants/ui";
import { useAdminIdentity } from "../../hooks/useAdminIdentity";
import { useEmployeesPage } from "../../hooks/useEmployees";
import { useSwipeDrawer } from "../../hooks/useSwipeDrawer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setMobileDrawerOpen } from "../../store/uiSlice";
import type { SidebarNavItem } from "../../types";
import { parseCardViewParams } from "../../utils/cardViewParams";

export default function CompanyAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const getFrameContainer = useCallback(
    () => frameRef.current ?? document.body,
    [],
  );

  return (
    <FrameContainerProvider value={getFrameContainer}>
      <CompanyAdminLayoutContent frameRef={frameRef}>
        {children}
      </CompanyAdminLayoutContent>
    </FrameContainerProvider>
  );
}

function CompanyAdminLayoutContent({
  children,
  frameRef,
}: {
  children: ReactNode;
  frameRef: RefObject<HTMLDivElement>;
}) {
  const user = useAppSelector((state) => state.auth.user);
  const drawerOpen = useAppSelector((state) => state.ui.mobileDrawerOpen);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    company,
    employee,
    adminName,
    adminPhotoUrl,
    companyName,
    companyLogoUrl,
  } = useAdminIdentity();

  const isCompanyAdmin = user?.role === "COMPANY_ADMIN";
  const { data: employeePage } = useEmployeesPage(
    isCompanyAdmin ? (user?.companyId ?? "") : "",
    1,
    1,
  );
  const navItems = isCompanyAdmin ? COMPANY_ADMIN_ITEMS : EMPLOYEE_ITEMS;
  const cardRoute = isCompanyAdmin ? "/admin/card" : "/employee/profile";
  const cardViewParams = parseCardViewParams(
    new URLSearchParams(location.search),
  );
  const isCardRoute =
    (location.pathname.replace(/\/+$/, "") || "/") === cardRoute;
  const isTeamView = isCardRoute && cardViewParams.view === "team";
  const isCompanyContext =
    isCompanyAdmin &&
    (COMPANY_ADMIN_ITEMS.some((item) =>
      location.pathname.startsWith(item.key),
    ) ||
      location.pathname === "/admin/employees/new" ||
      cardViewParams.context === "company");
  const isCardView = isCardRoute && !isTeamView;
  const isCompanyInfoView =
    isCompanyAdmin &&
    isCardView &&
    cardViewParams.context === "company" &&
    !cardViewParams.employeeId;

  const [topbarTitle, setTopbarTitle] = useState<string>();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const firstLoginLocked = user?.isFirstLogin === true;
  const daysUntilExpiry = user?.daysUntilPasswordExpiry;
  const accountLocked =
    firstLoginLocked ||
    (typeof daysUntilExpiry === "number" && daysUntilExpiry <= 0);
  const showExpiryWarning =
    !accountLocked &&
    typeof daysUntilExpiry === "number" &&
    daysUntilExpiry <= 3;

  const dismissKey = user ? `pw-expiry-dismissed-${user.id}` : "";
  const [dismissedForDay, setDismissedForDay] = useState<number | null>(() => {
    const stored = dismissKey ? localStorage.getItem(dismissKey) : null;
    return stored ? Number(stored) : null;
  });
  const expiryWarningOpen =
    showExpiryWarning && dismissedForDay !== daysUntilExpiry;

  const dismissExpiryWarning = () => {
    if (typeof daysUntilExpiry !== "number") return;
    setDismissedForDay(daysUntilExpiry);
    if (dismissKey) localStorage.setItem(dismissKey, String(daysUntilExpiry));
  };

  const closeDrawer = () => {
    dispatch(setMobileDrawerOpen(false));
  };

  const { handleSwipeStart, handleSwipeEnd, cancelSwipe } = useSwipeDrawer(
    drawerOpen,
    () => dispatch(setMobileDrawerOpen(true)),
    closeDrawer,
  );

  const goTo = (path: string) => {
    navigate(path);
    closeDrawer();
  };

  const sidebarNavItems: SidebarNavItem[] = navItems.map((item) => ({
    ...item,
    active: location.pathname.startsWith(item.key) && !isTeamView,
    onClick: () => goTo(item.key),
  }));
  if (isCompanyAdmin) {
    sidebarNavItems.unshift({
      key: "team",
      icon: <TeamOutlined />,
      label: strings.navigation.team,
      active: isTeamView,
      onClick: () => goTo(`${cardRoute}?context=company&view=team`),
    });
  }
  sidebarNavItems.splice(2, 0, {
    key: "share",
    icon: <ShareAltOutlined />,
    label: "QR və Paylaşma",
    active: false,
    onClick: () => {
      setShareOpen(true);
      closeDrawer();
    },
  });

  return (
    <div className="cadmin-root">
      <div
        ref={frameRef}
        className={`cadmin-frame ${drawerOpen ? "cadmin-frame--open" : ""}`}
      >
        <TopProgress />

        <CompanyAdminSidebar
          isCompanyAdmin={isCompanyAdmin}
          companyLogoUrl={companyLogoUrl}
          companyName={companyName}
          companyUsedCount={employeePage?.totalCount}
          companyUserLimit={company?.userLimit}
          adminPhotoUrl={adminPhotoUrl}
          adminName={adminName}
          roleLabel={user ? ROLE_LABELS[user.role] : ""}
          navItems={sidebarNavItems}
          navDisabled={accountLocked}
          onOpenOwnCard={() => goTo(cardRoute)}
          onSelectCompanyContext={() => goTo(`${cardRoute}?context=company`)}
          onClose={closeDrawer}
          onLogoutClick={() => setLogoutOpen(true)}
        />

        <div
          className="cadmin-main"
          onPointerDown={handleSwipeStart}
          onPointerUp={handleSwipeEnd}
          onPointerCancel={cancelSwipe}
        >
          <button
            type="button"
            className="cadmin-scrim"
            aria-label="Menyunu bağla"
            tabIndex={drawerOpen ? 0 : -1}
            onClick={closeDrawer}
          />

          <header
            className={`cadmin-topbar${isCompanyInfoView ? " cadmin-topbar--company" : ""}${topbarTitle && !isCompanyInfoView ? " cadmin-topbar--expanded" : ""}`}
          >
            <button
              type="button"
              className="cadmin-burger-btn"
              aria-label={drawerOpen ? "Menyunu bağla" : "Menyunu aç"}
              aria-expanded={drawerOpen}
              onClick={() => dispatch(setMobileDrawerOpen(!drawerOpen))}
            >
              <BurgerIcon
                open={drawerOpen}
                color={isCompanyInfoView ? COLORS.primary : undefined}
              />
            </button>

            {isCompanyInfoView ? (
              <div className="cadmin-topbar-company-actions">
                <button
                  type="button"
                  aria-label="Şirkət məlumatlarını redaktə et"
                  onClick={() => goTo("/admin/settings")}
                >
                  <EditOutlined />
                </button>
                <button
                  type="button"
                  aria-label="Şirkəti paylaş"
                  disabled={!company}
                  onClick={() => setShareOpen(true)}
                >
                  <ShareAltOutlined />
                </button>
              </div>
            ) : topbarTitle ? (
              <div className="cadmin-topbar-titles">
                <span className="cadmin-topbar-title">{topbarTitle}</span>
                {companyName && (
                  <span className="cadmin-topbar-subtitle">{companyName}</span>
                )}
              </div>
            ) : (
              <span className="cadmin-topbar-spacer" />
            )}
          </header>

          <main
            className={`cadmin-content${isCardView ? " cadmin-content--card" : ""}`}
          >
            <div key={location.pathname} className="page-fade">
              <TopbarTitleProvider value={setTopbarTitle}>
                {children}
              </TopbarTitleProvider>
            </div>
          </main>
          <SetClappPublicFooter />
        </div>
      </div>

      <FirstLoginPasswordModal
        open={accountLocked}
        reason={firstLoginLocked ? "first-login" : "expired"}
      />

      {typeof daysUntilExpiry === "number" && (
        <PasswordExpiryWarningModal
          open={expiryWarningOpen}
          daysLeft={daysUntilExpiry}
          onClose={dismissExpiryWarning}
          onChangePassword={() => {
            dismissExpiryWarning();
            setChangePasswordOpen(true);
          }}
        />
      )}

      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />

      {isCompanyContext && company ? (
        <CompanyShareSheet
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          company={company}
        />
      ) : (
        employee && (
          <ShareProfileSheet
            open={shareOpen}
            onClose={() => setShareOpen(false)}
            employee={employee}
            employeeName={adminName}
          />
        )
      )}

      <LogoutConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
      />
    </div>
  );
}
