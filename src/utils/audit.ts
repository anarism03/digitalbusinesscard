import type { AuditChange } from "../types";

const ACTION_RULES: { match: string; label: string; color: string }[] = [
  { match: "DEACTIV", label: "Deaktiv edildi", color: "error" },
  { match: "ACTIVAT", label: "Aktivləşdirildi", color: "success" },
  { match: "CREAT", label: "Yaradıldı", color: "success" },
  { match: "ADD", label: "Əlavə edildi", color: "success" },
  { match: "DELET", label: "Silindi", color: "error" },
  { match: "REMOV", label: "Silindi", color: "error" },
  { match: "LOGIN", label: "Giriş etdi", color: "geekblue" },
  { match: "IMPORT", label: "İdxal etdi", color: "cyan" },
  { match: "EXPORT", label: "İxrac etdi", color: "geekblue" },
  { match: "UPDAT", label: "Yenilədi", color: "blue" },
  { match: "EDIT", label: "Yenilədi", color: "blue" },
  { match: "CHANG", label: "Yenilədi", color: "blue" },
  { match: "MODIF", label: "Yenilədi", color: "blue" },
];

export function resolveAction(action?: string): {
  label: string;
  color: string;
} {
  if (!action) return { label: "-", color: "default" };
  const upper = action.toUpperCase();
  const rule = ACTION_RULES.find((r) => upper.includes(r.match));
  return rule
    ? { label: rule.label, color: rule.color }
    : { label: action, color: "default" };
}

export function resolveEntity(entity?: string): string {
  if (!entity) return "-";
  const lower = entity.toLowerCase();
  if (lower.includes("user") || lower.includes("employee")) return "Əməkdaş";
  if (lower.includes("company")) return "Şirkət";
  if (lower.includes("scan")) return "Skan";
  if (lower.includes("auth") || lower.includes("login")) return "Giriş";
  return entity;
}

const FIELD_LABELS: Record<string, string> = {
  firstname: "Ad",
  lastname: "Soyad",
  middlename: "Ata adı",
  jobtitle: "Vəzifə",
  phone1: "İş telefonu",
  phone2: "Şəxsi telefon",
  whatsappphone: "WhatsApp",
  extensionnumber: "Daxili nömrə",
  additionalinfo: "Əlavə məlumat",
  email: "E-poçt",
  isactive: "Status",
  isdeleted: "Vəziyyət",
  canedit: "Redaktə icazəsi",
  caneditprofile: "Redaktə icazəsi",
  name: "Ad",
  address: "Ünvan",
  contact: "Əlaqə",
  voen: "VÖEN",
  userlimit: "İstifadəçi limiti",
  employeelimit: "Əməkdaş limiti",
  logourl: "Loqo",
  photourl: "Foto",
  role: "Rol",
  linkedinurl: "LinkedIn",
  facebookurl: "Facebook",
  instagramurl: "Instagram",
  contacttype: "Növ",
  label: "Etiket",
  value: "Dəyər",
  platformname: "Platform",
  profileurl: "Link",
  iconurl: "İkon",
};

function labelFor(key: string): string {
  return FIELD_LABELS[key.toLowerCase()] ?? key;
}

const CONTACT_CARD_SUFFIX_LABELS: Record<string, string> = {
  name: "Kontakt kartı adı",
  buttonlabel: "Kontakt kartı düymə adı",
  website: "Kontakt kartı vebsaytı",
  enabled: "Kontakt kartı aktivliyi",
};

function friendlyMarkerLabel(rawLabel: string): string | undefined {
  if (rawLabel.startsWith("__setclapp_contact_card__:")) {
    const suffix = rawLabel.slice("__setclapp_contact_card__:".length).toLowerCase();
    return CONTACT_CARD_SUFFIX_LABELS[suffix] ?? "Kontakt kartı sazlaması";
  }
  if (rawLabel.startsWith("__setclapp_disabled_links__:")) {
    return "Gizlədilmiş linklər siyahısı";
  }
  if (rawLabel.startsWith("__setclapp_googlemaps_headline__:")) {
    return "Google Maps başlığı";
  }
  return undefined;
}

const IGNORED_KEYS = new Set([
  "id",
  "companyid",
  "userid",
  "createdat",
  "updatedat",
  "createdby",
  "updatedby",
  "passwordhash",
  "password",
  "securitystamp",
  "concurrencystamp",
  "normalizedemail",
  "normalizedusername",
  "rowversion",
  "isfirstlogin",
  "passwordexpirydate",
  "qrcodedata",
  "nfcid",
  "displayorder",
]);

