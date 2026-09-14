import { useEffect, useState } from "react";
import { apiClient } from "../services/axios/axiosInstance";
import { resolveAssetUrlCandidates } from "../utils/url";

function isExternalHttpUrl(url: string) {
  if (!/^https?:\/\//i.test(url)) return false;

  const appOrigin = window.location.origin;
  const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
  const apiRoot = apiBase.replace(/\/api$/i, "");

  return ![appOrigin, apiBase, apiRoot].some((base) => {
    if (!base) return false;
    return url.startsWith(base);
  });
}

function isDirectPublicAsset(url: string) {
  return /\/api\/uploads\//i.test(url) || /\/uploads\//i.test(url);
}

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
      isExternalHttpUrl(candidates[0]) ||
      isDirectPublicAsset(candidates[0])
    ) {
      setSrc(candidates[0]);
      return;
    }

    let cancelled = false;
    let objectUrl: string | undefined;

    async function load() {
      for (const url of candidates) {
        try {
          const blob = await apiClient.get<Blob>(url, { responseType: "blob" });
          if (cancelled) return;
          objectUrl = URL.createObjectURL(blob);
          setSrc(objectUrl);
          return;
        } catch {
        }
      }
      if (!cancelled) setSrc(undefined);
    }

    void load();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [rawPath]);

  return src;
}

interface UseCompanyLogoOptions {
  logo?: string | null;
  preview?: string;
}

export function useCompanyLogo({ logo, preview }: UseCompanyLogoOptions) {
  const fetchedSrc = useAssetSrc(logo);
  return { logoSrc: preview ?? fetchedSrc };
}
