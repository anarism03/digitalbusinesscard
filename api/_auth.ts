import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export interface Session {
  sub: string;
  role: "SUPER_ADMIN" | "COMPANY_ADMIN" | "EMPLOYEE";
  companyId?: string;
  exp: number;
}

function secret(): string {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must contain at least 32 characters");
  return value;
}

function signature(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function issueToken(user: Omit<Session, "exp">): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + 86400 })).toString("base64url");
  const signed = `${header}.${payload}`;
  return `${signed}.${signature(signed)}`;
}

export function readSession(request: Request): Session | null {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const signed = `${parts[0]}.${parts[1]}`;
  const expected = Buffer.from(signature(signed));
  const actual = Buffer.from(parts[2]);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(parts[1], "base64url").toString()) as Session;
    if (!parsed.sub || !["SUPER_ADMIN", "COMPANY_ADMIN", "EMPLOYEE"].includes(parsed.role) || parsed.exp <= Date.now() / 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, stored?: string): boolean {
  if (!stored) return Boolean(process.env.INITIAL_ADMIN_PASSWORD) && password === process.env.INITIAL_ADMIN_PASSWORD;
  const [salt, digest] = stored.split(":");
  if (!salt || !digest) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(digest, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
