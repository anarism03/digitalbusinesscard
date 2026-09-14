import type { AuditLogEntry, Company, Employee, ScanLog } from "../types";

export const MOCK_COMPANY_ID = "demo-company-1";

export const DEMO_ACCOUNTS = {
  superAdmin: { email: "admin@demo.com", password: "demo1234" },
  companyAdmin: { email: "company@demo.com", password: "demo1234" },
  employee: { email: "employee@demo.com", password: "demo1234" },
} as const;

export const mockSuperAdminUser = {
  id: "user-super-admin",
  email: DEMO_ACCOUNTS.superAdmin.email,
  fullName: "Super Admin",
};

export let mockCompany: Company = {
  id: MOCK_COMPANY_ID,
  name: "SetClapp Demo MMC",
  voen: "1234567890",
  logoUrl: "/setclapp-logo.svg",
  address: "Bakı, Nizami küç. 203",
  email: "info@setclapp-demo.az",
  phone: "+994 12 555 00 00",
  userLimit: 25,
  usedCount: 8,
  adminEmail: DEMO_ACCOUNTS.companyAdmin.email,
  nfcBaseUrl: "https://demo.setclapp.com/v",
  isActive: true,
};

export function updateMockCompany(patch: Partial<Company>): Company {
  mockCompany = { ...mockCompany, ...patch };
  return mockCompany;
}

export const otherMockCompanies: Company[] = [
  {
    id: "demo-company-2",
    name: "Bakı Tekstil ASC",
    voen: "9876543210",
    address: "Bakı, Xətai rayonu",
    email: "info@bakitekstil.az",
    phone: "+994 12 444 11 22",
    userLimit: 15,
    usedCount: 12,
    adminEmail: "admin@bakitekstil.az",
    isActive: true,
  },
  {
    id: "demo-company-3",
    name: "Şimal İnşaat MMC",
    voen: "5556667778",
    address: "Sumqayıt",
    email: "info@shimalinshaat.az",
    phone: "+994 18 222 33 44",
    userLimit: 10,
    usedCount: 3,
    adminEmail: "admin@shimalinshaat.az",
    isActive: false,
  },
];

export let mockEmployees: Employee[] = [
  {
    id: "user-admin",
    companyId: MOCK_COMPANY_ID,
    firstName: "Aygün",
    lastName: "Məmmədova",
    fullName: "Aygün Məmmədova",
    jobTitle: "Şirkət Administratoru",
    phone1: "+994 50 111 22 33",
    email: DEMO_ACCOUNTS.companyAdmin.email,
    role: 1,
    isActive: true,
    canEdit: true,
    scanCount: 14,
    companyName: mockCompany.name,
    companyLogoUrl: mockCompany.logoUrl,
  },
  {
    id: "emp-1",
    companyId: MOCK_COMPANY_ID,
    firstName: "Elvin",
    lastName: "Həsənov",
    fullName: "Elvin Həsənov",
    jobTitle: "Baş Mühəndis",
    phone1: "+994 50 222 33 44",
    email: DEMO_ACCOUNTS.employee.email,
    role: 2,
    isActive: true,
    canEdit: true,
    scanCount: 47,
    companyName: mockCompany.name,
    companyLogoUrl: mockCompany.logoUrl,
  },
  {
    id: "emp-2",
    companyId: MOCK_COMPANY_ID,
    firstName: "Nərmin",
    lastName: "Əliyeva",
    fullName: "Nərmin Əliyeva",
    jobTitle: "Marketinq Meneceri",
    phone1: "+994 55 333 44 55",
    email: "nermin.aliyeva@demo.com",
    role: 2,
    isActive: true,
    canEdit: false,
    scanCount: 32,
    companyName: mockCompany.name,
    companyLogoUrl: mockCompany.logoUrl,
  },
  {
    id: "emp-3",
    companyId: MOCK_COMPANY_ID,
    firstName: "Tural",
    lastName: "Quliyev",
    fullName: "Tural Quliyev",
    jobTitle: "Satış Təmsilçisi",
    phone1: "+994 51 444 55 66",
    email: "tural.quliyev@demo.com",
    role: 2,
    isActive: true,
    canEdit: true,
    scanCount: 61,
    companyName: mockCompany.name,
    companyLogoUrl: mockCompany.logoUrl,
  },
  {
    id: "emp-4",
    companyId: MOCK_COMPANY_ID,
    firstName: "Səbinə",
    lastName: "Rzayeva",
    fullName: "Səbinə Rzayeva",
    jobTitle: "HR Mütəxəssisi",
    phone1: "+994 70 555 66 77",
    email: "sebine.rzayeva@demo.com",
    role: 2,
    isActive: true,
    canEdit: false,
    scanCount: 19,
    companyName: mockCompany.name,
    companyLogoUrl: mockCompany.logoUrl,
  },
  {
    id: "emp-5",
    companyId: MOCK_COMPANY_ID,
    firstName: "Kamran",
    lastName: "İsmayılov",
    fullName: "Kamran İsmayılov",
    jobTitle: "IT Meneceri",
    phone1: "+994 50 666 77 88",
    email: "kamran.ismayilov@demo.com",
    role: 2,
    isActive: false,
    canEdit: true,
    scanCount: 8,
    companyName: mockCompany.name,
    companyLogoUrl: mockCompany.logoUrl,
  },
  {
    id: "emp-6",
    companyId: MOCK_COMPANY_ID,
    firstName: "Ləman",
    lastName: "Vəliyeva",
    fullName: "Ləman Vəliyeva",
    jobTitle: "Mühasib",
    phone1: "+994 55 777 88 99",
    email: "leman.veliyeva@demo.com",
    role: 2,
    isActive: true,
    canEdit: false,
    scanCount: 25,
    companyName: mockCompany.name,
    companyLogoUrl: mockCompany.logoUrl,
  },
  {
    id: "emp-7",
    companyId: MOCK_COMPANY_ID,
    firstName: "Orxan",
    lastName: "Nəsirov",
    fullName: "Orxan Nəsirov",
    jobTitle: "Layihə Meneceri",
    phone1: "+994 51 888 99 00",
    email: "orxan.nesirov@demo.com",
    role: 2,
    isActive: true,
    canEdit: true,
    scanCount: 38,
    companyName: mockCompany.name,
    companyLogoUrl: mockCompany.logoUrl,
  },
  {
    id: "emp-8",
    companyId: MOCK_COMPANY_ID,
    firstName: "Günel",
    lastName: "Abbasova",
    fullName: "Günel Abbasova",
    jobTitle: "Dizayner",
    phone1: "+994 70 999 00 11",
    email: "gunel.abbasova@demo.com",
    role: 2,
    isActive: true,
    canEdit: true,
    scanCount: 29,
    companyName: mockCompany.name,
    companyLogoUrl: mockCompany.logoUrl,
  },
];

