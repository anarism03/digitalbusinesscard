import type { ReactNode } from "react";
import {
  EnvironmentOutlined,
  FacebookOutlined,
  GlobalOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  MobileOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import type { ContactInfo, LinkCategory, LinkType, LinkTypeMeta } from "../types";
import { LINK_TYPE_META } from "../constants/linkTypes";
import { buildWhatsAppLink } from "./linkHelpers";

export type CoreLinkKey =
  | "phone1"
  | "phone2"
  | "whatsappPhone"
  | "linkedinUrl"
  | "facebookUrl"
  | "instagramUrl"
  | "googleMapsUrl";

interface CoreLinkMeta {
  label: string;
  icon: ReactNode;
  iconSrc?: string;
  fieldKind: "phone" | "url" | "username";
  urlPrefix?: string;
  buildHref: (value: string) => string;
}

const TINTS: Partial<Record<CoreLinkKey | LinkType, string>> = {
  phone1: "#16a34a",
  phone2: "#16a34a",
  whatsappPhone: "#25d366",
  linkedinUrl: "#0a66c2",
  facebookUrl: "#1877f2",
  instagramUrl: "#e1306c",
  phone: "#16a34a",
  whatsapp: "#25d366",
  linkedin: "#0a66c2",
  facebook: "#1877f2",
  instagram: "#e1306c",
  telegram: "#229ed9",
  youtube: "#ff0000",
  x: "#0f172a",
  messenger: "#0084ff",
  website: "#475569",
  googleMapsUrl: "#34a853",
  email: "#ea4335",
};

export function tintFor(key: string): string {
  const normalizedKey = resolveLinkType(key) ?? key;
  return TINTS[normalizedKey as CoreLinkKey | LinkType] ?? "#1e63d6";
}

const ICONS = "/imgs/icons";

export const CORE_LINK_META: Record<CoreLinkKey, CoreLinkMeta> = {
  phone1: {
    label: "Telefon",
    icon: <PhoneOutlined />,
    iconSrc: `${ICONS}/phone.svg`,
    fieldKind: "phone",
    buildHref: (v) => `tel:${v}`,
  },
  phone2: {
    label: "Şəxsi telefon",
    icon: <MobileOutlined />,
    iconSrc: `${ICONS}/phone.svg`,
    fieldKind: "phone",
    buildHref: (v) => `tel:${v}`,
  },
  whatsappPhone: {
    label: "WhatsApp",
    icon: <WhatsAppOutlined />,
    iconSrc: `${ICONS}/whatsapp.svg`,
    fieldKind: "phone",
    buildHref: buildWhatsAppLink,
  },
  linkedinUrl: {
    label: "LinkedIn",
    icon: <LinkedinOutlined />,
    iconSrc: `${ICONS}/linkedin.svg`,
    fieldKind: "url",
    buildHref: (v) => v,
  },
  facebookUrl: {
    label: "Facebook",
    icon: <FacebookOutlined />,
    iconSrc: `${ICONS}/facebook.svg`,
    fieldKind: "url",
    buildHref: (v) => v,
  },
  instagramUrl: {
    label: "Instagram",
    icon: <InstagramOutlined />,
    iconSrc: `${ICONS}/instagram.svg`,
    fieldKind: "username",
    urlPrefix: "https://www.instagram.com/",
    buildHref: (v) => v,
  },
  googleMapsUrl: {
    label: "Google Maps",
    icon: <EnvironmentOutlined />,
    iconSrc: `${ICONS}/maps.svg`,
    fieldKind: "url",
    buildHref: (v) => v,
  },
};

export const CORE_LINK_ORDER: CoreLinkKey[] = [
  "phone1",
  "phone2",
  "whatsappPhone",
  "linkedinUrl",
  "facebookUrl",
  "instagramUrl",
  "googleMapsUrl",
];

export const CORE_LINK_CATEGORY: Record<CoreLinkKey, LinkCategory> = {
  phone1: "contact",
  phone2: "contact",
  whatsappPhone: "contact",
  linkedinUrl: "social",
  facebookUrl: "social",
  instagramUrl: "social",
  googleMapsUrl: "business",
};

const FALLBACK_META: LinkTypeMeta = {
  title: "Keçid",
  placeholder: "https://...",
  icon: <GlobalOutlined />,
  category: "other",
  fieldKind: "url",
};

const LINK_TYPE_ALIASES: Record<string, LinkType> = {
  tel: "phone",
  telephone: "phone",
  mobile: "phone",
  mobilephone: "phone",
  mail: "email",
  twitter: "x",
  xtwitter: "x",
  web: "website",
  url: "website",
  link: "website",
};

const CUSTOM_WEBSITE_PREFIX = "website::";

export function customWebsitePlatformName(headline: string): string {
  return `${CUSTOM_WEBSITE_PREFIX}${headline.trim()}`;
}

export function customWebsiteHeadline(
  platformName: string,
): string | undefined {
  if (!platformName.startsWith(CUSTOM_WEBSITE_PREFIX)) return undefined;
  return (
    platformName.slice(CUSTOM_WEBSITE_PREFIX.length).trim() || "Sayt linki"
  );
}

function normalizedTypeToken(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("en-US")
    .normalize("NFKD")
    .replace(/[^a-z0-9]/g, "");
}

export function resolveLinkType(
  ...candidates: Array<string | undefined>
): LinkType | undefined {
  for (const candidate of candidates) {
    if (!candidate) continue;
    const token = normalizedTypeToken(candidate);
    const alias = LINK_TYPE_ALIASES[token];
    if (alias) return alias;
    const matchedType = (Object.keys(LINK_TYPE_META) as LinkType[]).find(
      (type) => normalizedTypeToken(type) === token,
    );
    if (matchedType) return matchedType;
  }
  return undefined;
}

export function linkMetaFor(
  type: string,
  ...hints: Array<string | undefined>
): LinkTypeMeta {
  const resolvedType = resolveLinkType(type, ...hints);
  if (resolvedType) return LINK_TYPE_META[resolvedType];
  return FALLBACK_META;
}

export function resolveContactInfoType(
  info: Pick<ContactInfo, "contactType" | "label">,
): LinkType | undefined {
  return resolveLinkType(info.label, info.contactType);
}

export function contactInfoMeta(
  info: Pick<ContactInfo, "contactType" | "label">,
): LinkTypeMeta {
  const resolvedType = resolveContactInfoType(info);
  return resolvedType ? LINK_TYPE_META[resolvedType] : FALLBACK_META;
}
