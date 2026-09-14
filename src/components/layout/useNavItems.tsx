import { useAppSelector } from "../../store/hooks";
import {
  ADMIN_ITEMS,
  EMPLOYEE_ITEMS,
  SUPER_ADMIN_ITEMS,
} from "../../constants/navItems";
import type { NavItem } from "../../types";

export { roleLabelMap } from "../../constants/navItems";

export function useNavItems(): NavItem[] {
  const role = useAppSelector((s) => s.auth.user?.role);
  if (role === "SUPER_ADMIN") return SUPER_ADMIN_ITEMS;
  if (role === "COMPANY_ADMIN") return ADMIN_ITEMS;
  return EMPLOYEE_ITEMS;
}
