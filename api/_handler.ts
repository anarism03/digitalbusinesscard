import { randomBytes, randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import type { Company, Employee } from "../src/types";
import type { AppState } from "./_seed";
import { hashPassword, issueToken, type Session, verifyPassword } from "./_auth";

export class HttpError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

type Result = { value: unknown; dirty?: boolean };
type Input = { path: string; method: string; params: URLSearchParams; body: unknown; origin: string; uploads?: Map<string, string> };

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
function str(value: unknown): string { return typeof value === "string" ? value.trim() : ""; }
function bad(message: string, status = 400): never { throw new HttpError(message, status); }
function requireRole(session: Session | null, ...roles: Session["role"][]) {
  if (!session) bad("Giriş tələb olunur", 401);
  if (!roles.includes(session.role)) bad("İcazə yoxdur", 403);
  return session;
}
function page<T>(items: T[], params: URLSearchParams) {
  const size = Math.min(100, Math.max(1, Number(params.get("pageSize") || 20)));
  const current = Math.max(1, Number(params.get("page") || 1));
  return { items: items.slice((current - 1) * size, current * size), totalCount: items.length };
}
function name(e: Employee) { return [e.firstName, e.lastName, e.middleName].filter(Boolean).join(" "); }
function escapeHtml(value: string) { return value.replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[s] || s); }
function freshPassword() { return randomBytes(12).toString("base64url"); }
function safeEmployeeInput(data: Record<string, unknown>) {
  const allowed = ["firstName", "lastName", "middleName", "jobTitle", "phone1", "phone2", "whatsappPhone", "extensionNumber", "additionalInfo", "email", "photoUrl", "linkedinUrl", "facebookUrl", "instagramUrl", "googleMapsUrl", "address", "birthday", "cardBackgroundUrl", "socialAccounts", "contactInfos"];
  return Object.fromEntries(allowed.filter(k => Object.prototype.hasOwnProperty.call(data, k)).map(k => [k, data[k]]));
}
function safeCompanyInput(data: Record<string, unknown>) {
  const allowed = ["name", "voen", "logoUrl", "address", "email", "phone", "userLimit", "nfcBaseUrl"];
  return Object.fromEntries(allowed.filter(k => Object.prototype.hasOwnProperty.call(data, k)).map(k => [k, data[k]]));
}

export async function storeImages(value: unknown, uploads = new Map<string, string>()): Promise<unknown> {
  if (typeof value === "string" && value.startsWith("data:image/")) {
    if (uploads.has(value)) return uploads.get(value);
    const match = /^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=]+)$/.exec(value);
    if (!match) bad("Şəkil formatı dəstəklənmir");
    const bytes = Buffer.from(match[2], "base64");
    if (bytes.length > 2 * 1024 * 1024) bad("Şəkil maksimum 2 MB olmalıdır");
    const valid = match[1] === "image/png" ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : match[1] === "image/jpeg" ? bytes[0] === 0xff && bytes[1] === 0xd8
      : match[1] === "image/webp" ? bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP"
      : bytes.toString("ascii", 0, 4) === "GIF8";
    if (!valid) bad("Şəkil faylı yanlışdır");
    const ext = match[1].split("/")[1].replace("jpeg", "jpg");
    const blob = await put(`images/${randomUUID()}.${ext}`, bytes, {
      access: "public", contentType: match[1], addRandomSuffix: false,
    });
    uploads.set(value, blob.url);
    return blob.url;
  }
  if (Array.isArray(value)) return Promise.all(value.map(item => storeImages(item, uploads)));
  if (value && typeof value === "object" && !(typeof File !== "undefined" && value instanceof File)) {
    const entries = await Promise.all(Object.entries(value).map(async ([key, item]) => [key, await storeImages(item, uploads)] as const));
    return Object.fromEntries(entries);
  }
  return value;
}

