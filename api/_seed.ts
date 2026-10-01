import type { Company, Employee } from "../src/types";

export type AppState = {
  companies: Company[];
  employees: Employee[];
  passwords: Record<string, string>;
  scans?: { id: string; employeeId: string; employeeName: string; companyId: string; scannedAt: string; source?: string }[];
  audit?: { id: string; createdAt: string; userName: string; userEmail: string; action: string; entityType: string; entityId: string; oldValues: Record<string, unknown>; newValues: Record<string, unknown> }[];
};

export function seed(): AppState {
  const companies: Company[] = [
    { id: "c-1", name: "Caspian Digital MMC", voen: "1234567890", address: "Bakı, Nizami küçəsi 90", email: "info@caspian.example", phone: "+994 12 404 20 20", userLimit: 25, isActive: true, nfcBaseUrl: "" },
    { id: "c-2", name: "Baku Creative Studio", voen: "2345678901", address: "Bakı, Xətai prospekti 12", email: "hello@bakucreative.example", phone: "+994 12 555 42 10", userLimit: 15, isActive: true },
    { id: "c-3", name: "AzTech Solutions", voen: "3456789012", address: "Bakı, Nobel prospekti 15", email: "office@aztech.example", phone: "+994 12 444 03 03", userLimit: 40, isActive: true },
    { id: "c-4", name: "Green Point Consulting", voen: "4567890123", address: "Sumqayıt, Sülh küçəsi 8", email: "contact@greenpoint.example", phone: "+994 18 642 15 15", userLimit: 12, isActive: false },
  ];
  const employees: Employee[] = [
    { id: "u-admin", companyId: "c-1", firstName: "Aysel", lastName: "Məmmədova", fullName: "Aysel Məmmədova", jobTitle: "Şirkət Administratoru", email: "admin@caspian.example", phone1: "+994 50 555 01 01", whatsappPhone: "+994 50 555 01 01", role: 1, isActive: true, canEdit: true, companyName: companies[0].name, linkedinUrl: "https://www.linkedin.com/", socialAccounts: [{ platformName: "website", profileUrl: "https://example.com", iconUrl: "" }] },
    { id: "u-leyla", companyId: "c-1", firstName: "Leyla", lastName: "Əliyeva", fullName: "Leyla Əliyeva", jobTitle: "Marketinq rəhbəri", email: "leyla@caspian.example", phone1: "+994 50 555 01 02", whatsappPhone: "+994 50 555 01 02", role: 2, isActive: true, canEdit: true, companyName: companies[0].name, linkedinUrl: "https://www.linkedin.com/", instagramUrl: "https://www.instagram.com/" },
    { id: "u-murad", companyId: "c-1", firstName: "Murad", lastName: "Hüseynov", fullName: "Murad Hüseynov", jobTitle: "Məhsul meneceri", email: "murad@caspian.example", phone1: "+994 55 555 01 03", role: 2, isActive: true, canEdit: true, companyName: companies[0].name },
    { id: "u-nigar", companyId: "c-1", firstName: "Nigar", lastName: "Quliyeva", fullName: "Nigar Quliyeva", jobTitle: "Dizayner", email: "nigar@caspian.example", phone1: "+994 70 555 01 04", role: 2, isActive: true, canEdit: false, companyName: companies[0].name },
    { id: "u-ramin", companyId: "c-1", firstName: "Ramin", lastName: "Abbasov", fullName: "Ramin Abbasov", jobTitle: "Satış mütəxəssisi", email: "ramin@caspian.example", phone1: "+994 51 555 01 05", role: 2, isActive: false, canEdit: true, companyName: companies[0].name },
    { id: "u-baku", companyId: "c-2", firstName: "Orxan", lastName: "Babayev", fullName: "Orxan Babayev", jobTitle: "Şirkət Administratoru", email: "admin@bakucreative.example", phone1: "+994 50 555 02 01", role: 1, isActive: true, canEdit: true, companyName: companies[1].name },
    { id: "u-aztech", companyId: "c-3", firstName: "Günel", lastName: "Həsənova", fullName: "Günel Həsənova", jobTitle: "Şirkət Administratoru", email: "admin@aztech.example", phone1: "+994 50 555 03 01", role: 1, isActive: true, canEdit: true, companyName: companies[2].name },
  ];
  return { companies, employees, passwords: {}, scans: [], audit: [] };
}
