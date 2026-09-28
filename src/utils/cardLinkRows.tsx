import {
  CORE_LINK_CATEGORY,
  CORE_LINK_META,
  CORE_LINK_ORDER,
  LINK_TYPE_META,
} from "../constants/linkTypes";
import { MailOutlined } from "@ant-design/icons";
import type {
  ContactInfo,
  CoreLinkKey,
  Employee,
  LinkType,
  LinkTypeMeta,
  ViewLinkGroup,
  ViewLinkRow,
} from "../types";
import {
  buildWhatsAppLink,
  hasUnsafeUrlScheme,
  normalizePhone,
  usernameToUrl,
  urlToUsername,
} from "./url";
import {
  contactInfoMeta,
  customWebsiteHeadline,
  linkMetaFor,
  resolveContactInfoType,
  resolveLinkType,
  tintFor,
} from "./linkTypeResolution";
import {
  isContactInfoMetadata,
  contactInfoRowKey,
  coreLinkRowKey,
  getDisabledLinkKeys,
  socialAccountRowKey,
} from "./linkVisibility";
import { normalizeContactCardEntries } from "./contactCardFields";

export const contactRowId = (contactType: string, index: number) =>
  `contact:${contactType}:${index}`;
export const socialRowId = (platformName: string, index: number) =>
  `social:${platformName}:${index}`;

const CORE_LINK_PLATFORM: Partial<Record<CoreLinkKey, string>> = {
  phone1: "phone",
  phone2: "phone",
  whatsappPhone: "whatsapp",
  linkedinUrl: "linkedin",
  facebookUrl: "facebook",
  instagramUrl: "instagram",
  googleMapsUrl: "googlemaps",
};

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

function contactInfoHref(
  info: ContactInfo,
  type: LinkType | undefined,
  meta: LinkTypeMeta,
): string {
  switch (type) {
    case "email":
      return `mailto:${info.value}`;
    case "whatsapp":
    case "whatsapp-business":
      return buildWhatsAppLink(info.value);
    case "sms":
      return `sms:${normalizePhone(info.value)}`;
    case "viber":
      return `viber://chat?number=${encodeURIComponent(normalizePhone(info.value))}`;
    default:
      if (meta.fieldKind === "username" && meta.urlPrefix) {
        return usernameToUrl(meta.urlPrefix, info.value);
      }
      return meta.fieldKind === "phone" ? `tel:${info.value}` : info.value;
  }
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
    const dedupeKey = `${row.platform}::${row.href.trim().toLowerCase().replace(/\/+$/, "")}`;
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
    if (!value || disabledKeys.has(coreLinkRowKey(key))) continue;
    const meta = CORE_LINK_META[key];
    rows.push({
      id: coreLinkRowKey(key),
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
      icon: <MailOutlined />,
      iconSrc: LINK_TYPE_META.email.iconSrc,
      label: "E-poçt",
      value: employee.email,
      href: sanitizeHref(`mailto:${employee.email}`),
      tint: tintFor("email"),
      category: "contact",
      platform: "email",
    });
  }

  contactInfos.forEach((info, index) => {
    if (
      !info.value ||
      isContactInfoMetadata(info) ||
      disabledKeys.has(contactInfoRowKey(info))
    ) {
      return;
    }
    const resolvedType = resolveContactInfoType(info);
    const meta = contactInfoMeta(info);
    rows.push({
      id: contactRowId(info.contactType, index),
      icon: meta.icon,
      iconSrc: meta.iconSrc,
      label: info.label || meta.title,
      value: info.value,
      href: sanitizeHref(contactInfoHref(info, resolvedType, meta)),
      tint: tintFor(resolvedType ?? info.contactType),
      category: meta.category,
      platform: resolvedType ?? info.contactType.toLowerCase(),
    });
  });

  (employee.socialAccounts ?? []).forEach((account, index) => {
    if (!account.profileUrl || disabledKeys.has(socialAccountRowKey(account))) {
      return;
    }
    const websiteHeadline = customWebsiteHeadline(account.platformName);
    const resolvedType = websiteHeadline
      ? undefined
      : resolveLinkType(account.platformName);
    const meta = websiteHeadline
      ? LINK_TYPE_META.website
      : linkMetaFor(account.platformName);
    rows.push({
      id: socialRowId(account.platformName, index),
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
