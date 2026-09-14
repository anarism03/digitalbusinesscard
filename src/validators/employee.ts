import { z } from "zod";
import { phone, phoneRequired } from "./phone";
import { maxMessage, requiredLimitedText } from "./textRules";
import { hasUnsafeUrlScheme } from "../utils/linkHelpers";

const limitedText = (label: string, max: number) =>
  z.string().trim().max(max, maxMessage(label, max));

const safeUrlText = (label: string, max: number) =>
  limitedText(label, max).refine(
    (value) => !hasUnsafeUrlScheme(value),
    `${label} üçün düzgün olmayan protokol istifadə olunub`,
  );

const digitsOptional = limitedText("Daxili nömrə", 50)
  .optional()
  .refine((value) => !value || /^\d+$/.test(value), "Yalnız rəqəm daxil edin");

const safeUrlValue = z
  .string()
  .refine(
    (value) => !hasUnsafeUrlScheme(value),
    "Düzgün olmayan protokol istifadə olunub",
  );

const contactInfoSchema = z.object({
  contactType: z.string(),
  value: safeUrlValue,
  label: z.string().optional(),
  displayOrder: z.number().optional(),
});

const socialAccountSchema = z.object({
  platformName: z.string(),
  profileUrl: safeUrlValue,
  iconUrl: safeUrlValue.optional(),
});

const baseFields = z.object({
  firstName: requiredLimitedText("Ad tələb olunur", "Ad", 50).min(
    2,
    "Ad ən az 2 simvol olmalıdır",
  ),
  lastName: requiredLimitedText("Soyad tələb olunur", "Soyad", 50).min(
    2,
    "Soyad ən az 2 simvol olmalıdır",
  ),
  middleName: limitedText("Ata adı", 50).optional(),
  jobTitle: requiredLimitedText("Vəzifə tələb olunur", "Vəzifə", 100),
  email: requiredLimitedText("E-poçt tələb olunur", "E-poçt", 50).email(
    "E-poçt düzgün deyil",
  ),
  phone1: phoneRequired("İş telefonu tələb olunur"),
  phone2: phone,
  extensionNumber: digitsOptional,
  whatsappPhone: phone,
  additionalInfo: limitedText("Əlavə məlumat", 150).optional(),
  linkedinUrl: safeUrlText("LinkedIn linki", 200).optional(),
  facebookUrl: safeUrlText("Facebook linki", 200).optional(),
  instagramUrl: safeUrlText("Instagram linki", 200).optional(),
  googleMapsUrl: safeUrlText("Google Maps linki", 300).optional(),
  contactInfos: z.array(contactInfoSchema).optional(),
  socialAccounts: z.array(socialAccountSchema).optional(),
  isActive: z.boolean().optional(),
  canEdit: z.boolean().optional(),
});

export const createEmployeeSchema = baseFields.extend({
  password: requiredLimitedText("Şifrə tələb olunur", "Şifrə", 150).min(
    6,
    "Şifrə ən az 6 simvol olmalıdır",
  ),
});

export type EmployeeFormValues = z.infer<typeof createEmployeeSchema>;

export const profileEditSchema = z.object({
  firstName: requiredLimitedText("Ad tələb olunur", "Ad", 50),
  lastName: requiredLimitedText("Soyad tələb olunur", "Soyad", 50),
  middleName: limitedText("Ata adı", 50).optional(),
  jobTitle: limitedText("Vəzifə", 100).optional(),
  phone1: phone.optional(),
  phone2: phone.optional(),
  whatsappPhone: phone.optional(),
  extensionNumber: digitsOptional,
  additionalInfo: limitedText("Əlavə məlumat", 150).optional(),
  linkedinUrl: safeUrlText("LinkedIn linki", 200).optional(),
  facebookUrl: safeUrlText("Facebook linki", 200).optional(),
  instagramUrl: safeUrlText("Instagram linki", 200).optional(),
  googleMapsUrl: safeUrlText("Google Maps linki", 300).optional(),
});

export type ProfileEditValues = z.infer<typeof profileEditSchema>;
