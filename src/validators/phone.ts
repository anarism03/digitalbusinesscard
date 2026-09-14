import { z } from "zod";

export const PHONE_MAX = 30;
export const PHONE_MAX_MESSAGE = `Nömrə maksimum ${PHONE_MAX} simvol ola bilər`;

export const phone = z.string().trim().max(PHONE_MAX, PHONE_MAX_MESSAGE);

export const phoneRequired = (message: string) =>
  z.string().trim().min(1, message).max(PHONE_MAX, PHONE_MAX_MESSAGE);
