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
};

function copyWithFallback(value: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.cssText = "position:fixed;top:0;left:0;opacity:0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, value.length);
  let succeeded = false;
  try {
    succeeded = document.execCommand("copy");
  } catch {
    succeeded = false;
  }
  textarea.remove();
  return succeeded;
}

export async function copyToClipboard(value?: string): Promise<void> {
  if (!value) return;
  let copied = false;
  try {
    await navigator.clipboard.writeText(value);
    copied = true;
  } catch {
    copied = copyWithFallback(value);
  }
  if (copied) message.success("Kopyalandı");
  else message.error(strings.errors.generic);
}
