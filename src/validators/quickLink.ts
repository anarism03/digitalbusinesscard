import { z } from "zod";
import type { LinkFieldKind } from "../types";
import {
  extractUsername,
  hasUnsafeUrlScheme,
  isValidUrl,
  normalizePhone,
  normalizeUrl,
} from "../utils/linkHelpers";
import { PHONE_MAX, PHONE_MAX_MESSAGE } from "./phone";

export const QUICK_LINK_MAX_ROWS = 5;
export const QUICK_LINK_LABEL_MAX = 50;
export const QUICK_LINK_EMAIL_MAX = 100;
export const QUICK_LINK_URL_MAX = 300;
export const QUICK_LINK_USERNAME_MAX = 60;

const labelSchema = z
  .string()
  .trim()
  .max(
    QUICK_LINK_LABEL_MAX,
    `Başlıq maksimum ${QUICK_LINK_LABEL_MAX} simvol ola bilər`,
  );

const phoneValueSchema = z
  .string()
  .trim()
  .min(1, "Nömrə tələb olunur")
  .max(PHONE_MAX, PHONE_MAX_MESSAGE)
  .transform(normalizePhone);

const emailValueSchema = z
  .string()
  .trim()
  .min(1, "E-poçt tələb olunur")
  .max(
    QUICK_LINK_EMAIL_MAX,
    `E-poçt maksimum ${QUICK_LINK_EMAIL_MAX} simvol ola bilər`,
  )
  .email("E-poçt düzgün deyil");

const urlValueSchema = z
  .string()
  .trim()
  .min(1, "URL tələb olunur")
  .max(
    QUICK_LINK_URL_MAX,
    `URL maksimum ${QUICK_LINK_URL_MAX} simvol ola bilər`,
  )
  .refine(
    (value) => !hasUnsafeUrlScheme(value),
    "Düzgün olmayan protokol istifadə olunub",
  )
  .refine(isValidUrl, "Düzgün URL daxil edin")
  .transform(normalizeUrl);

const usernameValueSchema = z
  .string()
  .trim()
  .min(1, "İstifadəçi adı tələb olunur")
  .transform(extractUsername)
  .refine((value) => value.length > 0, "İstifadəçi adı tələb olunur")
  .refine(
    (value) => value.length <= QUICK_LINK_USERNAME_MAX,
    `İstifadəçi adı maksimum ${QUICK_LINK_USERNAME_MAX} simvol ola bilər`,
  )
  .refine(
    (value) => /^[a-zA-Z0-9._-]+$/.test(value),
    "İstifadəçi adında yalnız hərf, rəqəm, . _ - simvollarına icazə verilir",
  );

export function quickLinkRowSchema(fieldKind: LinkFieldKind) {
  const valueSchema =
    fieldKind === "phone"
      ? phoneValueSchema
      : fieldKind === "email"
        ? emailValueSchema
        : fieldKind === "username"
          ? usernameValueSchema
          : urlValueSchema;

  return z.object({
    label: labelSchema,
    value: valueSchema,
  });
}

export function quickLinkRowsSchema(fieldKind: LinkFieldKind) {
  return z
    .array(quickLinkRowSchema(fieldKind))
    .min(1, "Ən azı bir məlumat daxil edin")
    .max(
      QUICK_LINK_MAX_ROWS,
      `Maksimum ${QUICK_LINK_MAX_ROWS} məlumat əlavə edilə bilər`,
    );
}
