export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function shortId(value?: string): string {
  if (!value) return "—";
  return value.length > 12 ? `${value.slice(0, 8)}…` : value;
}

const ALLOWED_NUMBER_KEYS = [
  "Backspace",
  "Delete",
  "Tab",
  "Enter",
  "Escape",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
];

export function isAllowedNumberKey(key: string): boolean {
  return /^\d$/.test(key) || ALLOWED_NUMBER_KEYS.includes(key);
}
