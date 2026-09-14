import type { Role } from "./role";
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  fullName: string;
  role: Role;
  companyId: string | null;
  canEdit?: boolean;
  photoUrl?: string;
  isFirstLogin?: boolean;
  daysUntilPasswordExpiry?: number;
}