export async function execute(input: Input, state: AppState, session: Session | null): Promise<Result> {
  const { path, method, params, origin } = input;
  const data = record(input.body);
  const company = (id?: string) => state.companies.find(c => c.id === id);
  const employee = (id?: string) => state.employees.find(e => e.id === id);
  const decorate = (e: Employee) => ({ ...e, fullName: name(e), companyName: company(e.companyId)?.name, companyLogoUrl: company(e.companyId)?.logoUrl });
  const decoratedCompany = (c: Company) => ({ ...c, usedCount: state.employees.filter(e => e.companyId === c.id).length });
  const own = session?.role === "SUPER_ADMIN" ? undefined : employee(session?.sub);
  if (session && session.role !== "SUPER_ADMIN" && (!own?.isActive || !company(own.companyId)?.isActive || (session.role === "COMPANY_ADMIN") !== (own.role === 1))) bad("Hesab aktiv deyil", 401);
  const companyId = own?.companyId;
  const sameCompany = (id?: string) => session?.role === "SUPER_ADMIN" || (!!companyId && id === companyId);
  const admin = () => requireRole(session, "COMPANY_ADMIN");
  let match: RegExpMatchArray | null;

  if (path === "/Auth/login" && method === "POST") {
    const email = str(data.email).toLowerCase();
    const password = str(data.password);
    if (!email || !password) bad("E-poçt və şifrə tələb olunur");
    if (email === "superadmin@setclapp.example" && !data.companyVoen && verifyPassword(password, state.passwords["u-super"])) {
      return { value: { accessToken: issueToken({ sub: "u-super", role: "SUPER_ADMIN" }), isFirstLogin: false } };
    }
    const found = state.employees.find(e => e.email.toLowerCase() === email);
    if (!found || !verifyPassword(password, state.passwords[found.id]) || company(found.companyId)?.voen !== data.companyVoen) bad("E-poçt, VÖEN və ya şifrə yanlışdır", 401);
    if (!found.isActive || !company(found.companyId)?.isActive) bad("Hesab deaktiv edilib", 403);
    return { value: { accessToken: issueToken({ sub: found.id, role: found.role === 1 ? "COMPANY_ADMIN" : "EMPLOYEE", companyId: found.companyId }), isFirstLogin: false } };
  }
  if (path === "/Auth/account-info" && method === "GET") {
    requireRole(session, "SUPER_ADMIN", "COMPANY_ADMIN", "EMPLOYEE");
    return { value: session?.role === "SUPER_ADMIN" ? { firstName: "Admin", lastName: "SetClapp", isFirstLogin: false } : { ...decorate(own!), isFirstLogin: false } };
  }
  if (path === "/Auth/change-password" && method === "POST") {
    requireRole(session, "SUPER_ADMIN", "COMPANY_ADMIN", "EMPLOYEE");
    const password = str(data.newPassword);
    if (password.length < 8) bad("Şifrə minimum 8 simvol olmalıdır");
    if (!verifyPassword(str(data.oldPassword), state.passwords[session!.sub])) bad("Köhnə şifrə yanlışdır", 403);
    state.passwords[session!.sub] = hashPassword(password);
    return { value: { success: true }, dirty: true };
  }

  if ((match = path.match(/^\/cards\/([^/]+)$/)) && method === "GET") {
    const e = employee(match[1]);
    if (!e || !e.isActive || !company(e.companyId)?.isActive) bad("Vizitkart tapılmadı", 404);
    state.scans ??= [];
    state.scans.push({ id: randomUUID(), employeeId: e.id, employeeName: name(e), companyId: e.companyId, scannedAt: new Date().toISOString(), source: params.get("source") || undefined });
    return { value: decorate(e), dirty: true };
  }

  if (path === "/SuperAdmin/dashboard" && method === "GET") {
    requireRole(session, "SUPER_ADMIN");
    return { value: { companiesCount: state.companies.length, activeCompaniesCount: state.companies.filter(c => c.isActive).length, inactiveCompaniesCount: state.companies.filter(c => !c.isActive).length, recentCompanies: state.companies.slice().reverse().map(decoratedCompany), topCompaniesByScans: state.companies.map(c => ({ companyId: c.id, companyName: c.name, logoUrl: c.logoUrl, isActive: c.isActive, scanCount: (state.scans || []).filter(s => s.companyId === c.id).length })) } };
  }
  if (path === "/SuperAdmin/companies") {
    requireRole(session, "SUPER_ADMIN");
    if (method === "GET") return { value: page(state.companies.map(decoratedCompany), params) };
    if (method === "POST") {
      const fields = safeCompanyInput(data);
      if (!str(fields.name) || !str(fields.voen) || !str(fields.email)) bad("Şirkət adı, VÖEN və e-poçt tələb olunur");
      if (state.companies.some(c => c.voen === fields.voen)) bad("Bu VÖEN-də şirkət artıq mövcuddur");
      const c = { ...await storeImages(fields, input.uploads) as Record<string, unknown>, id: randomUUID(), isActive: true } as unknown as Company;
      state.companies.push(c);
      const password = freshPassword();
      const e: Employee = { id: randomUUID(), companyId: c.id, firstName: "Şirkət", lastName: "Admini", fullName: "Şirkət Admini", email: c.email!, role: 1, isActive: true, canEdit: true };
      state.employees.push(e);
      state.passwords[e.id] = hashPassword(password);
      return { value: { company: decoratedCompany(c), adminEmail: e.email, defaultPassword: password }, dirty: true };
    }
  }
  if ((match = path.match(/^\/SuperAdmin\/companies\/([^/]+)(?:\/(active|limit))?$/))) {
    requireRole(session, "SUPER_ADMIN");
    const c = company(match[1]); if (!c) bad("Şirkət tapılmadı", 404);
    if (method === "GET") return { value: decoratedCompany(c) };
    if (method === "PUT") {
      if (match[2] === "active") c.isActive = params.get("isActive") === "true";
      else if (match[2] === "limit") c.userLimit = Number(input.body);
      else Object.assign(c, await storeImages(safeCompanyInput(data), input.uploads));
      return { value: decoratedCompany(c), dirty: true };
    }
  }
  if (path === "/CompanyAdmin/company") {
    requireRole(session, "COMPANY_ADMIN", "EMPLOYEE");
    const c = company(companyId); if (!c) bad("Şirkət tapılmadı", 404);
    if (method === "GET") return { value: decoratedCompany(c) };
    if (method === "PUT") { admin(); Object.assign(c, await storeImages(safeCompanyInput(data), input.uploads)); return { value: decoratedCompany(c), dirty: true }; }
  }
  if ((match = path.match(/^\/CompanyAdmin\/users\/company\/([^/]+)$/)) && method === "GET") {
    requireRole(session, "COMPANY_ADMIN", "EMPLOYEE");
    if (!sameCompany(match[1])) bad("İcazə yoxdur", 403);
    return { value: page(state.employees.filter(e => e.companyId === match![1]).map(decorate), params) };
  }
  if (path === "/CompanyAdmin/users" && method === "POST") {
    admin();
    if (data.companyId !== companyId) bad("İcazə yoxdur", 403);
    const email = str(data.email).toLowerCase();
    if (!email.includes("@") || !str(data.firstName) || !str(data.lastName) || str(data.password).length < 8) bad("Əməkdaş məlumatları yanlışdır");
    if (state.employees.some(e => e.email.toLowerCase() === email)) bad("E-poçt artıq mövcuddur");
    const c = company(companyId)!;
    if (state.employees.filter(e => e.companyId === companyId).length >= c.userLimit) bad("Əməkdaş limiti dolub");
    const e = { ...await storeImages(safeEmployeeInput(data), input.uploads) as Record<string, unknown>, id: randomUUID(), companyId, role: Number(data.role) === 1 ? 1 : 2, isActive: data.isActive !== false, canEdit: true } as unknown as Employee;
    e.fullName = name(e); state.employees.push(e);
    state.passwords[e.id] = hashPassword(str(data.password));
    return { value: decorate(e), dirty: true };
  }
  if ((match = path.match(/^\/CompanyAdmin\/users\/([^/]+)(?:\/(active|canedit|reset-password|nfc-link))?$/))) {
    requireRole(session, "COMPANY_ADMIN", "EMPLOYEE");
    const e = employee(match[1]); if (!e || !sameCompany(e.companyId)) bad("Əməkdaş tapılmadı", 404);
    if (match[2] === "nfc-link" && method === "GET") return { value: { nfcUrl: `${origin}/v/${e.id}/nfc` } };
    if (method === "PUT" && !match[2]) {
      if (session?.role !== "COMPANY_ADMIN" && !(session?.sub === e.id && e.canEdit)) bad("İcazə yoxdur", 403);
      Object.assign(e, await storeImages(safeEmployeeInput(data), input.uploads)); e.fullName = name(e);
      return { value: decorate(e), dirty: true };
    }
    admin();
    if (match[2] === "active" && method === "PUT") e.isActive = params.get("isActive") === "true";
    else if (match[2] === "canedit" && method === "PUT") e.canEdit = params.get("canEdit") === "true";
    else if (match[2] === "reset-password" && method === "POST") { if (str(data.newPassword).length < 8) bad("Şifrə minimum 8 simvol olmalıdır"); state.passwords[e.id] = hashPassword(str(data.newPassword)); }
    else bad("Sorğu tapılmadı", 404);
    return { value: decorate(e), dirty: true };
  }
  if ((match = path.match(/^\/User\/([^/]+)$/)) && method === "GET") {
    requireRole(session, "SUPER_ADMIN", "COMPANY_ADMIN", "EMPLOYEE");
    const e = employee(match[1]); if (!e || !sameCompany(e.companyId)) bad("Əməkdaş tapılmadı", 404);
    return { value: decorate(e) };
  }
  if (path === "/User/profile" && method === "PUT") {
    requireRole(session, "COMPANY_ADMIN", "EMPLOYEE");
    if (!own?.canEdit) bad("Redaktəyə icazə yoxdur", 403);
    Object.assign(own, await storeImages(safeEmployeeInput(data), input.uploads)); own.fullName = name(own);
    return { value: decorate(own), dirty: true };
  }

  return executeReports(input, state, session, own);
}

