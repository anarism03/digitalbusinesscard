import type { Company } from "../../types";

interface AuthUser {
  email: string;
  fullName?: string;
  photoUrl?: string;
}

interface AdminEmployee {
  fullName?: string;
  photoUrl?: string;
  companyName?: string;
  companyLogoUrl?: string;
}

function isPlaceholderName(value?: string): boolean {
  return !value?.trim() || /^string(?:\s+string)*$/i.test(value.trim());
}

export function useAdminIdentity(
  user: AuthUser | null | undefined,
  adminEmployee: AdminEmployee | undefined,
  company: Company | undefined,
) {
  const employeeFullName = adminEmployee?.fullName?.trim() ?? "";
  const tokenFullName = user?.fullName?.trim() ?? "";
  const adminName = !isPlaceholderName(employeeFullName)
    ? employeeFullName
    : !isPlaceholderName(tokenFullName)
      ? tokenFullName
      : user?.email || "Şirkət Administratoru";

  return {
    adminName,
    adminPhotoUrl: adminEmployee?.photoUrl || user?.photoUrl,
    companyName: adminEmployee?.companyName || company?.name || "Şirkət",
    companyLogoUrl: adminEmployee?.companyLogoUrl || company?.logoUrl,
  };
}
