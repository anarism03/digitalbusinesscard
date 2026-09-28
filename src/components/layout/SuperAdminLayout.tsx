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
import LogoutConfirmModal from "../auth/LogoutConfirmModal";
import SetClappPublicFooter from "../business-card/parts/SetClappPublicFooter";
import AssetAvatar from "../shared/AssetAvatar";
import BurgerIcon from "../shared/BurgerIcon";
import SetClappLogo from "../shared/SetClappLogo";
import TopProgress from "../shared/TopProgress";
import { ROLE_LABELS } from "../../constants/roles";
import { SUPER_ADMIN_ITEMS } from "../../constants/navItems";
import { strings } from "../../constants/strings";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setMobileDrawerOpen, toggleSidebar } from "../../store/uiSlice";
import {
  drawerStyles,
  getContentStyle,
  getDesktopLogoStyle,
  getDesktopLogoutButtonStyle,
  getDesktopSiderStyle,
  getHeaderStyle,
  getMobileNavIconStyle,
  getMobileNavRowStyle,
  getProfileButtonStyle,
  getProfileChevronStyle,
  getProfileNameStyle,
  SIDER_WIDTH,
  SIDER_WIDTH_COLLAPSED,
  styles,
} from "../../styles/layout/SuperAdminLayout.styles";

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

function NavMenu({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey =
    SUPER_ADMIN_ITEMS.find((item) => location.pathname.startsWith(item.key))
      ?.key ?? "";

  return (
    <Menu
      theme="light"
      mode="inline"
      inlineCollapsed={collapsed}
      selectedKeys={[selectedKey]}
      items={SUPER_ADMIN_ITEMS as MenuProps["items"]}
      onClick={({ key }) => navigate(key)}
      style={styles.menu}
    />
  );
}

export default function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = useAppSelector((state) => state.auth.user);
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const mobileDrawerOpen = useAppSelector((state) => state.ui.mobileDrawerOpen);
  const dispatch = useAppDispatch();
  const screens = useBreakpoint();
  const location = useLocation();
  const navigate = useNavigate();

  const isDesktop = Boolean(screens.lg);
  const isMedium = Boolean(screens.md);
  const siderWidth = sidebarCollapsed ? SIDER_WIDTH_COLLAPSED : SIDER_WIDTH;

  const [logoutOpen, setLogoutOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const goHome = () => navigate(SUPER_ADMIN_ITEMS[0].key);

  const closeDrawer = () => dispatch(setMobileDrawerOpen(false));

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
              style={getDesktopLogoStyle(sidebarCollapsed)}
            >
              <SetClappLogo height={sidebarCollapsed ? 28 : 38} />
              {!sidebarCollapsed && (
                <div style={styles.logoSubtitle}>Digital Business Card</div>
              )}
            </button>

            <div style={styles.navScroll}>
              <NavMenu collapsed={sidebarCollapsed} />
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
          onClose={closeDrawer}
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
                closeDrawer();
              }}
              style={styles.mobileLogoButton}
            >
              <SetClappLogo height={30} />
              <span style={styles.mobileLogoSubtitle}>
                Digital Business Card
              </span>
            </button>
            <button
              type="button"
              aria-label="Bağla"
              onClick={closeDrawer}
              style={styles.mobileCloseButton}
            >
              <CloseOutlined style={styles.closeIcon} />
            </button>
          </div>

          <div
            key={mobileDrawerOpen ? "open" : "closed"}
            style={styles.mobileNavScroll}
          >
            {SUPER_ADMIN_ITEMS.map((item) => {
              const active = location.pathname.startsWith(item.key);
              return (
                <button
                  key={item.key}
                  type="button"
                  className="mobile-nav-row"
                  onClick={() => {
                    navigate(item.key);
                    closeDrawer();
                  }}
                  style={getMobileNavRowStyle(active)}
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
                closeDrawer();
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
                    {user ? ROLE_LABELS[user.role] : ""}
                  </div>
                </div>
                <DownOutlined style={getProfileChevronStyle(profileMenuOpen)} />
              </button>
            </Dropdown>
          </Header>

          <Content style={getContentStyle(isDesktop, isMedium)}>
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

      <LogoutConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
      />
    </Layout>
  );
}
