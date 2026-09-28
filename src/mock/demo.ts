import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { Company, Employee } from "../types";

// Demo state belongs to the browser. A fresh browser starts with the same seed.
const STORAGE_KEY = "setclapp-qa-demo-v1";
const demoPassword = "Demo123!";
type DemoState = { companies: Company[]; employees: Employee[]; passwords: Record<string, string> };

function seed(): DemoState {
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
  return { companies, employees, passwords: {} };
}

function read(): DemoState {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") as DemoState | null;
    if (parsed && Array.isArray(parsed.companies) && Array.isArray(parsed.employees)) return parsed;
  } catch { /* Private browsing can disable storage. */ }
  return seed();
}
const state = read();
function persist() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Session still works. */ } }
function fullName(e: Employee) { return [e.firstName, e.lastName, e.middleName].filter(Boolean).join(" "); }
function company(id?: string) { return state.companies.find(c => c.id === id); }
function employee(id?: string) { return state.employees.find(e => e.id === id); }
function decorate(e: Employee) { const c = company(e.companyId); return { ...e, fullName: fullName(e), companyName: c?.name, companyLogoUrl: c?.logoUrl }; }
function decoratedCompany(c: Company) { return { ...c, usedCount: state.employees.filter(e => e.companyId === c.id).length }; }
function page<T>(items: T[], params: URLSearchParams) {
  const size = Math.max(1, Number(params.get("pageSize") || 20));
  const current = Math.max(1, Number(params.get("page") || 1));
  return { items: items.slice((current - 1) * size, current * size), totalCount: items.length };
}
function body(config: InternalAxiosRequestConfig): Record<string, unknown> {
  if (typeof config.data === "string") { try { return JSON.parse(config.data); } catch { return {}; } }
  return config.data && typeof config.data === "object" ? config.data as Record<string, unknown> : {};
}
function encodeToken(user: { id: string; email: string; firstName: string; lastName: string; role: string; companyId?: string | null; canEdit?: boolean }) {
  const payload = { sub: user.id, email: user.email, name: `${user.firstName} ${user.lastName}`, role: user.role, companyId: user.companyId, canEdit: user.canEdit };
  const encode = (value: object) => btoa(unescape(encodeURIComponent(JSON.stringify(value)))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return `${encode({ alg: "none", typ: "JWT" })}.${encode(payload)}.demo`;
}
function activeUser() {
  try { const auth = JSON.parse(localStorage.getItem("dbc-auth") || "null"); return auth?.user as { id: string; role: string; companyId: string } | undefined; } catch { return undefined; }
}
function error(message: string, status = 400): never { throw Object.assign(new Error(message), { response: { status, data: { message } } }); }
const date = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString();
function scans(companyId?: string) {
  const list = state.employees.filter(e => e.isActive && (!companyId || e.companyId === companyId));
  return Array.from({ length: 135 }, (_, i) => {
    const e = list[i % list.length];
    return e && { id: `scan-${i}`, employeeId: e.id, employeeName: fullName(e), companyId: e.companyId, scannedAt: date(i % 48 + (i % 4) / 10) };
  }).filter((x): x is NonNullable<typeof x> => !!x);
}
function filteredScans(params: URLSearchParams) {
  const start = params.get("startDate"), end = params.get("endDate");
  return scans(params.get("companyId") || undefined).filter(s =>
    (!params.get("employeeId") || s.employeeId === params.get("employeeId")) &&
    (!start || s.scannedAt >= start) && (!end || s.scannedAt <= end));
}
async function workbookBlob(rows: string[][]) {
  const XLSX = await import("xlsx");
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), "Əməkdaşlar");
  return new Blob([XLSX.write(workbook, { type: "array", bookType: "xlsx" })], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
function htmlCard(e: Employee) {
  return new Blob([`<!doctype html><html lang="az"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(fullName(e))}</title><body style="font-family:Arial;max-width:500px;margin:10vh auto;padding:24px;color:#193754"><h1>${escapeHtml(fullName(e))}</h1><p>${escapeHtml(e.jobTitle || "")}</p><p>${escapeHtml(company(e.companyId)?.name || "")}</p><p>${escapeHtml(e.email)}</p><p>${escapeHtml(e.phone1 || "")}</p></body></html>`], { type: "text/html;charset=utf-8" });
}
function escapeHtml(value: string) { return value.replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[s] || s); }

