import { useCallback, useEffect, useState } from "react";
import { compressImageToDataUrl, dataUrlToFile, validateImageFile } from "../utils/file";
import { message } from "../utils/feedback";

interface ImageUploadPreviewOptions {
  maxSizePx?: number;
  quality?: number;
}

export function useImageUploadPreview(
  initialSrc?: string | null,
  options: ImageUploadPreviewOptions = {},
) {
  const [previewSrc, setPreviewSrc] = useState<string | undefined>(
    initialSrc ?? undefined,
  );
  const [dataUrl, setDataUrl] = useState<string | undefined>();
  const [file, setFile] = useState<File | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);

  const reset = useCallback((nextSrc?: string | null) => {
    setPreviewSrc(nextSrc ?? undefined);
    setDataUrl(undefined);
    setFile(undefined);
    setIsProcessing(false);
  }, []);

  useEffect(() => {
    reset(initialSrc);
  }, [initialSrc, reset]);

  const selectImage = useCallback(
    async (file: File) => {
      if (!validateImageFile(file)) return false;

      setIsProcessing(true);
      try {
        const nextDataUrl = await compressImageToDataUrl(
          file,
          options.maxSizePx,
          options.quality,
        );
        setDataUrl(nextDataUrl);
        setFile(dataUrlToFile(nextDataUrl, "photo"));
        setPreviewSrc(nextDataUrl);
      } catch {
        message.error("Şəkil yüklənmədi");
      } finally {
        setIsProcessing(false);
      }

      return false;
    },
    [options.maxSizePx, options.quality],
  );

  const beforeUpload = useCallback(
    (file: File) => {
      void selectImage(file);
      return false;
    },
    [selectImage],
  );

  return {
    previewSrc,
    dataUrl,
    file,
    isProcessing,
    beforeUpload,
    reset,
  };
}
