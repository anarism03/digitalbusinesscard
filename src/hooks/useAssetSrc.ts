import { useEffect, useState } from "react";
import { apiClient } from "../services/axios/axiosInstance";
import { isTrustedAssetUrl, resolveAssetUrlCandidates } from "../utils/url";

export function useAssetSrc(rawPath?: string | null): string | undefined {
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    const candidates = resolveAssetUrlCandidates(rawPath);
    if (candidates.length === 0) {
      setSrc(undefined);
      return;
    }

    if (
      /^(data:|blob:)/i.test(candidates[0]) ||
      !isTrustedAssetUrl(candidates[0]) ||
      /\/uploads\//i.test(candidates[0])
    ) {
      setSrc(candidates[0]);
      return;
    }

    const controller = new AbortController();
    let objectUrl: string | undefined;
    setSrc(undefined);

    async function load() {
      for (const url of candidates) {
        try {
          const blob = await apiClient.get<Blob>(url, {
            responseType: "blob",
            signal: controller.signal,
          });
          if (controller.signal.aborted) return;
          objectUrl = URL.createObjectURL(blob);
          setSrc(objectUrl);
          return;
        } catch {
          if (controller.signal.aborted) return;
        }
      }
    }

    void load();

    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [rawPath]);

  return src;
}

export function useIconSrc(iconSrc?: string): string | undefined {
  const isBuiltIn = iconSrc?.startsWith("/imgs/");
  const resolvedSrc = useAssetSrc(isBuiltIn ? undefined : iconSrc);
  return isBuiltIn ? iconSrc : resolvedSrc;
}
