import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Button } from "antd";

interface ConfirmDeleteButtonProps {
  onConfirm: () => void;
  resetKey: string;
  style?: CSSProperties;
}

export default function ConfirmDeleteButton({
  onConfirm,
  resetKey,
  style,
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
      <span aria-live="polite">{isConfirming ? "Təsdiq et" : "Sil"}</span>
    </Button>
  );
}
