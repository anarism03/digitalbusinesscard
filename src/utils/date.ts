import dayjs from "dayjs";

function formatIso(iso: string, template: string): string {
  const date = dayjs(iso);
  return date.isValid() ? date.format(template) : iso;
}

export function formatDateTime(iso: string): string {
  return formatIso(iso, "DD.MM.YYYY HH:mm");
}

export function formatDateShort(iso: string): string {
  return formatIso(iso, "DD MMM");
}
