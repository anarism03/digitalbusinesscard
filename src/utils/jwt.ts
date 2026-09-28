import type { User } from "../types";
import { pickFirstLogin, toBoolean, toRole } from "./normalize";

const SOAP_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims";
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

export function decodeJwt(token: string): User | null {
  try {
    const encoded = token.split(".")[1];
    if (!encoded) return null;
    const payload = JSON.parse(
      atob(encoded.replace(/-/g, "+").replace(/_/g, "/")),
    );
    if (!payload) return null;

    const claim = <T>(key: keyof typeof CLAIM_KEYS) =>
      CLAIM_KEYS[key]
        .map((name) => payload[name])
        .find((value) => value != null) as T | undefined;

    const id = claim<string>("id") ?? "";
    if (!id) return null;

    const email = claim<string>("email") ?? "";
    const name = claim<string>("name") ?? "";
    const nameParts = name.split(" ");
    const firstName = claim<string>("firstName") ?? nameParts[0] ?? "";
    const lastName = claim<string>("lastName") ?? nameParts.slice(1).join(" ");
    const canEdit = claim("canEdit");

    return {
      id,
      email,
      firstName,
      lastName,
      fullName:
        name || [firstName, lastName].filter(Boolean).join(" ") || email,
      role: toRole(claim("role")),
      companyId: claim<string>("companyId") || null,
      canEdit: canEdit !== undefined ? toBoolean(canEdit, false) : undefined,
      isFirstLogin: pickFirstLogin(payload),
    };
  } catch {
    return null;
  }
}
