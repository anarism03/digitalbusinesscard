const SOAP_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims";
const MICROSOFT_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims";

function base64UrlEncode(input: string): string {
  return btoa(unescape(encodeURIComponent(input)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export interface FakeJwtUser {
  id: string;
  email: string;
  fullName: string;
  role: "SUPER_ADMIN" | "COMPANY_ADMIN" | "EMPLOYEE";
  companyId?: string | null;
  canEdit?: boolean;
  isFirstLogin?: boolean;
}

export function createFakeJwt(user: FakeJwtUser): string {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    [`${SOAP_CLAIM}/nameidentifier`]: user.id,
    [`${SOAP_CLAIM}/emailaddress`]: user.email,
    [`${SOAP_CLAIM}/name`]: user.fullName,
    [`${MICROSOFT_CLAIM}/role`]: user.role,
    CompanyId: user.companyId ?? "",
    CanEdit: user.canEdit ?? true,
    isFirstLogin: user.isFirstLogin ?? false,
    iat: Math.floor(Date.now() / 1000),
  };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  return `${encodedHeader}.${encodedPayload}.mock-signature`;
}
