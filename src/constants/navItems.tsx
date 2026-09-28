import {
  BarChartOutlined,
  ImportOutlined,
  SettingOutlined,
  BankOutlined,
  AuditOutlined,
  DashboardOutlined,
  UserOutlined,
  ScanOutlined,
} from "@ant-design/icons";
import { strings } from "./strings";
import type { NavItem } from "../types";

export const SUPER_ADMIN_ITEMS: NavItem[] = [
  {
    key: "/super-admin/dashboard",
    icon: <DashboardOutlined />,
    label: strings.navigation.dashboard,
  },
  {
    key: "/super-admin/companies",
    icon: <BankOutlined />,
    label: strings.navigation.companies,
  },
  {
    key: "/super-admin/audit-log",
    icon: <AuditOutlined />,
    label: strings.navigation.auditLogs,
  },
];

export const COMPANY_ADMIN_ITEMS: NavItem[] = [
  {
    key: "/admin/statistics",
    icon: <BarChartOutlined />,
    label: strings.navigation.statistics,
  },
  {
    key: "/admin/scan-logs",
    icon: <ScanOutlined />,
    label: strings.navigation.scanLogs,
  },
  {
    key: "/admin/import-export",
    icon: <ImportOutlined />,
    label: strings.navigation.importExport,
  },
  {
    key: "/admin/settings",
    icon: <SettingOutlined />,
    label: strings.navigation.settings,
  },
];

export const EMPLOYEE_ITEMS: NavItem[] = [
  {
    key: "/employee/profile",
    icon: <UserOutlined />,
    label: strings.navigation.profile,
  },
];
