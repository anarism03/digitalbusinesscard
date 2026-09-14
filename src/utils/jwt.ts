import type { Role, User } from "../types";
import { ROLE_MAP, ROLE_NAME_MAP } from "../types";
import { pickFirstLogin, toBoolean } from "./normalize";

type JwtPayload = Record<string, unknown>;

const SOAP_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims";
const MICROSOFT_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims";

const CLAIM_KEYS = {
  id: [`${SOAP_CLAIM}/nameidentifier`, "sub", "nameid"],
  email: [`${SOAP_CLAIM}/emailaddress`, "email", "unique_name"],
  name: [`${SOAP_CLAIM}/name`, "name"],
  firstName: [`${SOAP_CLAIM}/givenname`],
  lastName: [`${SOAP_CLAIM}/surname`],
  role: [`${MICROSOFT_CLAIM}/role`, "role"],
  companyId: ["CompanyId", "companyId"],
  canEdit: ["CanEdit", "canEdit", "IsEdit", "isEdit"],
} as const;

function getClaim<T>(payload: JwtPayload, keys: readonly string[]) {
  for (const key of keys) {
    const value = payload[key];
    if (value !== undefined && value !== null) return value as T;
  }
  return undefined;
}

function parsePayload(token: string): JwtPayload | null {
  const encodedPayload = token.split(".")[1];
  if (!encodedPayload) return null;

  const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64)) as JwtPayload;
}

function resolveRole(value: unknown): Role {
  if (typeof value === "number") return ROLE_MAP[value] ?? "EMPLOYEE";
  if (typeof value !== "string") return "EMPLOYEE";

  const normalized = value.trim();
  const numericRole = Number.parseInt(normalized, 10);

  if (String(numericRole) === normalized) {
    return ROLE_MAP[numericRole] ?? "EMPLOYEE";
  }

  return ROLE_NAME_MAP[normalized.toLowerCase()] ?? "EMPLOYEE";
}

export function decodeJwt(token: string): User | null {
  try {
    const payload = parsePayload(token);
    if (!payload) return null;

    const claim = <T>(key: keyof typeof CLAIM_KEYS) =>
      getClaim<T>(payload, CLAIM_KEYS[key]);

    const id = claim<string>("id") ?? "";
    if (!id) return null;

    const email = claim<string>("email") ?? "";
    const name = claim<string>("name") ?? "";
    const nameParts = name.split(" ");
    const firstName =
      claim<string>("firstName") ?? nameParts[0] ?? "";
    const lastName =
      claim<string>("lastName") ?? nameParts.slice(1).join(" ");
    const canEdit = claim("canEdit");

    return {
      id,
      email,
      firstName,
      lastName,
      fullName: name || [firstName, lastName].filter(Boolean).join(" ") || email,
      role: resolveRole(claim("role")),
      companyId: claim<string>("companyId") || null,
      canEdit:
        canEdit !== undefined ? toBoolean(canEdit, false) : undefined,
      isFirstLogin: pickFirstLogin(payload),
    };
  } catch {
    return null;
  }
}
