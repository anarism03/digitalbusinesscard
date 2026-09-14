export type Role = "SUPER_ADMIN" | "COMPANY_ADMIN" | "EMPLOYEE";

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
  "super-admin": "SUPER_ADMIN",
  super_admin: "SUPER_ADMIN",
  companyadmin: "COMPANY_ADMIN",
  "company-admin": "COMPANY_ADMIN",
  company_admin: "COMPANY_ADMIN",
  user: "EMPLOYEE",
  employee: "EMPLOYEE",
};
