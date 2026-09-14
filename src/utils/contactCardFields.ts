import type { ContactInfo } from "../types";
import { resolveContactInfoType } from "./linkTypeResolution";

export interface ContactCardFields {
  buttonLabel: string;
  name: string;
  website: string;
}

const CONTACT_CARD_PREFIX = "contact-card:";
const CONTACT_CARD_LABEL_PREFIX = "__setclapp_contact_card__:";

export const DEFAULT_CONTACT_CARD_BUTTON_LABEL = "Kontaktı Yüklə";

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

const CONTACT_CARD_ENTRY_KEYS: ContactCardEntryKey[] = [
  ...CONTACT_CARD_FIELD_KEYS,
  "enabled",
];

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
  return key && CONTACT_CARD_ENTRY_KEYS.includes(key) ? key : undefined;
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

function emptyContactCardFields(): ContactCardFields {
  return {
    buttonLabel: "",
    name: "",
    website: "",
  };
}

function readContactCardFields(contactInfos: ContactInfo[]): ContactCardFields {
  const fields = emptyContactCardFields();
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
  const fieldEntries = CONTACT_CARD_FIELD_KEYS.filter((key) =>
    fields[key].trim(),
  ).map((key) => ({
    contactType: "phone",
    value: fields[key].trim(),
    label: `${CONTACT_CARD_LABEL_PREFIX}${key}`,
  }));
  if (enabled === undefined) return fieldEntries;
  return [
    ...fieldEntries,
    {
      contactType: "phone",
      value: String(enabled),
      label: `${CONTACT_CARD_LABEL_PREFIX}enabled`,
    },
  ];
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
  let replaced = false;
  const next = normalized.map((info) => {
    if (contactCardFieldKey(info) !== "enabled") return info;
    replaced = true;
    return marker;
  });
  return replaced ? next : [...next, marker];
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function looksLikeUrl(value: string): boolean {
  return /^(?:https?:\/\/|www\.)/i.test(value.trim());
}

function looksLikePhone(value: string): boolean {
  const trimmed = value.trim();
  return /^[+()\d\s-]+$/.test(trimmed) && trimmed.replace(/\D/g, "").length >= 7;
}

function looksLikeText(value: string): boolean {
  return !looksLikeEmail(value) && !looksLikeUrl(value) && !looksLikePhone(value);
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
    while (end < contactInfos.length && isUnlabeledPhoneInfo(contactInfos[end])) {
      end += 1;
    }

    const run = contactInfos.slice(start, end);
    if (
      run.length < 3 ||
      !looksLikeText(run[0].value) ||
      !looksLikeText(run[1].value)
    ) {
      start = end - 1;
      continue;
    }

    const emailIndex = run.findIndex(
      (info, index) => index >= 2 && looksLikeEmail(info.value),
    );
    const websiteIndex = run.findIndex(
      (info, index) => index >= 2 && looksLikeUrl(info.value),
    );
    const phoneIndexes = run
      .map((info, index) => ({ info, index }))
      .filter(({ info, index }) => index >= 2 && looksLikePhone(info.value))
      .map(({ index }) => index);

    if (emailIndex < 0 && websiteIndex < 0 && phoneIndexes.length === 0) {
      start = end - 1;
      continue;
    }

    const consumed = new Set<number>([0, 1]);
    if (websiteIndex >= 0) consumed.add(websiteIndex);

    const fields: ContactCardFields = {
      buttonLabel: run[0].value,
      name: run[1].value,
      website: websiteIndex >= 0 ? run[websiteIndex].value : "",
    };
    const leftovers = run.filter((_, index) => !consumed.has(index));

    return [
      ...contactInfos.slice(0, start),
      ...buildContactCardEntries(fields),
      ...leftovers,
      ...contactInfos.slice(end),
    ];
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
  const fields = readContactCardFields(normalizeContactCardEntries(contactInfos));
  if (fields.buttonLabel.trim()) {
    fields.buttonLabel = normalizeContactCardButtonLabel(fields.buttonLabel);
  }
  return fields;
}
