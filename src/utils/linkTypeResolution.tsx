import type {
  ContactInfo,
  CoreLinkKey,
  LinkType,
  LinkTypeMeta,
  SocialAccount,
} from "../types";
import { LINK_TYPE_META, FALLBACK_LINK_META } from "../constants/linkTypes";
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

const LINK_TYPES_BY_TOKEN = Object.fromEntries(
  (Object.keys(LINK_TYPE_META) as LinkType[]).map((type) => [
    normalizedTypeToken(type),
    type,
  ]),
) as Record<string, LinkType | undefined>;

export function resolveLinkType(
  ...candidates: Array<string | undefined>
): LinkType | undefined {
  for (const candidate of candidates) {
    if (!candidate) continue;
    const token = normalizedTypeToken(candidate);
    const type = LINK_TYPE_ALIASES[token] ?? LINK_TYPES_BY_TOKEN[token];
    if (type) return type;
  }
  return undefined;
}

export function linkMetaFor(
  type: string,
  ...hints: Array<string | undefined>
): LinkTypeMeta {
  const resolvedType = resolveLinkType(type, ...hints);
  if (resolvedType) return LINK_TYPE_META[resolvedType];
  return FALLBACK_LINK_META;
}

export function resolveContactInfoType(
  info: Pick<ContactInfo, "contactType" | "label">,
): LinkType | undefined {
  return resolveLinkType(info.label, info.contactType);
}

export function contactInfoMeta(
  info: Pick<ContactInfo, "contactType" | "label">,
): LinkTypeMeta {
  return linkMetaFor(info.label ?? "", info.contactType);
}

export function isWebsiteSocialAccount(account: SocialAccount): boolean {
  return (
    Boolean(customWebsiteHeadline(account.platformName)) ||
    resolveLinkType(account.platformName) === "website"
  );
}

export function socialAccountLabel(account: SocialAccount): string {
  const websiteHeadline = customWebsiteHeadline(account.platformName);
  if (websiteHeadline) return websiteHeadline;
  const type = resolveLinkType(account.platformName);
  return type ? LINK_TYPE_META[type].title : account.platformName;
}
