export function toArray<T = unknown>(d: unknown): T[] {
  if (Array.isArray(d)) return d as T[];
  if (d && typeof d === "object") {
    const o = d as Record<string, unknown>;
    const inner =
      o.data ??
      o.items ??
      o.users ??
      o.logs ??
      o.auditLogs ??
      o.records ??
      o.rows ??
      o.results ??
      o.value ??
      o.result ??
      o.points ??
      o.chart ??
      o.ranking;
    if (Array.isArray(inner)) return inner as T[];
    if (inner && typeof inner === "object") return toArray<T>(inner);
  }
  return [];
}

export function toNumber(d: unknown): number {
  if (typeof d === "number") return d;
  if (d && typeof d === "object") {
    const o = d as Record<string, unknown>;
    return Number(o.totalScans ?? o.count ?? o.total ?? 0) || 0;
  }
  return 0;
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

export function coalesce<T>(...values: T[]): T | undefined {
  return values.find((value) => value !== undefined && value !== null);
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

export function pickFirstLogin(raw: unknown): boolean | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const value = r.isFirstLogin ?? r.firstLogin ?? r.mustChangePassword;
  return value != null ? toBoolean(value, false) : undefined;
}

export function pickPasswordExpiryDays(raw: unknown): number | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const value = r.daysUntilPasswordExpiry;
  return typeof value === "number" ? value : undefined;
}
