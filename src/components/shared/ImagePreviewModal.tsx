import { Modal } from "antd";
import { useAssetSrc } from "../../hooks/useAssetSrc";
import { useFrameContainer } from "../layout/FrameContainerContext";
import {
  modalStyles,
  styles,
} from "../../styles/shared/ImagePreviewModal.styles";

interface ImagePreviewModalProps {
  open: boolean;
  src?: string | null;
  title?: string;
  onClose: () => void;
}

export default function ImagePreviewModal({
  open,
  src,
  title,
  onClose,
}: ImagePreviewModalProps) {
  const imageSrc = useAssetSrc(src);
  const fallbackText = title?.trim()?.[0]?.toUpperCase() ?? "?";
  const getContainer = useFrameContainer();

  return (
    <Modal
      open={open}
      title={title}
      footer={null}
      centered
      onCancel={onClose}
      width={420}
      styles={modalStyles}
      getContainer={getContainer}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={title || ""}
          style={styles.image}
        />
      ) : (
        <div style={styles.fallback}>
          {fallbackText}
        </div>
      )}
    </Modal>
  );
}
