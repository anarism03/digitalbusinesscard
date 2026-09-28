import { strings } from "../constants/strings";
import { message } from "./feedback";
import { asRecord } from "./normalize";

interface ApiErrorShape {
  message?: string;
  response?: { status?: number; data?: unknown };
}

const ERROR_CODE_MAP: Record<string, string> = {
  INVALID_CREDENTIALS: strings.auth.loginError,
  VOEN_REQUIRED: "VÖEN daxil edilməlidir",
  VOEN_INVALID: "VÖEN düzgün daxil edilməyib",
  ACCOUNT_INACTIVE: "Bu hesab müvəqqəti aktiv deyil",
  USER_LIMIT_EXCEEDED: "Şirkətiniz üçün əməkdaş limiti aşılıb",
  UNAUTHORIZED: strings.errors.unauthorized,
  FORBIDDEN: strings.errors.forbidden,
};

const STATUS_MESSAGE_MAP: Record<number, string> = {
  401: strings.auth.sessionExpired,
  403: strings.errors.forbidden,
  404: strings.errors.notFound,
  409: strings.errors.conflict,
  500: strings.errors.serverError,
  502: strings.errors.serverError,
  503: strings.errors.serverError,
};

function readMessage(data: unknown): string {
  if (typeof data === "string") return data;
  const d = asRecord(data);
  return String(d.message ?? d.title ?? d.error ?? d.detail ?? "");
}

function isOldPasswordMessage(key: string): boolean {
  return /old password|current password|köhnə şifrə|cari şifrə/.test(key);
}

function translateKnownMessage(text?: string): string | undefined {
  const key = (text ?? "").trim().toLowerCase();
  if (!key) return undefined;

  if (key.includes("email") && key.includes("already in use")) {
    return "Bu Gmail istifadə olunur, başqa Gmail daxil edin.";
  }

  if (/voen|vöen/.test(key)) {
    return /required|empty|missing|null|tələb|boş/.test(key)
      ? ERROR_CODE_MAP.VOEN_REQUIRED
      : ERROR_CODE_MAP.VOEN_INVALID;
  }

  if (/invalid login|invalid credentials/.test(key))
    return strings.auth.loginError;
  if (/timeout|exceeded/.test(key)) {
    return "Hazırda sistemlə bağlantı qurulmur. Zəhmət olmasa sonra yenidən cəhd edin.";
  }
  if (isOldPasswordMessage(key)) return "Köhnə şifrə yanlışdır";
  if (key.includes("password")) return "Şifrə məlumatları düzgün deyil";
  if (/inactive|deactiv/.test(key)) return ERROR_CODE_MAP.ACCOUNT_INACTIVE;
  if (/cannot log in|can not log in/.test(key))
    return "Bu hesabla daxil olmaq mümkün deyil";
  if (key.includes("limit")) return ERROR_CODE_MAP.USER_LIMIT_EXCEEDED;
  if (/network|failed to fetch/.test(key)) return strings.errors.networkError;

  return undefined;
}

export function getApiErrorMessage(error: unknown): string {
  const err = error as ApiErrorShape;
  const data = err?.response?.data;
  const status = err?.response?.status;

  const body = asRecord(data);
  const code = String(
    body.code ?? body.errorCode ?? body.ErrorCode ?? "",
  ).trim();
  if (code && ERROR_CODE_MAP[code]) return ERROR_CODE_MAP[code];

  const backendMessage = readMessage(data) || err?.message;
  const known = translateKnownMessage(backendMessage);
  if (known) return known;

  if (status && STATUS_MESSAGE_MAP[status]) return STATUS_MESSAGE_MAP[status];

  return strings.errors.generic;
}

export function showApiError(error: unknown): void {
  message.error(getApiErrorMessage(error));
}

export function isOldPasswordError(error: unknown): boolean {
  const err = error as ApiErrorShape;
  const backendMessage = readMessage(err?.response?.data) || err?.message;
  return isOldPasswordMessage(String(backendMessage ?? "").toLowerCase());
}
