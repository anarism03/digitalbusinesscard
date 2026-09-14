import type { MessageInstance } from "antd/es/message/interface";
import { strings } from "../constants/strings";
let api: MessageInstance | null = null;
export function bindMessageApi(instance: MessageInstance): void {
  api = instance;
}
export const message = {
  success: (content: string) => api?.success(content),
  error: (content: string) => api?.error(content),
  warning: (content: string) => api?.warning(content),
  info: (content: string) => api?.info(content),
};

export function copyToClipboard(value?: string): void {
  if (!value) return;
  navigator.clipboard.writeText(value).then(
    () => message.success("Kopyalandı"),
    () => message.error(strings.errors.generic),
  );
}