async function respond(config: InternalAxiosRequestConfig): Promise<unknown> {
  const url = new URL(config.url || "/", location.origin);
  const path = url.pathname.replace(/^\/api(?=\/)/i, "");
  const params = new URLSearchParams(url.search);
  for (const [k, v] of Object.entries(config.params || {})) if (v != null) params.set(k, String(v));
  const method = config.method?.toUpperCase() || "GET";
  const data = body(config);
  const current = activeUser();
  const companyId = current?.companyId || "c-1";
  const currentEmployee = employee(current?.id) || employee("u-admin")!;
  let match: RegExpMatchArray | null;

  if (path === "/Auth/login" && method === "POST") {
    const email = String(data.email || "").trim().toLowerCase();
    const password = String(data.password || "");
    if (email === "superadmin@setclapp.example" && password === demoPassword && !data.companyVoen) {
      return { accessToken: encodeToken({ id: "u-super", email, firstName: "Admin", lastName: "SetClapp", role: "SUPER_ADMIN" }), isFirstLogin: false };
    }
    const e = state.employees.find(x => x.email.toLowerCase() === email);
    if (!e || (state.passwords[e.id] || demoPassword) !== password) error("E-poçt və ya şifrə yanlışdır", 401);
    const c = company(e.companyId);
    if (c?.voen !== data.companyVoen) error("Şirkət VÖEN-i yanlışdır");
    if (!c?.isActive || !e.isActive) error("Hesab deaktiv edilib", 403);
    return { accessToken: encodeToken({ ...e, role: e.role === 1 ? "COMPANY_ADMIN" : "EMPLOYEE" }), isFirstLogin: false };
  }
  if (path === "/Auth/account-info") return current?.role === "SUPER_ADMIN" ? { firstName: "Admin", lastName: "SetClapp", isFirstLogin: false } : { ...decorate(currentEmployee), isFirstLogin: false };
  if (path === "/Auth/change-password" && method === "POST") { if (current) { state.passwords[current.id] = String(data.newPassword); persist(); } return { success: true }; }

  if (path === "/SuperAdmin/dashboard") {
    return { companiesCount: state.companies.length, activeCompaniesCount: state.companies.filter(c => c.isActive).length, inactiveCompaniesCount: state.companies.filter(c => !c.isActive).length, recentCompanies: state.companies.slice().reverse().map(decoratedCompany), topCompaniesByScans: state.companies.map((c, i) => ({ companyId: c.id, companyName: c.name, isActive: c.isActive, scanCount: 340 - i * 68 })) };
  }
  if (path === "/SuperAdmin/companies" && method === "GET") return page(state.companies.map(decoratedCompany), params);
  if (path === "/SuperAdmin/companies" && method === "POST") {
    if (state.companies.some(c => c.voen === data.voen)) error("Bu VÖEN-də şirkət artıq mövcuddur");
    const c = { ...data, id: crypto.randomUUID(), isActive: true } as unknown as Company;
    state.companies.push(c);
    const admin: Employee = { id: crypto.randomUUID(), companyId: c.id, firstName: "Şirkət", lastName: "Admini", fullName: "Şirkət Admini", jobTitle: "Şirkət Administratoru", email: c.email || `admin-${c.id}@example.com`, phone1: c.phone, role: 1, isActive: true, canEdit: true };
    state.employees.push(admin); persist();
    return { company: decoratedCompany(c), adminEmail: c.email, defaultPassword: demoPassword };
  }
  if ((match = path.match(/^\/SuperAdmin\/companies\/([^/]+)(?:\/(active|limit))?$/))) {
    const c = company(match[1]); if (!c) error("Şirkət tapılmadı", 404);
    if (method === "GET") return decoratedCompany(c!);
    if (match[2] === "active") c!.isActive = params.get("isActive") === "true";
    else if (match[2] === "limit") c!.userLimit = Number(config.data);
    else Object.assign(c!, data);
    persist(); return decoratedCompany(c!);
  }
  if (path === "/CompanyAdmin/company") {
    const c = company(companyId); if (!c) error("Şirkət tapılmadı", 404);
    if (method === "PUT") { Object.assign(c!, data); persist(); }
    return decoratedCompany(c!);
  }

  if ((match = path.match(/^\/CompanyAdmin\/users\/company\/([^/]+)$/))) return page(state.employees.filter(e => e.companyId === match![1]).map(decorate), params);
  if (path === "/CompanyAdmin/users" && method === "POST") {
    const e = { ...data, id: crypto.randomUUID(), canEdit: true } as unknown as Employee;
    e.fullName = fullName(e); state.employees.push(e); persist(); return decorate(e);
  }
  if ((match = path.match(/^\/CompanyAdmin\/users\/([^/]+)(?:\/(active|canedit|reset-password|nfc-link))?$/))) {
    const e = employee(match[1]); if (!e) error("Əməkdaş tapılmadı", 404);
    if (match[2] === "nfc-link") return { nfcUrl: `${location.origin}/v/${e!.id}/nfc` };
    if (match[2] === "active") e!.isActive = params.get("isActive") === "true";
    else if (match[2] === "canedit") e!.canEdit = params.get("canEdit") === "true";
    else if (match[2] === "reset-password") state.passwords[e!.id] = String(data.newPassword || demoPassword);
    else Object.assign(e!, data);
    persist(); return decorate(e!);
  }
  if ((match = path.match(/^\/User\/([^/]+)$/))) { const e = employee(match[1]); if (!e) error("Əməkdaş tapılmadı", 404); return decorate(e!); }
  if (path === "/User/profile" && method === "PUT") { Object.assign(currentEmployee, data); persist(); return decorate(currentEmployee); }
  if ((match = path.match(/^\/cards\/([^/]+)$/))) {
    const e = employee(match[1]); if (!e) error("Vizitkart tapılmadı", 404);
    if (!e!.isActive || !company(e!.companyId)?.isActive) error("Vizitkart deaktiv edilib", 403);
    return decorate(e!);
  }

  if (path === "/Analytics/scans/count") return filteredScans(params).length;
  if (path === "/Analytics/scans/chart") {
    const counts = new Map<string, number>();
    for (const s of filteredScans(params)) { const day = s.scannedAt.slice(0, 10); counts.set(day, (counts.get(day) || 0) + 1); }
    return [...counts].sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({ date, count }));
  }
  if (path === "/Analytics/employees/ranking") {
    const counts = new Map<string, number>();
    for (const s of filteredScans(params)) counts.set(s.employeeId, (counts.get(s.employeeId) || 0) + 1);
    return [...counts].map(([id, scanCount]) => ({ employeeId: id, fullName: fullName(employee(id)!), jobTitle: employee(id)?.jobTitle, scanCount })).sort((a, b) => b.scanCount - a.scanCount);
  }
  if (path === "/Analytics/scans/logs") return page(filteredScans(params), params);
  if (path === "/AuditLog") return page(Array.from({ length: 27 }, (_, i) => ({ id: `audit-${i}`, createdAt: date(i / 3), userName: i % 3 ? "Aysel Məmmədova" : "Admin SetClapp", userEmail: i % 3 ? "admin@caspian.example" : "superadmin@setclapp.example", action: i % 3 === 0 ? "CREATE" : i % 3 === 1 ? "UPDATE" : "ACTIVATE", entityType: i % 2 ? "User" : "Company", entityId: i % 2 ? "u-leyla" : "c-1", oldValues: i % 2 ? { jobTitle: "Mütəxəssis" } : { name: "Əvvəlki şirkət adı" }, newValues: i % 2 ? { jobTitle: "Marketinq rəhbəri" } : { name: "Caspian Digital MMC" } })), params);

  if (path.startsWith("/ExportImport/")) {
    if (path.includes("/html/")) {
      const id = path.split("/").pop();
      if (path.includes("/user/")) return htmlCard(employee(id) || currentEmployee);
      const selected = Array.isArray(config.data) ? config.data : (() => { try { return JSON.parse(String(config.data)); } catch { return []; } })();
      const list = state.employees.filter(e => e.companyId === (path.includes("selected") ? companyId : id) && (!path.includes("selected") || selected.includes(e.id)));
      return new Blob([`<!doctype html><html lang="az"><meta charset="utf-8"><title>Vizitkartlar</title><body style="font-family:Arial;max-width:720px;margin:30px auto">${list.map(e => `<article style="border:1px solid #ddd;border-radius:12px;padding:20px;margin:12px"><h2>${escapeHtml(fullName(e))}</h2><p>${escapeHtml(e.jobTitle || "")}</p><p>${escapeHtml(e.email)} · ${escapeHtml(e.phone1 || "")}</p></article>`).join("")}</body></html>`], { type: "text/html;charset=utf-8" });
    }
    if (path.match(/\/vcf\//)) {
      const e = employee(path.split("/").pop()) || currentEmployee;
      return new Blob([`BEGIN:VCARD\r\nVERSION:3.0\r\nFN:${fullName(e)}\r\nEMAIL:${e.email}\r\nTEL:${e.phone1 || ""}\r\nEND:VCARD\r\n`], { type: "text/vcard" });
    }
    if (path.includes("/import/")) {
      const form = config.data as FormData;
      const file = form?.get?.("file");
      if (!(file instanceof File)) error("Excel faylı seçilməyib");
      const XLSX = await import("xlsx");
      const workbook = XLSX.read(await file!.arrayBuffer(), { type: "array" });
      const rows = XLSX.utils.sheet_to_json<string[]>(workbook.Sheets[workbook.SheetNames[0]], { header: 1 }).slice(1);
      const companyForImport = path.split("/").pop() || companyId;
      let created = 0;
      const errors: string[] = [];
      rows.forEach((row, index) => {
        const [firstName, lastName, jobTitle, email, phone1] = row.map(x => String(x ?? "").trim());
        if (!firstName || !lastName || !email?.includes("@")) { errors.push(`Sətir ${index + 2}: ad, soyad və düzgün e-poçt tələb olunur`); return; }
        if (state.employees.some(e => e.email.toLowerCase() === email.toLowerCase())) { errors.push(`Sətir ${index + 2}: e-poçt artıq mövcuddur`); return; }
        const e: Employee = { id: crypto.randomUUID(), companyId: companyForImport, firstName, lastName, fullName: `${firstName} ${lastName}`, jobTitle, email, phone1, role: 2, isActive: true, canEdit: true };
        state.employees.push(e); created++;
      });
      persist(); return { created, failed: errors.length, errors };
    }
    const selected = Array.isArray(config.data) ? config.data : (() => { try { return JSON.parse(String(config.data)); } catch { return []; } })();
    const list = path.endsWith("template") ? [] : state.employees.filter(e => e.companyId === companyId && (!path.includes("selected") || selected.includes(e.id)));
    return workbookBlob([["Ad", "Soyad", "Vəzifə", "E-poçt", "Telefon"], ...list.map(e => [e.firstName, e.lastName, e.jobTitle || "", e.email, e.phone1 || ""])]);
  }
  error(`Demo sorğusu tanınmadı: ${method} ${path}`, 404);
}

export const demoAdapter: AxiosAdapter = async config => {
  // No browser request ever leaves the QA build.
  await new Promise(resolve => setTimeout(resolve, 120));
  const result = await respond(config);
  return { data: result, status: 200, statusText: "OK", headers: {}, config } as AxiosResponse;
};
