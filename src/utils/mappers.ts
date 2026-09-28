import { ROLE_TO_NUM } from "../constants/roles";
import {
  asRecord,
  buildFullName,
  toArray,
  toBoolean,
  toRole,
  toTotal,
} from "./normalize";
import { buildAuditChanges } from "./audit";
import { isImageDataUrl, looksLikeBareBase64Image } from "./url";
import type {
  AuditLogEntry,
  Company,
  ContactInfo,
  Employee,
  EmployeeRanking,
  ImportResult,
  PageResult,
  ScanChartPoint,
  ScanLog,
  SocialAccount,
  SuperAdminDashboardStats,
} from "../types";

type ApiRecord = Record<string, unknown>;

const PHOTO_KEYS = [
  "photoBase64",
  "photoData",
  "photoUrl",
  "profilePhotoUrl",
  "profileImageUrl",
  "imageUrl",
  "uploadUrl",
  "fileUrl",
  "filePath",
  "photo",
  "avatar",
];

export function pickPhotoUrl(record: ApiRecord): string | undefined {
  return imageValue(...PHOTO_KEYS.map((key) => record[key]));
}

function stringValue(value: unknown): string | undefined {
  return value == null || value === "" ? undefined : String(value);
}

function imageValue(...values: unknown[]): string | undefined {
  const items = values
    .map((value) => stringValue(value))
    .filter((value): value is string => Boolean(value));
  return (
    items.find(isImageDataUrl) ??
    items.find((item) => !looksLikeBareBase64Image(item)) ??
    items[0]
  );
}

