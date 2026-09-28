import { z } from "zod";
import { phone, phoneRequired } from "./phone";
import { maxMessage, requiredLimitedText } from "./textRules";
import { hasUnsafeUrlScheme } from "../utils/url";

const limitedText = (label: string, max: number) =>
  z.string().trim().max(max, maxMessage(label, max));

const safeUrlText = (label: string, max: number) =>
  limitedText(label, max).refine(
    (value) => !hasUnsafeUrlScheme(value),
    `${label} üçün düzgün olmayan protokol istifadə olunub`,
  );

export const createEmployeeSchema = z.object({
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
  additionalInfo: limitedText("Əlavə məlumat", 150).optional(),
  linkedinUrl: safeUrlText("LinkedIn linki", 200).optional(),
  facebookUrl: safeUrlText("Facebook linki", 200).optional(),
  instagramUrl: safeUrlText("Instagram linki", 200).optional(),
  googleMapsUrl: safeUrlText("Google Maps linki", 300).optional(),
});

export type ProfileEditValues = z.infer<typeof profileEditSchema>;
