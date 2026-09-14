import type { Employee } from "../types";
import { apiClient } from "../services/axios/axiosInstance";
import { buildViewLinkRows } from "./cardLinkRows";
import { getDisabledLinkKeys } from "./linkVisibility";
import {
  hasContactCardFields,
  type ContactCardFields,
} from "./contactCardFields";
import { rasterizeDataUrlToJpeg } from "./file";
import { digitsOnly } from "./text";
import { isImageDataUrl, resolveAssetUrlCandidates } from "./url";

function escapeVcf(value?: string): string {
  return (value ?? "")
    .trim()
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function cleanUri(value: string): string {
  return value.trim().replace(/[\r\n]/g, "");
}

function foldVcfLine(line: string): string {
  if (line.length <= 75) return line;
  const parts = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) {
    parts.push(` ${line.slice(i, i + 74)}`);
  }
  return parts.join("\r\n");
}

function photoLineFor(photoDataUrl?: string): string {
  if (!isImageDataUrl(photoDataUrl)) return "";
  if (!/^data:image\/(jpeg|png)/i.test(photoDataUrl)) return "";

  const [header, payload = ""] = photoDataUrl.split(",");
  const type = header.includes("png") ? "PNG" : "JPEG";
  return payload ? `PHOTO;ENCODING=b;TYPE=${type}:${payload}` : "";
}

async function normalizeVcfPhoto(
  dataUrl: string,
): Promise<string | undefined> {
  return rasterizeDataUrlToJpeg(dataUrl);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Şəkil oxunmadı"));
    reader.readAsDataURL(blob);
  });
}

async function fetchPhotoBlob(url: string): Promise<Blob | undefined> {
  try {
    const response = await fetch(url);
    if (response.ok) return await response.blob();
  } catch {
  }

  try {
    return await apiClient.get<Blob>(url, { responseType: "blob" });
  } catch {
    return undefined;
  }
}

function sameOriginVariant(url: string): string | undefined {
  return url.match(/^https?:\/\/[^/]+(\/.+)$/i)?.[1];
}

export async function resolveVcfPhotoDataUrl(
  rawPhotoUrl?: string,
): Promise<string | undefined> {
  if (isImageDataUrl(rawPhotoUrl)) return normalizeVcfPhoto(rawPhotoUrl);

  const candidates = resolveAssetUrlCandidates(rawPhotoUrl).flatMap((url) => {
    const variant = sameOriginVariant(url);
    return variant ? [variant, url] : [url];
  });

  for (const url of candidates) {
    const blob = await fetchPhotoBlob(url);
    if (!blob) continue;
    const photo = await normalizeVcfPhoto(await blobToDataUrl(blob));
    if (photo) return photo;
  }
  return undefined;
}

export interface ContactCardVcfOverrides {
  name?: string;
  website?: string;
}

export function overridesFromContactCard(
  fields: ContactCardFields,
  enabled: boolean,
): ContactCardVcfOverrides | undefined {
  if (!hasContactCardFields(fields) || !enabled) return undefined;
  return {
    name: fields.name,
    website: fields.website,
  };
}

const LABELED_PHONE_PLATFORMS = new Set([
  "whatsapp",
  "whatsapp-business",
  "viber",
  "sms",
]);

