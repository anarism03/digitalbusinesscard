import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useImageUploadPreview } from "../../../../hooks/useImageUploadPreview";
import { useAssetSrc } from "../../../../hooks/useAssetSrc";
import { compressImageToDataUrl, validateImageFile } from "../../../../utils/file";
import type { Employee } from "../../../../types";

export function useCardEditAssets(employee: Employee) {
  const {
    previewSrc: photoPreview,
    file: photoFile,
    isProcessing: photoProcessing,
    beforeUpload: beforePhotoUpload,
    reset: resetPhoto,
  } = useImageUploadPreview(employee.photoUrl);
  const avatarSrc = useAssetSrc(photoPreview);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  const [cardBackground, setCardBackground] = useState<string | undefined>(
    employee.cardBackgroundUrl,
  );
  const backgroundPreview = useAssetSrc(cardBackground);
  const companyLogoSrc = useAssetSrc(employee.companyLogoUrl);
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !validateImageFile(file)) return;
    beforePhotoUpload(file);
  };

  const handleBackgroundFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !validateImageFile(file)) return;
    setCardBackground(await compressImageToDataUrl(file));
  };

  return {
    photoPreview,
    photoFile,
    photoProcessing,
    resetPhoto,
    avatarSrc,
    avatarFileInputRef,
    handleAvatarFileChange,
    cardBackground,
    setCardBackground,
    backgroundPreview,
    companyLogoSrc,
    backgroundFileInputRef,
    handleBackgroundFileChange,
  };
}
