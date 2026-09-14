import { useCallback, useState } from "react";
import type { ChangeEvent } from "react";
import type { UploadFile } from "antd";
import { compressImageToDataUrl, dataUrlToFile, validateImageFile } from "../utils/file";
import { message } from "../utils/feedback";

interface Base64ImageUploadOptions {
  maxSizePx?: number;
  quality?: number;
}

export function useBase64ImageUpload({
  maxSizePx = 360,
  quality = 0.72,
}: Base64ImageUploadOptions = {}) {
  const [dataUrl, setDataUrl] = useState<string>();
  const [file, setFile] = useState<File>();
  const [isProcessing, setIsProcessing] = useState(false);

  const selectFile = useCallback(
    async (file: File) => {
      if (!validateImageFile(file)) return false;

      setIsProcessing(true);
      try {
        const nextDataUrl = await compressImageToDataUrl(
          file,
          maxSizePx,
          quality,
        );
        setDataUrl(nextDataUrl);
        setFile(dataUrlToFile(nextDataUrl, "logo"));
      } catch {
        message.error("Logo yüklənmədi");
      } finally {
        setIsProcessing(false);
      }

      return false;
    },
    [maxSizePx, quality],
  );

  const beforeUpload = useCallback(
    (file: File) => {
      void selectFile(file);
      return false;
    },
    [selectFile],
  );

  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (file) void selectFile(file);
    },
    [selectFile],
  );

  const clear = useCallback(() => {
    setDataUrl(undefined);
    setFile(undefined);
  }, []);

  const asUploadFile = useCallback(
    (): UploadFile | undefined =>
      dataUrl
        ? {
            uid: "base64-logo",
            name: dataUrl.startsWith("data:image/png") ? "logo.png" : "logo.jpg",
            status: "done",
            url: dataUrl,
          }
        : undefined,
    [dataUrl],
  );

  return {
    dataUrl,
    file,
    isProcessing,
    beforeUpload,
    onInputChange,
    clear,
    asUploadFile,
  };
}
