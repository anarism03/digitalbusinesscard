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

export function buildSmsLink(phone: string): string {
  return `sms:${normalizePhone(phone)}`;
}

export function buildViberLink(phone: string): string {
  return `viber://chat?number=${encodeURIComponent(normalizePhone(phone))}`;
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
  if (!urlPrefix) return "";
  return urlPrefix.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
}

export function urlToUsername(urlPrefix: string, url: string): string {
  if (!url) return "";
  const host = (value: string) =>
    value.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  const urlHost = host(url);
  const prefixHost = host(urlPrefix);
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

export function isExternalPublicLink(href: string): boolean {
  return /^https?:\/\//i.test(publicLinkHref(href));
}
