import { ROLE_MAP, ROLE_NAME_MAP } from "../constants/roles";
import type { Role } from "../types";

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function toArray<T = unknown>(d: unknown): T[] {
  if (Array.isArray(d)) return d as T[];
  const o = asRecord(d);
  const inner =
    o.data ??
    o.items ??
    o.users ??
    o.logs ??
    o.auditLogs ??
    o.records ??
    o.rows ??
    o.results ??
    o.list ??
    o.value ??
    o.result ??
    o.points ??
    o.chart ??
    o.ranking;
  return inner && typeof inner === "object" ? toArray<T>(inner) : [];
}

export function toNumber(d: unknown): number {
  if (typeof d === "number") return d;
  const o = asRecord(d);
  return Number(o.totalScans ?? o.count ?? o.total ?? 0) || 0;
}

export function toTotal(d: unknown, fallback: number): number {
  if (d && typeof d === "object") {
    const o = d as Record<string, unknown>;
    const value =
      o.totalCount ??
      o.totalRecords ??
      o.totalItems ??
      o.itemsCount ??
      o.count ??
      o.total ??
      o.recordsTotal ??
      o.filteredCount ??
      o.dataCount;
    const total = Number(value);
    if (Number.isFinite(total)) return total;

    const inner = o.data ?? o.result;
    if (inner && typeof inner === "object") return toTotal(inner, fallback);
  }
  return fallback;
}

export function buildFullName(
  firstName?: string,
  lastName?: string,
  middleName?: string,
  fallback = "",
): string {
  const full = [firstName, lastName, middleName].filter(Boolean).join(" ");
  return full || fallback;
}

export function toBoolean(value: unknown, fallback = false): boolean {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;

  const normalized = String(value).trim().toLowerCase();

  if (["true", "1", "yes", "y", "active", "aktiv"].includes(normalized)) {
    return true;
  }

  if (
    ["false", "0", "no", "n", "inactive", "deaktiv", "qeyri-aktiv"].includes(
      normalized,
    )
  ) {
    return false;
  }

  return fallback;
}

export function toRole(value: unknown): Role {
  if (typeof value === "number") return ROLE_MAP[value] ?? "EMPLOYEE";
  if (typeof value !== "string") return "EMPLOYEE";

  const normalized = value.trim().toLowerCase();
  if (/^\d+$/.test(normalized))
    return ROLE_MAP[Number(normalized)] ?? "EMPLOYEE";
  return ROLE_NAME_MAP[normalized.replace(/[\s_-]/g, "")] ?? "EMPLOYEE";
}

export function pickFirstLogin(raw: unknown): boolean | undefined {
  const r = asRecord(raw);
  const value = r.isFirstLogin ?? r.firstLogin ?? r.mustChangePassword;
  return value != null ? toBoolean(value, false) : undefined;
}

export function pickPasswordExpiryDays(raw: unknown): number | undefined {
  const value = asRecord(raw).daysUntilPasswordExpiry;
  return typeof value === "number" ? value : undefined;
}
