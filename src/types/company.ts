export interface Company {
  id: string;
  name: string;
  voen?: string;
  logoUrl?: string;
  address?: string;
  email?: string;
  phone?: string;
  userLimit: number;
  usedCount?: number;
  adminEmail?: string;
  defaultPassword?: string;
  nfcBaseUrl?: string;
  isActive: boolean;
}

export interface CreateCompanyDto {
  name: string;
  voen?: string;
  logoUrl?: string;
  address?: string;
  email?: string;
  phone?: string;
  userLimit: number;
}

export interface UpdateCompanyDto {
  name?: string;
  voen?: string;
  address?: string;
  email?: string;
  phone?: string;
  logoUrl?: string;
  userLimit?: number;
  nfcBaseUrl?: string;
}

export interface PageResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface TopCompanyByScans {
  companyId: string;
  companyName: string;
  logoUrl?: string;
  isActive: boolean;
  scanCount: number;
}

export interface SuperAdminDashboardStats {
  companiesCount: number;
  activeCompaniesCount: number;
  inactiveCompaniesCount: number;
  recentCompanies: Company[];
  topCompaniesByScans: TopCompanyByScans[];
}

export interface CompanyAdminCredentials {
  email?: string;
  password?: string;
  voen?: string;
}
