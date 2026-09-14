import { ShareAltOutlined, TeamOutlined } from "@ant-design/icons";
import type { ReactNode, RefObject } from "react";
import { useCallback, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FrameContainerProvider } from "./FrameContainerContext";
import FirstLoginPasswordModal from "../auth/FirstLoginPasswordModal";
import PasswordExpiryWarningModal from "../auth/PasswordExpiryWarningModal";
import ChangePasswordModal from "../../pages/employee/parts/ChangePasswordModal";
import { SetClappPublicFooter } from "../business-card/parts/SetClappPublicFooter";
import BurgerIcon from "../shared/BurgerIcon";
import ConfirmActionModal from "../shared/ConfirmActionModal";
import ShareProfileSheet from "../shared/ShareProfileSheet";
import CompanyShareSheet from "../../pages/company-admin/shared/CompanyShareSheet";
import TopProgress from "../shared/TopProgress";
import { strings } from "../../constants/strings";
import { useMyCompany } from "../../hooks/useCompanies";
import { useEmployee } from "../../hooks/useEmployees";
import { useChangePassword } from "../../hooks/useUser";
import { logout } from "../../store/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setMobileDrawerOpen } from "../../store/uiSlice";
import type { ChangePasswordValues } from "../../types";
import { useAdminIdentity } from "./useAdminIdentity";
import { useSwipeDrawer } from "./useSwipeDrawer";
import { roleLabelMap, useNavItems } from "./useNavItems";
import CompanyAdminSidebar from "./CompanyAdminSidebar";

const COMPANY_CONTEXT_PATHS = [
  "/admin/statistics",
  "/admin/scan-logs",
  "/admin/import-export",
  "/admin/settings",
];

