import type { ContactInfo, SocialAccount } from "../types";
import { isContactCardField } from "./contactCardFields";
import type { CoreLinkKey } from "./linkTypeResolution";

const DISABLED_LINKS_LABEL_PREFIX = "__setclapp_disabled_links__:";
const GOOGLE_MAPS_HEADLINE_PREFIX = "__setclapp_googlemaps_headline__:";

export function coreLinkRowKey(key: CoreLinkKey): string {
  return `core:${key}`;
}

export function contactInfoRowKey(
  info: Pick<ContactInfo, "contactType" | "value">,
): string {
  return `contact:${info.contactType}:${info.value}`;
}

export function socialAccountRowKey(
  account: Pick<SocialAccount, "platformName" | "profileUrl">,
): string {
  return `social:${account.platformName}:${account.profileUrl}`;
}

function isDisabledLinksMarker(
  info: Pick<ContactInfo, "label">,
): boolean {
  return Boolean(info.label?.startsWith(DISABLED_LINKS_LABEL_PREFIX));
}

function isGoogleMapsContactInfo(info: Pick<ContactInfo, "label">): boolean {
  return Boolean(info.label?.startsWith(GOOGLE_MAPS_HEADLINE_PREFIX));
}

export function isContactInfoMetadata(info: ContactInfo): boolean {
  return (
    isContactCardField(info) ||
    isDisabledLinksMarker(info) ||
    isGoogleMapsContactInfo(info)
  );
}

function disabledLinksMarker(
  contactInfos: ContactInfo[],
): ContactInfo | undefined {
  return contactInfos.find(isDisabledLinksMarker);
}

export function getDisabledLinkKeys(
  contactInfos: ContactInfo[] | undefined,
): Set<string> {
  const marker = disabledLinksMarker(contactInfos ?? []);
  if (!marker) return new Set();
  try {
    const parsed: unknown = JSON.parse(marker.value);
    return new Set(
      Array.isArray(parsed)
        ? parsed.filter((value): value is string => typeof value === "string")
        : [],
    );
  } catch {
    return new Set();
  }
}

export function setLinkRowEnabled(
  contactInfos: ContactInfo[] | undefined,
  rowKey: string,
  enabled: boolean,
): ContactInfo[] {
  const infos = contactInfos ?? [];
  const keys = getDisabledLinkKeys(infos);
  if (enabled) keys.delete(rowKey);
  else keys.add(rowKey);

  const withoutMarker = infos.filter((info) => !isDisabledLinksMarker(info));
  if (keys.size === 0) return withoutMarker;

  return [
    ...withoutMarker,
    {
      contactType: "phone",
      value: JSON.stringify([...keys]),
      label: DISABLED_LINKS_LABEL_PREFIX,
    },
  ];
}
