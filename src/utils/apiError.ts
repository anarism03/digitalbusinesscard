import { strings } from "../constants/strings";
import { message } from "./feedback";

type ApiErrorShape = {
  message?: string;
  response?: { status?: number; data?: unknown };
};

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

function readErrorCode(data: unknown): string {
  if (data && typeof data === "object") {
    const d = data as {
      code?: unknown;
      errorCode?: unknown;
      ErrorCode?: unknown;
    };
    return String(d.code ?? d.errorCode ?? d.ErrorCode ?? "").trim();
  }
  return "";
}

function readMessage(data: unknown): string {
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const d = data as {
      message?: string;
      title?: string;
      error?: string;
      detail?: string;
    };
    return d.message ?? d.title ?? d.error ?? d.detail ?? "";
  }
  return "";
}

function translateKnownMessage(text?: string): string | undefined {
  const key = (text ?? "").trim().toLowerCase();
  if (!key) return undefined;

  if (key.includes("email") && key.includes("already in use")) {
    return "Bu Gmail istifadə olunur, başqa Gmail daxil edin.";
  }

  if (key.includes("voen") || key.includes("vöen")) {
    if (
      key.includes("required") ||
      key.includes("empty") ||
      key.includes("missing") ||
      key.includes("null") ||
      key.includes("tələb") ||
      key.includes("boş")
    ) {
      return "VÖEN daxil edilməlidir";
    }
    return "VÖEN düzgün daxil edilməyib";
  }

  if (key.includes("invalid login") || key.includes("invalid credentials"))
    return strings.auth.loginError;
  if (key.includes("timeout") || key.includes("exceeded")) {
    return "Hazırda sistemlə bağlantı qurulmur. Zəhmət olmasa sonra yenidən cəhd edin.";
  }
  if (key.includes("password")) return "Şifrə məlumatları düzgün deyil";
  if (key.includes("inactive") || key.includes("deactiv"))
    return "Bu hesab müvəqqəti aktiv deyil";
  if (key.includes("cannot log in") || key.includes("can not log in"))
    return "Bu hesabla daxil olmaq mümkün deyil";
  if (key.includes("limit")) return "Şirkətiniz üçün əməkdaş limiti aşılıb";
  if (key.includes("network") || key.includes("failed to fetch"))
    return strings.errors.networkError;

  return undefined;
}

export function getApiErrorMessage(error: unknown): string {
  const err = error as ApiErrorShape;
  const data = err?.response?.data;
  const status = err?.response?.status;

  const code = readErrorCode(data);
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