type SidebarContext = "admin" | "company";

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
  const navItems = useNavItems();
  const isCompanyAdmin = user?.role === "COMPANY_ADMIN";
  const cardRoute = isCompanyAdmin ? "/admin/card" : "/employee/profile";
  const { data: company } = useMyCompany(isCompanyAdmin);
  const { data: adminEmployee } = useEmployee(user?.id ?? "");

  const { adminName, adminPhotoUrl, companyName, companyLogoUrl } =
    useAdminIdentity(user, adminEmployee, company);

  const [switchPanelOpen, setSwitchPanelOpen] = useState(false);
  const isCompanyRoute =
    isCompanyAdmin &&
    (COMPANY_CONTEXT_PATHS.some((path) =>
      location.pathname.startsWith(path),
    ) ||
      location.search.includes("context=company"));
  const sidebarContext: SidebarContext =
    isCompanyAdmin && isCompanyRoute ? "company" : "admin";
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const changePassword = useChangePassword();

  const firstLoginLocked = user?.isFirstLogin === true;
  const passwordExpiredLocked =
    !firstLoginLocked &&
    user?.role !== "SUPER_ADMIN" &&
    typeof user?.daysUntilPasswordExpiry === "number" &&
    user.daysUntilPasswordExpiry <= 0;
  const accountLocked = firstLoginLocked || passwordExpiredLocked;

  const daysUntilExpiry = user?.daysUntilPasswordExpiry;
  const showExpiryWarning =
    !accountLocked &&
    user?.role !== "SUPER_ADMIN" &&
    typeof daysUntilExpiry === "number" &&
    daysUntilExpiry > 0 &&
    daysUntilExpiry <= 3;
  const dismissKey = user ? `pw-expiry-dismissed-${user.id}` : "";
  const [dismissedForDay, setDismissedForDay] = useState<number | null>(() =>
    dismissKey && localStorage.getItem(dismissKey)
      ? Number(localStorage.getItem(dismissKey))
      : null,
  );
  const expiryWarningOpen =
    showExpiryWarning && dismissedForDay !== daysUntilExpiry;

  const dismissExpiryWarning = () => {
    if (typeof daysUntilExpiry !== "number") return;
    setDismissedForDay(daysUntilExpiry);
    if (dismissKey) localStorage.setItem(dismissKey, String(daysUntilExpiry));
  };

  const handleChangePassword = async (values: ChangePasswordValues) => {
    await changePassword.mutateAsync({
      oldPassword: values.oldPassword || undefined,
      newPassword: values.newPassword,
    });
    setChangePasswordOpen(false);
  };
  const normalizedPathname = location.pathname.replace(/\/+$/, "") || "/";
  const isCardView =
    normalizedPathname === cardRoute &&
    !location.search.includes("view=team");

  const closeDrawer = () => {
    dispatch(setMobileDrawerOpen(false));
    setSwitchPanelOpen(false);
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

  const openOwnCard = () => {
    goTo(cardRoute);
  };

  const selectCompanyContext = () => {
    goTo(`${cardRoute}?context=company`);
  };

  const openTeam = () => {
    goTo(`${cardRoute}?context=company&view=team`);
  };

  const navButtons: ReactNode[] = [];

  if (isCompanyAdmin && sidebarContext === "company") {
    navButtons.push(
      <button
        key="team"
        type="button"
        className={`cadmin-nav-item ${
          location.search.includes("view=team") ? "cadmin-nav-item--active" : ""
        }`}
        disabled={accountLocked}
        onClick={openTeam}
      >
        <span className="cadmin-nav-icon">
          <TeamOutlined />
        </span>
        <span className="cadmin-nav-label">{strings.navigation.team}</span>
      </button>,
    );
  }

  navItems.forEach((item) => {
    const active =
      location.pathname.startsWith(item.key) &&
      !location.search.includes("view=team");
    navButtons.push(
      <button
        key={item.key}
        type="button"
        className={`cadmin-nav-item ${active ? "cadmin-nav-item--active" : ""}`}
        disabled={accountLocked}
        onClick={() => void goTo(item.key)}
      >
        <span className="cadmin-nav-icon">{item.icon}</span>
        <span className="cadmin-nav-label">{item.label}</span>
      </button>,
    );
  });

  navButtons.splice(
    2,
    0,
    <button
      key="share"
      type="button"
      className="cadmin-nav-item"
      disabled={accountLocked}
      onClick={() => {
        setShareOpen(true);
        closeDrawer();
      }}
    >
      <span className="cadmin-nav-icon">
        <ShareAltOutlined />
      </span>
      <span className="cadmin-nav-label">Paylaşmaq</span>
    </button>,
  );

  return (
    <div className="cadmin-root">
      <div
        ref={frameRef}
        className={`cadmin-frame ${drawerOpen ? "cadmin-frame--open" : ""}`}
      >
        <TopProgress />

        <CompanyAdminSidebar
          isCompanyAdmin={isCompanyAdmin}
          sidebarContext={sidebarContext}
          switchPanelOpen={switchPanelOpen}
          onToggleSwitchPanel={() => setSwitchPanelOpen((open) => !open)}
          companyLogoUrl={companyLogoUrl}
          companyName={companyName}
          adminPhotoUrl={adminPhotoUrl}
          adminName={adminName}
          roleLabel={user?.role ? roleLabelMap[user.role] : ""}
          onOpenOwnCard={openOwnCard}
          onSelectCompanyContext={selectCompanyContext}
          navButtons={navButtons}
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

          <header className="cadmin-topbar">
            <button
              type="button"
              className="cadmin-burger-btn"
              aria-label={drawerOpen ? "Menyunu bağla" : "Menyunu aç"}
              aria-expanded={drawerOpen}
              onClick={() => dispatch(setMobileDrawerOpen(!drawerOpen))}
            >
              <BurgerIcon open={drawerOpen} />
            </button>
            <span className="cadmin-topbar-spacer" />
          </header>

          <main
            className={`cadmin-content${isCardView ? " cadmin-content--card" : ""}`}
          >
            <div key={location.pathname} className="page-fade">
              {children}
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
        loading={changePassword.isPending}
        onSubmit={handleChangePassword}
        onCancel={() => setChangePasswordOpen(false)}
      />

      {sidebarContext === "company" && company ? (
        <CompanyShareSheet
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          company={company}
        />
      ) : (
        user &&
        adminEmployee && (
          <ShareProfileSheet
            open={shareOpen}
            onClose={() => setShareOpen(false)}
            employee={adminEmployee}
            employeeName={adminName}
          />
        )
      )}

      <ConfirmActionModal
        open={logoutOpen}
        title={strings.auth.logout}
        message="Çıxış etmək istədiyinizdən əminsiniz?"
        onConfirm={() => {
          setLogoutOpen(false);
          dispatch(logout());
        }}
        onCancel={() => setLogoutOpen(false)}
        okText="Bəli"
        cancelText="Xeyr"
        danger
      />
    </div>
  );
}
