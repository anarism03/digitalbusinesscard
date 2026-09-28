import { digitsOnly } from "./text";

export function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isValidUrl(value: string): boolean {
  try {
    new URL(normalizeUrl(value));
    return true;
  } catch {
    return false;
  }
}

export function normalizePhone(value: string): string {
  const digits = digitsOnly(value);
  return digits ? `+${digits}`.slice(0, 30) : "";
}

export function buildWhatsAppLink(phone: string): string {
  return `https://wa.me/${digitsOnly(normalizePhone(phone))}`;
}

const SAFE_URL_SCHEMES = /^(https?:|mailto:|tel:|sms:|viber:)/i;
const HAS_URL_SCHEME = /^[a-z][a-z0-9+.-]*:/i;

export function hasUnsafeUrlScheme(value: string): boolean {
  const trimmed = value.trim();
  return HAS_URL_SCHEME.test(trimmed) && !SAFE_URL_SCHEMES.test(trimmed);
}

export function extractUsername(rawValue: string): string {
  return rawValue
    .trim()
    .replace(/^https?:\/\/(www\.)?[^/]+\//i, "")
    .replace(/^@/, "")
    .replace(/\/+$/, "")
    .trim();
}

export function usernameToUrl(urlPrefix: string, rawValue: string): string {
  return `${urlPrefix}${extractUsername(rawValue)}`;
}

export function domainLabel(urlPrefix?: string): string {
  return (urlPrefix ?? "").replace(/^https?:\/\//i, "").replace(/^www\./i, "");
}

export function urlToUsername(urlPrefix: string, url: string): string {
  if (!url) return "";
  const urlHost = domainLabel(url);
  const prefixHost = domainLabel(urlPrefix);
  if (urlHost.toLowerCase().startsWith(prefixHost.toLowerCase())) {
    return urlHost.slice(prefixHost.length).replace(/\/+$/, "");
  }
  return url;
}

const MAILTO_PREFIX = "mailto:";

export function publicLinkHref(href: string): string {
  if (!href.toLowerCase().startsWith(MAILTO_PREFIX)) return href;

  const email = href.slice(MAILTO_PREFIX.length).split("?", 1)[0].trim();
  if (!email) return "";

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
}

export function isTrustedAssetUrl(value: string): boolean {
  try {
    const appOrigin = window.location.origin;
    const url = new URL(value, appOrigin);
    const apiUrl = new URL(
      import.meta.env.VITE_API_BASE_URL || "/api",
      appOrigin,
    );
    return (
      /^https?:$/.test(url.protocol) &&
      (url.origin === appOrigin || url.origin === apiUrl.origin)
    );
  } catch {
    return false;
  }
}

export function isImageDataUrl(value?: string | null): value is string {
  return /^data:image\//i.test(String(value ?? "").trim());
}

const BASE64_IMAGE_SIGNATURES: [pattern: RegExp, mime: string][] = [
  [/^\/9j\//, "image/jpeg"],
  [/^iVBORw0KGgo/, "image/png"],
  [/^R0lGOD/, "image/gif"],
  [/^UklGR/, "image/webp"],
];

export function looksLikeBareBase64Image(value: string): boolean {
  return value.length > 100 && /^[A-Za-z0-9+/]+=*$/.test(value);
}

export function resolveAssetUrlCandidates(url?: string | null): string[] {
  const raw = String(url ?? "").trim();
  if (!raw) return [];
  if (/^(https?:|data:|blob:)/i.test(raw)) return [raw];
  if (looksLikeBareBase64Image(raw)) {
    const mime =
      BASE64_IMAGE_SIGNATURES.find(([pattern]) => pattern.test(raw))?.[1] ??
      "image/jpeg";
    return [`data:${mime};base64,${raw}`];
  }

  const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
  const path = encodeURI(raw.replace(/\\/g, "/").replace(/^\/+/, ""));
  const rootUrl = `${apiBase.replace(/\/api$/i, "")}/${path}`;
  const apiUrl = `${apiBase}/${path}`;

  return rootUrl === apiUrl ? [rootUrl] : [rootUrl, apiUrl];
}
