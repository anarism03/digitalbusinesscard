import { z } from "zod";

export const maxMessage = (label: string, max: number) =>
  `${label} maksimum ${max} simvol ola bilər`;

export const requiredText = (message: string) => z.string().trim().min(1, message);

export const requiredLimitedText = (
  message: string,
  label: string,
  max: number,
) => requiredText(message).max(max, maxMessage(label, max));
