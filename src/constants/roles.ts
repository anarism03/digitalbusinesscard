import { strings } from "./strings";
import type { Role } from "../types";

export const ROLE_MAP: Record<number, Role> = {
  0: "SUPER_ADMIN",
  1: "COMPANY_ADMIN",
  2: "EMPLOYEE",
};

export const ROLE_TO_NUM: Record<Role, number> = {
  SUPER_ADMIN: 0,
  COMPANY_ADMIN: 1,
  EMPLOYEE: 2,
};

export const ROLE_NAME_MAP: Record<string, Role> = {
  superadmin: "SUPER_ADMIN",
  companyadmin: "COMPANY_ADMIN",
  employee: "EMPLOYEE",
  user: "EMPLOYEE",
};

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: strings.auth.superAdminRole,
  COMPANY_ADMIN: strings.auth.companyAdminRole,
  EMPLOYEE: strings.auth.employeeRole,
};
