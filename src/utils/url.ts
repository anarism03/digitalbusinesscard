export function isImageDataUrl(value?: string | null): value is string {
  return /^data:image\//i.test(String(value ?? "").trim());
}

const BASE64_IMAGE_SIGNATURES: [pattern: RegExp, mime: string][] = [
  [/^\/9j\//, "image/jpeg"],
  [/^iVBORw0KGgo/, "image/png"],
  [/^R0lGOD/, "image/gif"],
  [/^UklGR/, "image/webp"],
];

function looksLikeBareBase64Image(value: string): boolean {
  return value.length > 100 && /^[A-Za-z0-9+/]+=*$/.test(value);
}

function bareBase64ToDataUrl(value: string): string {
  const signature = BASE64_IMAGE_SIGNATURES.find(([pattern]) =>
    pattern.test(value),
  );
  return `data:${signature?.[1] ?? "image/jpeg"};base64,${value}`;
}

function resolveAssetUrl(url?: string | null): string | undefined {
  const raw = String(url ?? "").trim();
  if (!raw) return undefined;
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;

  const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
  const rootBase = apiBase.replace(/\/api$/i, "");
  const path = raw.replace(/\\/g, "/").replace(/^\/+/, "");

  return `${rootBase}/${encodeURI(path)}`;
}

export function resolveAssetUrlCandidates(url?: string | null): string[] {
  const raw = String(url ?? "").trim();
  if (!raw) return [];
  if (/^(https?:|data:|blob:)/i.test(raw)) return [raw];
  if (looksLikeBareBase64Image(raw)) return [bareBase64ToDataUrl(raw)];

  const primary = resolveAssetUrl(raw);
  const fallback = resolveAssetFallbackUrl(raw);

  const candidates = [primary, fallback];

  return candidates.filter(
    (item, index, arr): item is string =>
      Boolean(item) && arr.indexOf(item) === index,
  );
}

function resolveAssetFallbackUrl(
  url?: string | null,
): string | undefined {
  const raw = String(url ?? "").trim();
  if (!raw || /^(https?:|data:|blob:)/i.test(raw)) return undefined;

  const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
  const path = raw.replace(/\\/g, "/").replace(/^\/+/, "");

  return `${apiBase}/${encodeURI(path)}`;
}