async function executeReports(input: Input, state: AppState, session: Session | null, own?: Employee): Promise<Result> {
  const { path, method, params } = input;
  const companyId = own?.companyId;
  const employees = state.employees;
  const scanList = (state.scans || []).filter(s => !companyId || s.companyId === companyId);
  const scans = scanList.filter(s => (!params.get("companyId") || s.companyId === params.get("companyId")) && (!params.get("employeeId") || s.employeeId === params.get("employeeId")) && (!params.get("startDate") || s.scannedAt >= params.get("startDate")!) && (!params.get("endDate") || s.scannedAt <= params.get("endDate")!));
  if (path.startsWith("/Analytics/")) {
    requireRole(session, "SUPER_ADMIN", "COMPANY_ADMIN", "EMPLOYEE");
    if (session?.role !== "SUPER_ADMIN" && params.get("companyId") && params.get("companyId") !== companyId) bad("İcazə yoxdur", 403);
    if (path === "/Analytics/scans/count") return { value: scans.length };
    if (path === "/Analytics/scans/logs") return { value: page(scans, params) };
    if (path === "/Analytics/scans/chart") {
      const counts = new Map<string, number>();
      for (const s of scans) { const day = s.scannedAt.slice(0, 10); counts.set(day, (counts.get(day) || 0) + 1); }
      return { value: [...counts].sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({ date, count })) };
    }
    if (path === "/Analytics/employees/ranking") {
      const counts = new Map<string, number>();
      for (const s of scans) counts.set(s.employeeId, (counts.get(s.employeeId) || 0) + 1);
      return { value: [...counts].map(([id, scanCount]) => ({ employeeId: id, fullName: name(employees.find(e => e.id === id)!), jobTitle: employees.find(e => e.id === id)?.jobTitle, scanCount })).sort((a, b) => b.scanCount - a.scanCount) };
    }
  }
  if (path === "/AuditLog" && method === "GET") {
    requireRole(session, "SUPER_ADMIN");
    return { value: page((state.audit || []).slice().reverse(), params) };
  }
  if (path.startsWith("/ExportImport/")) {
    requireRole(session, "COMPANY_ADMIN", "EMPLOYEE");
    const id = path.split("/").pop() || "";
    if (path.includes("/html/")) {
      const list = path.includes("/user/") ? employees.filter(e => e.id === id && e.companyId === companyId) : employees.filter(e => e.companyId === companyId && (!path.includes("selected") || (Array.isArray(input.body) && input.body.includes(e.id))));
      if (path.includes("/user/") && !list.length) bad("Əməkdaş tapılmadı", 404);
      const html = `<!doctype html><html lang="az"><meta charset="utf-8"><body style="font-family:Arial;max-width:720px;margin:30px auto">${list.map(e => `<article><h2>${escapeHtml(name(e))}</h2><p>${escapeHtml(e.jobTitle || "")}</p><p>${escapeHtml(e.email)}</p></article>`).join("")}</body></html>`;
      return { value: new Blob([html], { type: "text/html;charset=utf-8" }) };
    }
    if (path.includes("/vcf/")) {
      const e = employees.find(e => e.id === id && e.companyId === companyId); if (!e) bad("Əməkdaş tapılmadı", 404);
      return { value: new Blob([`BEGIN:VCARD\r\nVERSION:3.0\r\nFN:${name(e)}\r\nEMAIL:${e.email}\r\nTEL:${e.phone1 || ""}\r\nEND:VCARD\r\n`], { type: "text/vcard" }) };
    }
    if (path.includes("/import/")) {
      requireRole(session, "COMPANY_ADMIN");
      if (id !== companyId) bad("İcazə yoxdur", 403);
      const file = (input.body as FormData)?.get?.("file"); if (!file || typeof file === "string" || typeof file.arrayBuffer !== "function") bad("Excel faylı seçilməyib");
      if (file.size > 2 * 1024 * 1024) bad("Excel faylı maksimum 2 MB olmalıdır");
      const { readSheet } = await import("read-excel-file/node");
      const rows = (await readSheet(Buffer.from(await file.arrayBuffer()))).slice(1, 501);
      let created = 0; const errors: string[] = [];
      for (const [index, row] of rows.entries()) {
        const [firstName, lastName, jobTitle, email, phone1] = row.map(x => str(x));
        if (!firstName || !lastName || !email?.includes("@")) { errors.push(`Sətir ${index + 2}: məlumat yanlışdır`); continue; }
        if (employees.some(e => e.email.toLowerCase() === email.toLowerCase())) { errors.push(`Sətir ${index + 2}: e-poçt artıq mövcuddur`); continue; }
        const e: Employee = { id: randomUUID(), companyId: companyId!, firstName, lastName, fullName: `${firstName} ${lastName}`, jobTitle, email, phone1, role: 2, isActive: true, canEdit: true };
        employees.push(e); state.passwords[e.id] = hashPassword(freshPassword()); created++;
      }
      return { value: { created, failed: errors.length, errors }, dirty: created > 0 };
    }
    const { default: writeExcelFile } = await import("write-excel-file/node");
    const list = path.endsWith("template") ? [] : employees.filter(e => e.companyId === companyId && (!path.includes("selected") || (Array.isArray(input.body) && input.body.includes(e.id))));
    const rows = [["Ad", "Soyad", "Vəzifə", "E-poçt", "Telefon"], ...list.map(e => [e.firstName, e.lastName, e.jobTitle || "", e.email, e.phone1 || ""])];
    const buffer = await writeExcelFile(rows).toBuffer();
    return { value: new Blob([Uint8Array.from(buffer)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }) };
  }
  bad(`Sorğu tapılmadı: ${method} ${path}`, 404);
}