function numberValue(value: unknown): number | undefined {
  if (value == null || value === "") return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function recordArray(raw: unknown): ApiRecord[] {
  return toArray<unknown>(raw).map(asRecord);
}

function mapPage<T>(
  raw: unknown,
  mapItem: (item: unknown) => T,
): PageResult<T> {
  const items = toArray(raw).map(mapItem);
  return { items, totalCount: toTotal(raw, items.length) };
}

export function mapCompany(raw: unknown): Company {
  const root = asRecord(raw);
  const data = asRecord(root.data ?? raw);
  const c = asRecord(data.company ?? data.currentCompany ?? data);
  const admin = asRecord(
    c.admin ?? c.companyAdmin ?? data.admin ?? data.companyAdmin,
  );

  return {
    ...c,
    id: stringValue(c.id ?? c.companyId) ?? "",
    name: stringValue(c.name ?? c.companyName) ?? "",
    voen: stringValue(c.voen),
    logoUrl: imageValue(
      c.logoUrl,
      c.companyLogoUrl,
      c.logo,
      c.imageUrl,
      c.fileUrl,
      c.filePath,
      c.path,
    ),
    address: stringValue(c.address),
    email: stringValue(c.email ?? c.contactEmail ?? admin.email),
    phone: stringValue(
      c.phone ?? c.contactPhone ?? c.contact ?? admin.phone ?? admin.phone1,
    ),
    userLimit: numberValue(c.userLimit ?? c.limit ?? c.employeeLimit) ?? 0,
    usedCount: numberValue(
      c.usedCount ??
        c.userCount ??
        c.employeeCount ??
        c.totalUsersCount ??
        c.companyActiveUsersCount,
    ),
    adminEmail: stringValue(c.adminEmail ?? data.adminEmail ?? admin.email),
    defaultPassword: stringValue(c.defaultPassword ?? data.defaultPassword),
    nfcBaseUrl: stringValue(c.nfcBaseUrl),
    isActive: toBoolean(c.isActive, true),
  };
}

export function mapCompanyPage(raw: unknown): PageResult<Company> {
  return mapPage(raw, mapCompany);
}

export function mapCreatedCompany(raw: unknown) {
  const root = asRecord(raw);
  const data = asRecord(root.data ?? raw);
  const cRaw = asRecord(data.company ?? data.createdCompany ?? data);
  const company = mapCompany(cRaw);
  return {
    company,
    voen: stringValue(
      data.voen ??
        data.companyVoen ??
        root.voen ??
        root.companyVoen ??
        cRaw.voen ??
        company.voen,
    ),
    adminEmail: stringValue(
      data.adminEmail ??
        data.email ??
        root.adminEmail ??
        root.email ??
        cRaw.adminEmail ??
        cRaw.email ??
        company.adminEmail,
    ),
    defaultPassword: stringValue(
      data.adminPassword ??
        data.defaultPassword ??
        data.password ??
        root.adminPassword ??
        root.defaultPassword ??
        cRaw.adminPassword ??
        cRaw.defaultPassword ??
        company.defaultPassword,
    ),
  };
}

export function mapSuperAdminDashboard(raw: unknown): SuperAdminDashboardStats {
  const root = asRecord(raw);
  const data = asRecord(root.data ?? raw);
  const recentRaw =
    data.recentCompanies ?? data.lastCompanies ?? data.companies ?? [];
  const recentCompanies = toArray(recentRaw).map(mapCompany);
  const activeCompaniesCount =
    numberValue(data.activeCompaniesCount ?? data.totalActiveCompanies) ?? 0;
  const inactiveCompaniesCount =
    numberValue(data.inactiveCompaniesCount ?? data.totalDeactiveCompanies) ??
    0;
  const topCompaniesByScans = recordArray(
    data.topCompaniesByScans ?? data.topCompanies ?? [],
  ).map((t) => ({
    companyId: stringValue(t.companyId ?? t.id) ?? "",
    companyName: stringValue(t.companyName ?? t.name) ?? "",
    logoUrl: stringValue(t.logoUrl ?? t.logo),
    isActive: toBoolean(t.isActive, true),
    scanCount: numberValue(t.scanCount ?? t.totalScans ?? t.count) ?? 0,
  }));
  const companiesCount =
    numberValue(
      data.companiesCount ??
        data.companyCount ??
        data.totalCompanies ??
        data.totalCompanyCount,
    ) ?? recentCompanies.length;

  return {
    companiesCount,
    activeCompaniesCount,
    inactiveCompaniesCount,
    recentCompanies,
    topCompaniesByScans,
  };
}

function mapSocialAccount(raw: unknown): SocialAccount | undefined {
  const r = asRecord(raw);
  const platformName = stringValue(r.platformName);
  const profileUrl = stringValue(r.profileUrl);
  if (!platformName || !profileUrl) return undefined;
  return { platformName, profileUrl, iconUrl: stringValue(r.iconUrl) };
}

function mapContactInfo(raw: unknown): ContactInfo | undefined {
  const r = asRecord(raw);
  const contactType = stringValue(r.contactType);
  const value = stringValue(r.value);
  if (!contactType || !value) return undefined;
  return {
    contactType,
    value,
    label: stringValue(r.label),
    displayOrder: numberValue(r.displayOrder),
  };
}

export function mapEmployee(raw: unknown): Employee {
  const r = asRecord(raw);
  const company = asRecord(r.company);
  const role = ROLE_TO_NUM[toRole(r.role)];
  const firstName = stringValue(r.firstName) ?? "";
  const lastName = stringValue(r.lastName) ?? "";
  const middleName = stringValue(r.middleName ?? r.fatherName);
  const jobTitle = stringValue(r.jobTitle ?? r.position);
  return {
    ...r,
    id: stringValue(r.id ?? r.userId ?? r.employeeId) ?? "",
    companyId:
      stringValue(r.companyId ?? company.id ?? company.companyId) ?? "",
    firstName,
    lastName,
    middleName,
    fullName:
      buildFullName(firstName, lastName, middleName) ||
      stringValue(r.fullName) ||
      stringValue(r.email) ||
      "",
    jobTitle:
      role === ROLE_TO_NUM.COMPANY_ADMIN &&
      jobTitle?.trim().toLowerCase() === "company admin"
        ? "Şirkət Administratoru"
        : jobTitle,
    phone1: stringValue(r.phone1 ?? r.workPhone),
    phone2: stringValue(r.phone2 ?? r.personalPhone),
    email:
      stringValue(
        r.email ??
          r.emailAddress ??
          r.mail ??
          r.workEmail ??
          r.personalEmail ??
          r.userEmail,
      ) ?? "",
    role,
    isActive: toBoolean(r.isActive, true),
    canEdit: toBoolean(r.canEdit ?? r.canEditProfile ?? r.isEdit, false),
    photoUrl: pickPhotoUrl(r),
    whatsappPhone: stringValue(r.whatsappPhone ?? r.whatsapp),
    extensionNumber: stringValue(
      r.extensionNumber ?? r.extension ?? r.internalNumber,
    ),
    additionalInfo: stringValue(r.additionalInfo ?? r.note ?? r.description),
    linkedinUrl: stringValue(r.linkedinUrl ?? r.linkedInUrl ?? r.linkedin),
    facebookUrl: stringValue(r.facebookUrl ?? r.facebook),
    instagramUrl: stringValue(r.instagramUrl ?? r.instagram),
    googleMapsUrl: stringValue(r.googleMapsUrl),
    address: stringValue(r.address),
    birthday: stringValue(r.birthday),
    cardBackgroundUrl: stringValue(r.cardBackgroundUrl),
    socialAccounts: toArray(r.socialAccounts)
      .map(mapSocialAccount)
      .filter((item): item is SocialAccount => Boolean(item)),
    contactInfos: toArray(r.contactInfos)
      .map(mapContactInfo)
      .filter((item): item is ContactInfo => Boolean(item)),
    companyName: stringValue(
      r.companyName ?? company.name ?? company.companyName,
    ),
    companyLogoUrl: stringValue(
      r.companyLogoUrl ?? r.logoUrl ?? company.logoUrl,
    ),
  };
}

export function mapEmployeePage(raw: unknown): PageResult<Employee> {
  return mapPage(raw, mapEmployee);
}

export function mapPublicCard(raw: unknown): Employee {
  const root = asRecord(raw);
  const data = asRecord(root.data ?? raw);
  const src = asRecord(
    data.user ?? data.employee ?? root.user ?? root.employee ?? data,
  );
  const company = asRecord(data.company ?? root.company ?? src.company);
  const base = mapEmployee(src);

  return {
    ...base,
    email: base.email || stringValue(data.email ?? root.email) || "",
    companyId:
      stringValue(
        src.companyId ?? data.companyId ?? company.id ?? company.companyId,
      ) ?? "",
    companyLogoUrl: stringValue(
      src.companyLogoUrl ??
        src.companyLogo ??
        src.logoUrl ??
        data.companyLogoUrl ??
        data.companyLogo ??
        data.logoUrl ??
        company.logoUrl ??
        company.logo ??
        company.companyLogoUrl,
    ),
    companyName: stringValue(
      src.companyName ??
        data.companyName ??
        company.name ??
        company.companyName,
    ),
  };
}

export function mapNfcUrl(raw: unknown): string {
  const root = asRecord(raw);
  const body = asRecord(root.data ?? raw);
  const value = body.nfcUrl ?? body.url ?? raw;
  return typeof value === "string" ? value : "";
}

export function mapChart(raw: unknown): ScanChartPoint[] {
  return recordArray(raw).map((item) => ({
    date:
      stringValue(
        item.date ??
          item.day ??
          item.label ??
          item.scanDate ??
          item.createdAt ??
          item.period,
      ) ?? "",
    count:
      numberValue(
        item.count ??
          item.scanCount ??
          item.totalScans ??
          item.scans ??
          item.value,
      ) ?? 0,
  }));
}

export function mapRanking(raw: unknown): EmployeeRanking[] {
  return recordArray(raw).map((item) => ({
    employeeId: stringValue(item.employeeId ?? item.userId ?? item.id) ?? "",
    fullName:
      stringValue(
        item.fullName ?? item.employeeName ?? item.userName ?? item.name,
      ) ??
      buildFullName(stringValue(item.firstName), stringValue(item.lastName)),
    jobTitle: stringValue(item.jobTitle ?? item.position),
    photoUrl: pickPhotoUrl(item),
    scanCount:
      numberValue(item.scanCount ?? item.totalScans ?? item.count) ?? 0,
  }));
}

export function mapScanLogs(raw: unknown): PageResult<ScanLog> {
  const items = recordArray(raw).map((item, index) => ({
    id: stringValue(item.id ?? item.scanId) ?? `scan-${index}`,
    scannedAt: stringValue(item.scannedAt ?? item.createdAt ?? item.date) ?? "",
    employeeId: stringValue(item.employeeId ?? item.userId),
    employeeName:
      stringValue(item.employeeName ?? item.fullName ?? item.userName) ??
      buildFullName(stringValue(item.firstName), stringValue(item.lastName)),
    photoUrl: pickPhotoUrl(item),
  }));
  return { items, totalCount: toTotal(raw, items.length) };
}

export function mapAuditPage(raw: unknown): PageResult<AuditLogEntry> {
  const items = recordArray(raw).map((item, index) => ({
    id: stringValue(item.id ?? item.logId) ?? `audit-${index}`,
    createdAt:
      stringValue(
        item.createdAt ?? item.createdDate ?? item.date ?? item.timestamp,
      ) ?? "",
    userId: stringValue(item.userId ?? item.actorId ?? item.createdById),
    userEmail: stringValue(item.userEmail ?? item.email),
    userName: stringValue(
      item.userName ?? item.createdBy ?? item.performedBy ?? item.fullName,
    ),
    action:
      stringValue(
        item.action ?? item.actionType ?? item.type ?? item.operation,
      ) ?? "",
    entityType: stringValue(
      item.entityType ?? item.entity ?? item.entityName ?? item.tableName,
    ),
    entityId: stringValue(item.entityId ?? item.recordId),
    changes: buildAuditChanges(item),
  }));
  return { items, totalCount: toTotal(raw, items.length) };
}

function toErrorRowMessages(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (typeof item === "string") return item;
    const row = asRecord(item);
    const reason = row.reason ?? row.message ?? row.error ?? "";
    const rowNumber = row.row ?? row.rowNumber ?? row.index;
    return rowNumber != null ? `Sətir ${rowNumber}: ${reason}` : String(reason);
  });
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export function mapImportResult(raw: unknown): ImportResult | null {
  const body = asRecord(raw);
  const created =
    body.created ?? body.createdCount ?? body.successCount ?? body.count;
  if (created == null) return null;

  const errorRows = toErrorRowMessages(body.errorRows);
  const errors =
    [errorRows, toStringArray(body.errors), toStringArray(body.messages)].find(
      (items) => items.length,
    ) ?? [];
  return {
    created: Number(created),
    failed: Number(
      body.failed ?? body.failedCount ?? body.errorCount ?? errorRows.length,
    ),
    errors,
  };
}
