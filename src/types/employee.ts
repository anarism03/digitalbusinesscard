export interface SocialAccount {
  platformName: string;
  profileUrl: string;
  iconUrl?: string;
}

export interface ContactInfo {
  contactType: string;
  value: string;
  label?: string;
  displayOrder?: number;
}

export interface Employee {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  fullName: string;
  jobTitle?: string;
  phone1?: string;
  phone2?: string;
  whatsappPhone?: string;
  extensionNumber?: string;
  additionalInfo?: string;
  email: string;
  role: number;
  isActive: boolean;
  canEdit?: boolean;
  photoUrl?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  googleMapsUrl?: string;
  address?: string;
  birthday?: string;
  cardBackgroundUrl?: string;
  socialAccounts?: SocialAccount[];
  contactInfos?: ContactInfo[];
  scanCount?: number;
  companyName?: string;
  companyLogoUrl?: string;
}

export interface CreateUserDto {
  companyId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  jobTitle: string;
  phone1: string;
  phone2?: string;
  whatsappPhone?: string;
  extensionNumber?: string;
  additionalInfo?: string;
  email: string;
  password: string;
  role: number;
  isActive: boolean;
  linkedinUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  googleMapsUrl?: string;
  address?: string;
  birthday?: string;
  socialAccounts?: SocialAccount[];
  contactInfos?: ContactInfo[];
}

export interface ResetPasswordDto {
  newPassword: string;
}

export interface UpdateUserProfileDto {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  jobTitle?: string;
  phone1?: string;
  phone2?: string;
  whatsappPhone?: string;
  extensionNumber?: string;
  additionalInfo?: string;
  photoUrl?: string;
  googleMapsUrl?: string;
  cardBackgroundUrl?: string;
  address?: string;
  birthday?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  socialAccounts?: SocialAccount[];
  contactInfos?: ContactInfo[];
}

export type TabKey = "active" | "inactive";

export interface EmployeeOption {
  label: string;
  value: string;
}
