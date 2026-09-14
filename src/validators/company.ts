import { z } from "zod";
import { PHONE_MAX, phoneRequired } from "./phone";
import { maxMessage, requiredText, requiredLimitedText } from "./textRules";

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => v || undefined);
const optionalLimitedText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .max(max, maxMessage(label, max))
    .optional()
    .transform((v) => v || undefined);

const phoneSchema = phoneRequired("Telefon tələb olunur");

const voenSchema = requiredText("VÖEN tələb olunur").refine(
  (v) => /^\d{10}$/.test(v),
  "VÖEN 10 simvoldan ibarət olmalıdır",
);

export const companySchema = z.object({
  name: requiredLimitedText(
    "Şirkət adı tələb olunur",
    "Şirkət adı",
    100,
  ).min(2, "Ad ən az 2 simvol olmalıdır"),
  userLimit: z
    .number({
      required_error: "Limit tələb olunur",
      invalid_type_error: "Limit rəqəm olmalıdır",
    })
    .int("Limit tam rəqəm olmalıdır")
    .min(1, "Limit ən az 1 olmalıdır")
    .max(100, "Əməkdaş limiti maksimum 100 ola bilər"),
  voen: voenSchema,
  logoUrl: optionalText,
  address: requiredLimitedText("Ünvan tələb olunur", "Ünvan", 250),
  email: requiredLimitedText("E-poçt tələb olunur", "E-poçt", 100).email(
    "E-poçt düzgün deyil",
  ),
  phone: phoneSchema,
});

export type CompanyFormValues = z.infer<typeof companySchema>;

export const companySettingsSchema = z.object({
  name: requiredLimitedText("Ad tələb olunur", "Şirkət adı", 100),
  voen: optionalLimitedText("VÖEN", 10),
  address: optionalLimitedText("Ünvan", 250),
  email: optionalLimitedText("E-poçt", 100).refine(
    (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    "E-poçt düzgün deyil",
  ),
  phone: optionalLimitedText("Telefon", PHONE_MAX),
  logoUrl: optionalText,
  userLimit: z.number().int().min(1).max(100).optional(),
  nfcBaseUrl: optionalLimitedText("NFC Base URL", 250),
});

export type CompanySettingsValues = z.infer<typeof companySettingsSchema>;
