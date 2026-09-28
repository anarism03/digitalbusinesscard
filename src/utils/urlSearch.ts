type SearchParamValue = string | number | boolean | null | undefined;

export function readPositiveInt(
  value: string | null,
  fallback: number,
): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function updateSearchParams(
  current: URLSearchParams,
  updates: Record<string, SearchParamValue>,
): URLSearchParams {
  const next = new URLSearchParams(current);

  Object.entries(updates).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === false
    ) {
      next.delete(key);
      return;
    }

    next.set(key, String(value));
  });

  return next;
}
