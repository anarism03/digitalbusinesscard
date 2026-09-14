import {
  CloseOutlined,
  DownOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Dropdown, Grid, Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import type { ReactNode } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FirstLoginPasswordModal from "../auth/FirstLoginPasswordModal";
import { SetClappPublicFooter } from "../business-card/parts/SetClappPublicFooter";
import AssetAvatar from "../shared/AssetAvatar";
import BurgerIcon from "../shared/BurgerIcon";
import ConfirmActionModal from "../shared/ConfirmActionModal";
import SetClappLogo from "../shared/SetClappLogo";
import TopProgress from "../shared/TopProgress";
import { strings } from "../../constants/strings";
import { logout } from "../../store/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setMobileDrawerOpen, toggleSidebar } from "../../store/uiSlice";
import {
  drawerStyles,
  getContentStyle,
  getDesktopLogoStyle,
  getDesktopLogoutButtonStyle,
  getDesktopSiderStyle,
  getHeaderStyle,
  getMenuStyle,
  getMobileLogoButtonStyle,
  getMobileNavIconStyle,
  getMobileNavRowStyle,
  getProfileButtonStyle,
  getProfileChevronStyle,
  getProfileNameStyle,
  SIDER_WIDTH,
  SIDER_WIDTH_COLLAPSED,
  styles,
} from "../../styles/layout/AppLayout.styles";
import { roleLabelMap, useNavItems } from "./useNavItems";

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

interface NavMenuProps {
  collapsed?: boolean;
  disabled?: boolean;
}

function NavMenu({ collapsed = false, disabled = false }: NavMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const items = useNavItems();
  const selectedKey =
    items.find((item) => location.pathname.startsWith(item.key))?.key ?? "";

  return (
    <Menu
      theme="light"
      mode="inline"
      inlineCollapsed={collapsed}
      selectedKeys={[selectedKey]}
      items={items as MenuProps["items"]}
      onClick={({ key }) => {
        if (!disabled) navigate(key);
      }}
      style={getMenuStyle(disabled)}
    />
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const mobileDrawerOpen = useAppSelector((state) => state.ui.mobileDrawerOpen);
  const dispatch = useAppDispatch();
  const screens = useBreakpoint();
  const location = useLocation();
  const navigate = useNavigate();
  const mobileNavItems = useNavItems();

  const isDesktop = Boolean(screens.lg);
  const isMedium = Boolean(screens.md);
  const siderWidth = sidebarCollapsed ? SIDER_WIDTH_COLLAPSED : SIDER_WIDTH;

  const [logoutOpen, setLogoutOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const firstLoginLocked =
    user?.role !== "SUPER_ADMIN" && user?.isFirstLogin === true;
  const homeKey = mobileNavItems[0]?.key;

  const goHome = () => {
    if (firstLoginLocked || !homeKey) return;
    navigate(homeKey);
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      label: (
        <span className="header-logout-menu-button">
          <LogoutOutlined />
          <span>{strings.auth.logout}</span>
        </span>
      ),
      onClick: () => setLogoutOpen(true),
    },
  ];

  const confirmLogout = () => {
    setLogoutOpen(false);
    dispatch(logout());
  };

  return (
    <Layout style={styles.root}>
      <TopProgress />
      <div style={styles.frame}>
        {isDesktop && (
          <div style={getDesktopSiderStyle(siderWidth)}>
            <button
              type="button"
              aria-label="İdarə panelinə qayıt"
              onClick={goHome}
              style={getDesktopLogoStyle(sidebarCollapsed, firstLoginLocked)}
            >
              <SetClappLogo height={sidebarCollapsed ? 28 : 38} />
              {!sidebarCollapsed && (
                <div style={styles.logoSubtitle}>Digital Business Card</div>
              )}
            </button>

            <div style={styles.navScroll}>
              <NavMenu
                collapsed={sidebarCollapsed}
                disabled={firstLoginLocked}
              />
            </div>

            <div style={styles.sidebarFooter}>
              <Button
                type="text"
                className="logout-outline-button"
                icon={<LogoutOutlined />}
                onClick={() => setLogoutOpen(true)}
                style={getDesktopLogoutButtonStyle(sidebarCollapsed)}
              >
                {!sidebarCollapsed && strings.auth.logout}
              </Button>
            </div>
          </div>
        )}

        <Drawer
          placement="left"
          open={!isDesktop && mobileDrawerOpen}
          onClose={() => dispatch(setMobileDrawerOpen(false))}
          width="100%"
          closable={false}
          styles={drawerStyles}
        >
          <div style={styles.drawerHeader}>
            <button
              type="button"
              aria-label="İdarə panelinə qayıt"
              onClick={() => {
                goHome();
                dispatch(setMobileDrawerOpen(false));
              }}
              style={getMobileLogoButtonStyle(firstLoginLocked)}
            >
              <SetClappLogo height={30} />
              <span style={styles.mobileLogoSubtitle}>
                Digital Business Card
              </span>
            </button>
            <button
              type="button"
              aria-label="Bağla"
              onClick={() => dispatch(setMobileDrawerOpen(false))}
              style={styles.mobileCloseButton}
            >
              <CloseOutlined style={styles.closeIcon} />
            </button>
          </div>

          <div
            key={mobileDrawerOpen ? "open" : "closed"}
            style={styles.mobileNavScroll}
          >
            {mobileNavItems.map((item) => {
              const active = location.pathname.startsWith(item.key);
              return (
                <button
                  key={item.key}
                  type="button"
                  className="mobile-nav-row"
                  disabled={firstLoginLocked}
                  onClick={() => {
                    navigate(item.key);
                    dispatch(setMobileDrawerOpen(false));
                  }}
                  style={getMobileNavRowStyle(active, firstLoginLocked)}
                >
                  <span style={getMobileNavIconStyle(active)}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>

          <div style={styles.mobileDrawerFooter}>
            <Button
              type="text"
              className="logout-outline-button"
              icon={<LogoutOutlined />}
              onClick={() => {
                dispatch(setMobileDrawerOpen(false));
                setLogoutOpen(true);
              }}
              style={styles.mobileLogoutButton}
            >
              {strings.auth.logout}
            </Button>
          </div>
        </Drawer>

        <Layout style={styles.mainLayout}>
          <Header style={getHeaderStyle(isDesktop)}>
            <Button
              type="text"
              size="large"
              aria-label="Menyu"
              icon={
                isDesktop ? (
                  sidebarCollapsed ? (
                    <MenuUnfoldOutlined />
                  ) : (
                    <MenuFoldOutlined />
                  )
                ) : (
                  <BurgerIcon open={mobileDrawerOpen} />
                )
              }
              onClick={() =>
                isDesktop
                  ? dispatch(toggleSidebar())
                  : dispatch(setMobileDrawerOpen(!mobileDrawerOpen))
              }
              style={styles.headerToggle}
            />

            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={["click"]}
              open={profileMenuOpen}
              onOpenChange={setProfileMenuOpen}
              overlayClassName="header-profile-dropdown"
            >
              <button
                type="button"
                className="header-profile-button"
                aria-label="Hesab menyusu"
                style={getProfileButtonStyle(isMedium)}
              >
                <AssetAvatar
                  src={user?.photoUrl}
                  name={user?.fullName}
                  size={32}
                  style={styles.profileAvatar}
                />
                <div style={styles.profileText}>
                  <div style={getProfileNameStyle(isMedium)}>
                    {user?.fullName}
                  </div>
                  <div style={styles.profileRole}>
                    {user?.role ? roleLabelMap[user.role] : ""}
                  </div>
                </div>
                <DownOutlined style={getProfileChevronStyle(profileMenuOpen)} />
              </button>
            </Dropdown>
          </Header>

          <Content style={getContentStyle(Boolean(screens.lg), isMedium)}>
            <div
              key={location.pathname}
              className="page-fade"
              style={styles.contentInner}
            >
              {children}
            </div>
          </Content>

          <SetClappPublicFooter />
        </Layout>
      </div>

      <FirstLoginPasswordModal open={firstLoginLocked} />

      <ConfirmActionModal
        open={logoutOpen}
        title={strings.auth.logout}
        message="Çıxış etmək istədiyinizdən əminsiniz?"
        onConfirm={confirmLogout}
        onCancel={() => setLogoutOpen(false)}
        okText="Bəli"
        cancelText="Xeyr"
        danger
      />
    </Layout>
  );
}