export function findEmployee(id: string): Employee | undefined {
  return mockEmployees.find((employee) => employee.id === id);
}

export function findEmployeeByEmail(email: string): Employee | undefined {
  return mockEmployees.find(
    (employee) => employee.email.toLowerCase() === email.toLowerCase(),
  );
}

export function upsertEmployee(id: string, patch: Partial<Employee>): Employee | undefined {
  const index = mockEmployees.findIndex((employee) => employee.id === id);
  if (index === -1) return undefined;
  mockEmployees[index] = { ...mockEmployees[index], ...patch };
  return mockEmployees[index];
}

export function addEmployee(employee: Employee): void {
  mockEmployees = [...mockEmployees, employee];
}

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export const mockScanLogs: ScanLog[] = Array.from({ length: 18 }, (_, index) => {
  const employee = mockEmployees[(index % (mockEmployees.length - 1)) + 1];
  return {
    id: `scan-${index + 1}`,
    scannedAt: daysAgo(index),
    employeeId: employee.id,
    employeeName: employee.fullName,
    photoUrl: employee.photoUrl,
  };
});

export const mockScanChart = Array.from({ length: 14 }, (_, index) => ({
  date: daysAgo(13 - index).slice(0, 10),
  count: Math.floor(10 + Math.random() * 40),
}));

export const mockAuditLog: AuditLogEntry[] = [
  {
    id: "audit-1",
    createdAt: daysAgo(0),
    userId: "user-admin",
    userEmail: DEMO_ACCOUNTS.companyAdmin.email,
    userName: "Aygün Məmmədova",
    action: "UPDATE",
    entityType: "Employee",
    entityId: "emp-3",
    changes: [{ label: "Vəzifə", from: "Satış Meneceri", to: "Satış Təmsilçisi" }],
  },
  {
    id: "audit-2",
    createdAt: daysAgo(1),
    userId: "user-admin",
    userEmail: DEMO_ACCOUNTS.companyAdmin.email,
    userName: "Aygün Məmmədova",
    action: "CREATE",
    entityType: "Employee",
    entityId: "emp-8",
    changes: [{ label: "Ad", to: "Günel Abbasova" }],
  },
  {
    id: "audit-3",
    createdAt: daysAgo(2),
    userId: "user-admin",
    userEmail: DEMO_ACCOUNTS.companyAdmin.email,
    userName: "Aygün Məmmədova",
    action: "DEACTIVATE",
    entityType: "Employee",
    entityId: "emp-5",
    changes: [{ label: "Status", from: "Aktiv", to: "Deaktiv" }],
  },
  {
    id: "audit-4",
    createdAt: daysAgo(4),
    userId: "user-admin",
    userEmail: DEMO_ACCOUNTS.companyAdmin.email,
    userName: "Aygün Məmmədova",
    action: "UPDATE",
    entityType: "Company",
    entityId: MOCK_COMPANY_ID,
    changes: [{ label: "Ünvan", from: "Köhnə ünvan", to: "Bakı, Nizami küç. 203" }],
  },
  {
    id: "audit-5",
    createdAt: daysAgo(6),
    userId: "user-admin",
    userEmail: DEMO_ACCOUNTS.companyAdmin.email,
    userName: "Aygün Məmmədova",
    action: "RESET_PASSWORD",
    entityType: "Employee",
    entityId: "emp-2",
    changes: [],
  },
];
