import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Button } from "antd";

interface ConfirmDeleteButtonProps {
  onConfirm: () => void;
  resetKey?: unknown;
  style?: CSSProperties;
  idleText?: ReactNode;
  confirmText?: ReactNode;
}

export default function ConfirmDeleteButton({
  onConfirm,
  resetKey,
  style,
  idleText = "Sil",
  confirmText = "Təsdiq et",
}: ConfirmDeleteButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    setIsConfirming(false);
  }, [resetKey]);

  useEffect(() => {
    if (!isConfirming) return;

    const timeoutId = window.setTimeout(() => setIsConfirming(false), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [isConfirming]);

  const handleClick = () => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    setIsConfirming(false);
    onConfirm();
  };

  return (
    <Button
      danger
      type={isConfirming ? "primary" : "default"}
      className={`confirm-delete-button${isConfirming ? " confirm-delete-button--armed" : ""}`}
      onClick={handleClick}
      aria-label={isConfirming ? "Silməni təsdiq et" : "Silmə təsdiqini aç"}
      style={style}
    >
      <span aria-live="polite">{isConfirming ? confirmText : idleText}</span>
    </Button>
  );
}
