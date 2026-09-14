import { lazy } from "react";
import type { ReactNode } from "react";
import type { Role } from "../types";

const CompaniesPage = lazy(() => import("../pages/super-admin/CompaniesPage"));
const SuperAdminDashboardPage = lazy(
  () => import("../pages/super-admin/DashboardPage"),
);
const CompanyFormPage = lazy(
  () => import("../pages/super-admin/CompanyFormPage"),
);
const AuditLogPage = lazy(() => import("../pages/company-admin/audit-log-page/AuditLogPage"));
const CardHomePage = lazy(
  () => import("../pages/company-admin/card-home-page/CardHomePage"),
);
const StatisticsPage = lazy(
  () => import("../pages/company-admin/statistics-page/StatisticsPage"),
);
const ScanLogsPage = lazy(
  () => import("../pages/company-admin/scan-logs-page/ScanLogsPage"),
);
const EmployeeFormPage = lazy(
  () => import("../pages/company-admin/employee-form-page/EmployeeFormPage"),
);
const ImportExportPage = lazy(
  () => import("../pages/company-admin/import-export-page/ImportExportPage"),
);
const SettingsPage = lazy(() => import("../pages/company-admin/settings-page/SettingsPage"));

export interface AppRoute {
  path: string;
  element: ReactNode;
}
export const routesByRole: Record<Role, AppRoute[]> = {
  SUPER_ADMIN: [
    { path: "/super-admin/dashboard", element: <SuperAdminDashboardPage /> },
    { path: "/super-admin/companies", element: <CompaniesPage /> },
    { path: "/super-admin/companies/new", element: <CompanyFormPage /> },
    { path: "/super-admin/companies/:id/edit", element: <CompanyFormPage /> },
    { path: "/super-admin/audit-log", element: <AuditLogPage /> },
  ],
  COMPANY_ADMIN: [
    { path: "/admin/card", element: <CardHomePage /> },
    { path: "/admin/statistics", element: <StatisticsPage /> },
    { path: "/admin/scan-logs", element: <ScanLogsPage /> },
    { path: "/admin/employees/new", element: <EmployeeFormPage /> },
    { path: "/admin/import-export", element: <ImportExportPage /> },
    { path: "/admin/settings", element: <SettingsPage /> },
  ],
  EMPLOYEE: [{ path: "/employee/profile", element: <CardHomePage /> }],
};
