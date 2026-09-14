import { z } from "zod";

export const firstLoginPasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Cari şifrə tələb olunur"),
    newPassword: z
      .string()
      .min(1, "Yeni şifrə tələb olunur")
      .min(6, "Şifrə ən az 6 simvol olmalıdır"),
    confirmPassword: z.string().min(1, "Təkrar şifrə tələb olunur"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Şifrələr eyni deyil",
    path: ["confirmPassword"],
  })
  .refine((d) => d.newPassword !== d.oldPassword, {
    message: "Yeni şifrə cari şifrədən fərqli olmalıdır",
    path: ["newPassword"],
  });

export type FirstLoginPasswordValues = z.infer<typeof firstLoginPasswordSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Cari şifrə tələb olunur"),
    newPassword: z
      .string()
      .min(1, "Yeni şifrə tələb olunur")
      .min(6, "Şifrə ən az 6 simvol olmalıdır"),
    confirmPassword: z.string().min(1, "Təkrar şifrə tələb olunur"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Şifrələr eyni deyil",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
