/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";
import { MailOutlined } from "@ant-design/icons";
import type { ContactInfo, Employee, LinkCategory } from "../types";
import { LINK_TYPE_META } from "../constants/linkTypes";
import {
  buildSmsLink,
  buildViberLink,
  buildWhatsAppLink,
  hasUnsafeUrlScheme,
  usernameToUrl,
  urlToUsername,
} from "./linkHelpers";
import {
  CORE_LINK_CATEGORY,
  CORE_LINK_META,
  CORE_LINK_ORDER,
  contactInfoMeta,
  customWebsiteHeadline,
  linkMetaFor,
  resolveContactInfoType,
  resolveLinkType,
  tintFor,
  type CoreLinkKey,
} from "./linkTypeResolution";
import {
  isContactInfoMetadata,
  contactInfoRowKey,
  coreLinkRowKey,
  getDisabledLinkKeys,
  socialAccountRowKey,
} from "./linkVisibility";
import { normalizeContactCardEntries } from "./contactCardFields";

export * from "./linkTypeResolution";
export * from "./contactCardFields";
export * from "./linkVisibility";

export const coreRowId = (key: CoreLinkKey) => `core:${key}`;
export const contactRowId = (contactType: string, index: number) =>
  `contact:${contactType}:${index}`;
export const socialRowId = (platformName: string, index: number) =>
  `social:${platformName}:${index}`;

export interface ViewLinkRow {
  id: string;
  key: string;
  icon: ReactNode;
  iconSrc?: string;
  label: string;
  value: string;
  href: string;
  tint: string;
  category: LinkCategory;
  platform?: string;
}

const CORE_LINK_PLATFORM: Partial<Record<CoreLinkKey, string>> = {
  phone1: "phone",
  phone2: "phone",
  whatsappPhone: "whatsapp",
  linkedinUrl: "linkedin",
  facebookUrl: "facebook",
  instagramUrl: "instagram",
  googleMapsUrl: "googlemaps",
};

export interface ViewLinkGroup {
  key: string;
  rows: ViewLinkRow[];
  representative: ViewLinkRow;
}

export function groupViewLinkRows(rows: ViewLinkRow[]): ViewLinkGroup[] {
  const groups = new Map<string, ViewLinkRow[]>();
  rows.forEach((row) => {
    const key = row.platform || row.id;
    const groupedRows = groups.get(key) ?? [];
    groupedRows.push(row);
    groups.set(key, groupedRows);
  });
  return [...groups.entries()].map(([key, groupedRows]) => ({
    key,
    rows: groupedRows,
    representative: groupedRows[0],
  }));
}

function contactInfoHref(info: ContactInfo): string {
  const resolvedType = resolveContactInfoType(info);
  switch (resolvedType) {
    case "email":
      return `mailto:${info.value}`;
    case "whatsapp":
    case "whatsapp-business":
      return buildWhatsAppLink(info.value);
    case "sms":
      return buildSmsLink(info.value);
    case "viber":
      return buildViberLink(info.value);
    default: {
      const meta = contactInfoMeta(info);
      if (meta.fieldKind === "username" && meta.urlPrefix) {
        return usernameToUrl(meta.urlPrefix, info.value);
      }
      return meta.fieldKind === "phone" ? `tel:${info.value}` : info.value;
    }
  }
}

function normalizeHref(href: string): string {
  return href.trim().toLowerCase().replace(/\/+$/, "");
}

function sanitizeHref(href: string): string {
  const trimmed = href.trim();
  if (!trimmed || hasUnsafeUrlScheme(trimmed)) return "";
  return trimmed;
}

function dedupeByPlatformAndHref(rows: ViewLinkRow[]): ViewLinkRow[] {
  const seen = new Set<string>();
  return rows.filter((row) => {
    if (!row.platform) return true;
    const dedupeKey = `${row.platform}::${normalizeHref(row.href)}`;
    if (seen.has(dedupeKey)) return false;
    seen.add(dedupeKey);
    return true;
  });
}

export function buildViewLinkRows(employee: Employee): ViewLinkRow[] {
  const rows: ViewLinkRow[] = [];
  const contactInfos = normalizeContactCardEntries(employee.contactInfos);
  const disabledKeys = getDisabledLinkKeys(employee.contactInfos);

  for (const key of CORE_LINK_ORDER) {
    const value = employee[key];
    const id = coreRowId(key);
    if (!value) continue;
    if (disabledKeys.has(coreLinkRowKey(key))) continue;
    const meta = CORE_LINK_META[key];
    rows.push({
      id,
      key,
      icon: meta.icon,
      iconSrc: meta.iconSrc,
      label:
        key === "googleMapsUrl" && employee.address?.trim()
          ? employee.address.trim()
          : meta.label,
      value:
        meta.fieldKind === "username" && meta.urlPrefix
          ? urlToUsername(meta.urlPrefix, value)
          : value,
      href: sanitizeHref(meta.buildHref(value)),
      tint: tintFor(key),
      category: CORE_LINK_CATEGORY[key],
      platform: CORE_LINK_PLATFORM[key],
    });
  }

  if (employee.email && !disabledKeys.has("core:email")) {
    rows.push({
      id: "core:email",
      key: "email",
      icon: <MailOutlined />,
      iconSrc: "/imgs/icons/mail.svg",
      label: "E-poçt",
      value: employee.email,
      href: sanitizeHref(`mailto:${employee.email}`),
      tint: tintFor("email"),
      category: "contact",
      platform: "email",
    });
  }

  contactInfos.forEach((info, index) => {
    if (isContactInfoMetadata(info)) return;
    if (disabledKeys.has(contactInfoRowKey(info))) return;
    const id = contactRowId(info.contactType, index);
    if (!info.value) return;
    const resolvedType = resolveContactInfoType(info);
    const meta = contactInfoMeta(info);
    rows.push({
      id,
      key: `ci-${info.contactType}-${index}`,
      icon: meta.icon,
      iconSrc: meta.iconSrc,
      label: info.label || meta.title,
      value: info.value,
      href: sanitizeHref(contactInfoHref(info)),
      tint: tintFor(resolvedType ?? info.contactType),
      category: meta.category,
      platform: resolvedType ?? info.contactType.toLowerCase(),
    });
  });

  (employee.socialAccounts ?? []).forEach((account, index) => {
    const id = socialRowId(account.platformName, index);
    if (!account.profileUrl) return;
    if (disabledKeys.has(socialAccountRowKey(account))) return;
    const websiteHeadline = customWebsiteHeadline(account.platformName);
    const resolvedType = websiteHeadline
      ? undefined
      : resolveLinkType(account.platformName);
    const meta = websiteHeadline
      ? LINK_TYPE_META.website
      : linkMetaFor(account.platformName);
    rows.push({
      id,
      key: `sa-${account.platformName}-${index}`,
      icon: meta.icon,
      iconSrc: websiteHeadline
        ? (account.iconUrl ?? meta.iconSrc)
        : (meta.iconSrc ?? account.iconUrl),
      label: websiteHeadline ?? meta.title,
      value: account.profileUrl,
      href: sanitizeHref(account.profileUrl),
      tint: tintFor(resolvedType ?? account.platformName),
      category: meta.category,
      platform: resolvedType ?? account.platformName.toLowerCase(),
    });
  });

  return dedupeByPlatformAndHref(rows);
}
