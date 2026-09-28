import { z } from "zod";
import { strings } from "../constants/strings";

export const createLoginSchema = (isSuperAdminMode: boolean) =>
  z
    .object({
      email: z
        .string()
        .min(1, strings.auth.emailRequired)
        .email(strings.auth.emailInvalid),
      password: z.string().min(1, strings.auth.passwordRequired),
      companyVoen: z.string().optional(),
    })
    .superRefine((values, context) => {
      if (isSuperAdminMode) return;

      if (!values.companyVoen) {
        context.addIssue({
          code: "custom",
          path: ["companyVoen"],
          message: "VÖEN tələb olunur",
        });
        return;
      }

      if (!/^\d{10}$/.test(values.companyVoen)) {
        context.addIssue({
          code: "custom",
          path: ["companyVoen"],
          message: "VÖEN 10 rəqəmdən ibarət olmalıdır",
        });
      }
    });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Cari şifrə tələb olunur"),
    newPassword: z
      .string()
      .min(1, "Yeni şifrə tələb olunur")
      .min(8, "Şifrə ən az 8 simvol olmalıdır"),
    confirmPassword: z.string().min(1, "Təkrar şifrə tələb olunur"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Şifrələr eyni deyil",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const firstLoginPasswordSchema = changePasswordSchema.refine(
  (d) => d.newPassword !== d.oldPassword,
  {
    message: "Yeni şifrə cari şifrədən fərqli olmalıdır",
    path: ["newPassword"],
  },
);

export type FirstLoginPasswordValues = z.infer<typeof firstLoginPasswordSchema>;