const ROLE_LABELS: Record<string, string> = {
  "0": "Super Admin",
  "1": "Şirkət Admini",
  "2": "Əməkdaş",
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function findFirst(
  primary: Record<string, unknown>,
  fallback: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const source of [primary, fallback]) {
    for (const wantedKey of keys) {
      const actualKey = Object.keys(source).find(
        (key) => key.toLowerCase() === wantedKey,
      );
      if (actualKey && typeof source[actualKey] === "string" && source[actualKey]) {
        return source[actualKey] as string;
      }
    }
  }
  return undefined;
}

function parseMaybeJson(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  const looksJson =
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"));
  if (looksJson) {
    try {
      return JSON.parse(trimmed);
    } catch {}
  }
  return value;
}

function formatValue(
  key: string,
  value: unknown,
  variant: "before" | "after" = "after",
): string {
  if (value === undefined || value === null || value === "") return "boş";
  const lower = key.toLowerCase();

  if (
    lower.includes("logo") ||
    lower.includes("photo") ||
    lower.includes("image")
  ) {
    return variant === "before" ? "əvvəlki şəkil" : "yeni şəkil";
  }
  if (typeof value === "boolean") {
    if (lower === "isactive") return value ? "Aktiv" : "Deaktiv";
    if (lower === "isdeleted") return value ? "Silinib" : "Aktivdir";
    if (lower === "canedit" || lower === "caneditprofile") {
      return value ? "Var" : "Yoxdur";
    }
    return value ? "Bəli" : "Xeyr";
  }
  if (lower === "role") return ROLE_LABELS[String(value)] ?? String(value);

  const text =
    typeof value === "object" ? JSON.stringify(value) : String(value);
  if (text.startsWith("data:")) return variant === "before" ? "əvvəlki şəkil" : "yeni şəkil";
  if (lower === "label") return friendlyMarkerLabel(text) ?? text;
  return text;
}

export function buildAuditChanges(raw: unknown): AuditChange[] {
  const record = isPlainObject(raw) ? raw : {};
  const before = parseMaybeJson(
    record.oldValues ??
      record.OldValues ??
      record.beforeValue ??
      record.oldValue ??
      record.previousValue,
  );
  const after = parseMaybeJson(
    record.newValues ??
      record.NewValues ??
      record.afterValue ??
      record.newValue ??
      record.currentValue,
  );

  if (isPlainObject(before) || isPlainObject(after)) {
    const beforeObj = isPlainObject(before) ? before : {};
    const afterObj = isPlainObject(after) ? after : {};
    const keys = new Set<string>([
      ...Object.keys(beforeObj),
      ...Object.keys(afterObj),
    ]);
    const changes: AuditChange[] = [];
    keys.forEach((key) => {
      if (IGNORED_KEYS.has(key.toLowerCase())) return;
      const oldRaw = beforeObj[key];
      const newRaw = afterObj[key];

      const oldEmpty = oldRaw === undefined || oldRaw === null || oldRaw === "";
      const newEmpty = newRaw === undefined || newRaw === null || newRaw === "";
      if (oldRaw === newRaw || (oldEmpty && newEmpty)) return;

      const from = oldRaw === undefined ? undefined : formatValue(key, oldRaw, "before");
      const to = newRaw === undefined ? undefined : formatValue(key, newRaw, "after");
      changes.push({ label: labelFor(key), from, to });
    });

    if (changes.length === 1 && changes[0].label === labelFor("isdeleted")) {
      const identifier = findFirst(afterObj, beforeObj, ["label", "name"]);
      const identifierValue = findFirst(afterObj, beforeObj, ["value", "profileurl"]);
      const context = [identifier, identifierValue].filter(Boolean).join(": ");
      if (context) {
        changes.unshift({ label: "Element", to: context });
      }
    }

    return changes;
  }

  const text = record.changes ?? record.change ?? record.details;
  if (typeof text === "string" && text.trim()) {
    return parseTextChanges(text);
  }
  return [];
}

function parseTextChanges(text: string): AuditChange[] {
  return text
    .split(/\||\r?\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part): AuditChange | null => {
      const colon = part.indexOf(":");
      if (colon === -1) return null;
      const key = part.slice(0, colon).trim();
      if (IGNORED_KEYS.has(key.toLowerCase())) return null;

      const rest = part.slice(colon + 1).trim();
      const arrow = rest.indexOf("->");
      if (arrow !== -1) {
        return {
          label: labelFor(key),
          from: rest.slice(0, arrow).trim(),
          to: rest.slice(arrow + 2).trim(),
        };
      }
      return { label: labelFor(key), to: rest };
    })
    .filter((item): item is AuditChange => item !== null);
}
