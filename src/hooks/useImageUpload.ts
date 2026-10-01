import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { compressImageToDataUrl, validateImageFile } from "../utils/file";
import { message } from "../utils/feedback";

interface ImageUploadOptions {
  initialSrc?: string | null;
  maxSizePx?: number;
  quality?: number;
  preserveTransparency?: boolean;
}

export function useImageUpload({
  initialSrc,
  maxSizePx,
  quality,
  preserveTransparency,
}: ImageUploadOptions = {}) {
  const [src, setSrc] = useState(initialSrc ?? undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const selection = useRef(0);

  const reset = useCallback((nextSrc?: string | null) => {
    ++selection.current;
    setSrc(nextSrc ?? undefined);
    setIsProcessing(false);
  }, []);

  useEffect(() => {
    reset(initialSrc);
    const currentSelection = selection;
    return () => {
      ++currentSelection.current;
    };
  }, [initialSrc, reset]);

  const selectFile = async (file: File) => {
    if (!validateImageFile(file)) return;
    const id = ++selection.current;
    setIsProcessing(true);
    try {
      const result = await compressImageToDataUrl(
        file,
        maxSizePx,
        quality,
        preserveTransparency,
      );
      if (id === selection.current) setSrc(result);
    } catch {
      if (id === selection.current) message.error("Şəkil yüklənmədi");
    } finally {
      if (id === selection.current) setIsProcessing(false);
    }
  };

  const beforeUpload = (file: File) => {
    void selectFile(file);
    return false;
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void selectFile(file);
  };

  return { src, isProcessing, beforeUpload, onInputChange, reset };
}
