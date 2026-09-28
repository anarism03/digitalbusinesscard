import type { ContactCardFields, ContactInfo } from "../types";
import { resolveContactInfoType } from "./linkTypeResolution";

const CONTACT_CARD_PREFIX = "contact-card:";
const CONTACT_CARD_LABEL_PREFIX = "__setclapp_contact_card__:";

const DEFAULT_CONTACT_CARD_BUTTON_LABEL = "Kontaktı Yüklə";

export function normalizeContactCardButtonLabel(label?: string): string {
  const trimmed = label?.trim() ?? "";
  const isKnownSaveLabel = /^kontakt[iı]\s+yadda\s+saxla+$/iu.test(trimmed);

  return !trimmed || isKnownSaveLabel
    ? DEFAULT_CONTACT_CARD_BUTTON_LABEL
    : trimmed;
}

const CONTACT_CARD_FIELD_KEYS: (keyof ContactCardFields)[] = [
  "buttonLabel",
  "name",
  "website",
];

type ContactCardEntryKey = keyof ContactCardFields | "enabled";

function contactCardFieldKey(info: {
  contactType: string;
  label?: string;
}): ContactCardEntryKey | undefined {
  const rawKey = info.contactType.startsWith(CONTACT_CARD_PREFIX)
    ? info.contactType.slice(CONTACT_CARD_PREFIX.length)
    : info.label?.startsWith(CONTACT_CARD_LABEL_PREFIX)
      ? info.label.slice(CONTACT_CARD_LABEL_PREFIX.length)
      : undefined;
  const key = rawKey as ContactCardEntryKey | undefined;
  return key && (key === "enabled" || CONTACT_CARD_FIELD_KEYS.includes(key))
    ? key
    : undefined;
}

export function isContactCardField(info: {
  contactType: string;
  label?: string;
}): boolean {
  return (
    info.contactType.startsWith(CONTACT_CARD_PREFIX) ||
    Boolean(info.label?.startsWith(CONTACT_CARD_LABEL_PREFIX))
  );
}

function readContactCardFields(contactInfos: ContactInfo[]): ContactCardFields {
  const fields: ContactCardFields = { buttonLabel: "", name: "", website: "" };
  contactInfos.forEach((info) => {
    const key = contactCardFieldKey(info);
    if (key && key !== "enabled") fields[key] = info.value;
  });
  return fields;
}

export function hasContactCardFields(fields: ContactCardFields): boolean {
  return CONTACT_CARD_FIELD_KEYS.some((key) => fields[key].trim());
}

export function buildContactCardEntries(
  fields: ContactCardFields,
  enabled?: boolean,
): ContactInfo[] {
  const values = {
    buttonLabel: fields.buttonLabel.trim(),
    name: fields.name.trim(),
    website: fields.website.trim(),
    enabled: enabled === undefined ? "" : String(enabled),
  };
  return Object.entries(values)
    .filter(([, value]) => value)
    .map(([key, value]) => ({
      contactType: "phone",
      value,
      label: `${CONTACT_CARD_LABEL_PREFIX}${key}`,
    }));
}

export function isContactCardEnabled(
  contactInfos: ContactInfo[] | undefined,
): boolean {
  const marker = contactInfos?.find(
    (info) => contactCardFieldKey(info) === "enabled",
  );
  return marker?.value.trim().toLowerCase() !== "false";
}

export function setContactCardEnabled(
  contactInfos: ContactInfo[] | undefined,
  enabled: boolean,
): ContactInfo[] {
  const normalized = normalizeContactCardEntries(contactInfos);
  const marker: ContactInfo = {
    contactType: "phone",
    value: String(enabled),
    label: `${CONTACT_CARD_LABEL_PREFIX}enabled`,
  };
  return normalized.some((info) => contactCardFieldKey(info) === "enabled")
    ? normalized.map((info) =>
        contactCardFieldKey(info) === "enabled" ? marker : info,
      )
    : [...normalized, marker];
}

function looksLikeUrl(value: string): boolean {
  return /^(?:https?:\/\/|www\.)/i.test(value.trim());
}

function isContactValue({ value }: ContactInfo): boolean {
  const trimmed = value.trim();
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ||
    looksLikeUrl(trimmed) ||
    (/^[+()\d\s-]+$/.test(trimmed) && trimmed.replace(/\D/g, "").length >= 7)
  );
}

function isUnlabeledPhoneInfo(info: ContactInfo): boolean {
  return !info.label?.trim() && resolveContactInfoType(info) === "phone";
}

function recoverSplitContactCardEntries(
  contactInfos: ContactInfo[],
): ContactInfo[] | undefined {
  for (let start = 0; start < contactInfos.length; start += 1) {
    if (!isUnlabeledPhoneInfo(contactInfos[start])) continue;

    let end = start;
    while (
      end < contactInfos.length &&
      isUnlabeledPhoneInfo(contactInfos[end])
    ) {
      end += 1;
    }

    const run = contactInfos.slice(start, end);
    if (
      run.length >= 3 &&
      !run.slice(0, 2).some(isContactValue) &&
      run.slice(2).some(isContactValue)
    ) {
      const websiteIndex = run.findIndex(
        (info, index) => index >= 2 && looksLikeUrl(info.value),
      );
      return [
        ...contactInfos.slice(0, start),
        ...buildContactCardEntries({
          buttonLabel: run[0].value,
          name: run[1].value,
          website: run[websiteIndex]?.value ?? "",
        }),
        ...run.filter((_, index) => index >= 2 && index !== websiteIndex),
        ...contactInfos.slice(end),
      ];
    }
    start = end - 1;
  }

  return undefined;
}

export function normalizeContactCardEntries(
  contactInfos: ContactInfo[] | undefined,
): ContactInfo[] {
  const infos = contactInfos ?? [];
  const hasOldTypeFields = infos.some((info) =>
    info.contactType.startsWith(CONTACT_CARD_PREFIX),
  );
  if (hasOldTypeFields) {
    const fields = readContactCardFields(infos);
    const enabled = isContactCardEnabled(infos);
    const firstFieldIndex = infos.findIndex(isContactCardField);
    return infos.flatMap((info, index) => {
      if (index === firstFieldIndex) {
        return buildContactCardEntries(fields, enabled);
      }
      return isContactCardField(info) ? [] : [info];
    });
  }
  if (infos.some(isContactCardField)) return infos;
  return recoverSplitContactCardEntries(infos) ?? infos;
}

export function getContactCardFields(
  contactInfos: ContactInfo[] | undefined,
): ContactCardFields {
  const fields = readContactCardFields(
    normalizeContactCardEntries(contactInfos),
  );
  if (fields.buttonLabel.trim()) {
    fields.buttonLabel = normalizeContactCardButtonLabel(fields.buttonLabel);
  }
  return fields;
}