function buildVcfCoreLines(
  employee: Employee,
  overrides?: ContactCardVcfOverrides,
): string[] {
  const fullName = overrides?.name?.trim() || employee.fullName;
  const email = employee.email;
  const website = overrides?.website?.trim();
  const address = employee.address?.trim();
  const birthday = employee.birthday?.trim().slice(0, 10);
  const workPhone = employee.phone1;
  const mobilePhone = employee.phone2;
  const notes = employee.additionalInfo;

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    overrides?.name
      ? `N:${escapeVcf(overrides.name)};;;;`
      : `N:${escapeVcf(employee.lastName)};${escapeVcf(employee.firstName)};;;`,
    `FN:${escapeVcf(fullName)}`,
  ];
  if (employee.companyName) lines.push(`ORG:${escapeVcf(employee.companyName)}`);
  if (employee.jobTitle) {
    lines.push(`TITLE:${escapeVcf(employee.jobTitle)}`);
    lines.push(`ROLE:${escapeVcf(employee.jobTitle)}`);
  }
  if (birthday && /^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
    lines.push(`BDAY:${birthday}`);
  }

  let itemIndex = 0;
  const seenPhones = new Set<string>();
  const seenEmails = new Set<string>();
  const seenUrls = new Set<string>();
  const phoneKey = (value: string) => digitsOnly(value).slice(-9);
  const urlKey = (value: string) =>
    cleanUri(value).toLowerCase().replace(/\/+$/, "");

  const pushLabeled = (property: string, label: string) => {
    itemIndex += 1;
    lines.push(`item${itemIndex}.${property}`);
    lines.push(`item${itemIndex}.X-ABLabel:${escapeVcf(label)}`);
  };

  const pushTel = (value: string, types: string, label?: string) => {
    const key = `${label ?? ""}:${phoneKey(value)}`;
    if (!phoneKey(value) || seenPhones.has(key)) return;
    seenPhones.add(key);
    const property = `TEL;TYPE=${types}:${escapeVcf(value)}`;
    if (label) pushLabeled(property, label);
    else lines.push(property);
  };

  const pushEmail = (value: string, label?: string) => {
    const key = value.trim().toLowerCase();
    if (!key || seenEmails.has(key)) return;
    seenEmails.add(key);
    const property = `EMAIL;TYPE=INTERNET:${escapeVcf(value)}`;
    if (label) pushLabeled(property, label);
    else lines.push(property);
  };

  const pushUrl = (href: string, label?: string) => {
    const key = urlKey(href);
    if (!key || seenUrls.has(key)) return;
    seenUrls.add(key);
    const property = `URL:${cleanUri(href)}`;
    if (label) pushLabeled(property, label);
    else lines.push(property);
  };

  const rows = buildViewLinkRows(employee);
  const disabledKeys = getDisabledLinkKeys(employee.contactInfos);

  if (workPhone && !disabledKeys.has("core:phone1")) pushTel(workPhone, "WORK,VOICE");
  if (mobilePhone && !disabledKeys.has("core:phone2")) pushTel(mobilePhone, "CELL,VOICE");
  if (email && !disabledKeys.has("core:email")) pushEmail(email);
  if (address) {
    lines.push(`ADR;TYPE=WORK:;;${escapeVcf(address)};;;;`);
    lines.push(`LABEL;TYPE=WORK:${escapeVcf(address)}`);
  }
  if (website) pushUrl(website, "Vebsayt");

  for (const row of rows) {
    if (row.id === "core:phone1" || row.id === "core:phone2" || row.id === "core:email") continue;
    const platform = row.platform ?? "";
    if (platform === "contact-card" || platform === "googlemaps") continue;

    if (platform === "phone") {
      pushTel(row.value, "VOICE", row.label);
      continue;
    }
    if (LABELED_PHONE_PLATFORMS.has(platform)) {
      pushTel(row.value, "CELL,VOICE", row.label);
      continue;
    }
    if (platform === "email") {
      pushEmail(row.value, row.label);
      continue;
    }

    if (!/^https?:\/\//i.test(row.href)) continue;
    pushUrl(row.href, row.label);
  }

  if (notes) lines.push(`NOTE:${escapeVcf(notes)}`);
  return lines;
}

export function buildVcfBlob(
  employee: Employee,
  profilePhotoUrl?: string,
  overrides?: ContactCardVcfOverrides,
): Blob {
  const photoLine = photoLineFor(profilePhotoUrl ?? employee.photoUrl);
  const lines = buildVcfCoreLines(employee, overrides);
  if (photoLine) lines.push(photoLine);
  lines.push("END:VCARD");

  return new Blob([lines.map(foldVcfLine).join("\r\n")], {
    type: "text/vcard;charset=utf-8",
  });
}

export function buildVcfText(
  employee: Employee,
  overrides?: ContactCardVcfOverrides,
): string {
  const lines = buildVcfCoreLines(employee, overrides);
  lines.push("END:VCARD");
  return lines.map(foldVcfLine).join("\r\n");
}

export function buildCompanyVcfText(company: {
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  voen?: string;
}): string {
  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:;;;;",
    `FN:${escapeVcf(company.name)}`,
    `ORG:${escapeVcf(company.name)}`,
  ];
  if (company.phone) {
    lines.push(`TEL;TYPE=WORK,VOICE:${escapeVcf(company.phone)}`);
  }
  if (company.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${escapeVcf(company.email)}`);
  }
  if (company.address) {
    lines.push(`ADR;TYPE=WORK:;;${escapeVcf(company.address)};;;;`);
    lines.push(`LABEL;TYPE=WORK:${escapeVcf(company.address)}`);
  }
  if (company.voen) {
    lines.push(`NOTE:VÖEN: ${escapeVcf(company.voen)}`);
  }
  lines.push("END:VCARD");
  return lines.map(foldVcfLine).join("\r\n");
}
