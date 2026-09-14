import { Input } from "antd";
import type { CSSProperties } from "react";
import { styles } from "../../styles/shared/BasicShared.styles";

const PHONE_MAX_LENGTH = 30;

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  status?: "" | "error" | "warning";
  style?: CSSProperties;
}

function sanitize(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, PHONE_MAX_LENGTH - 1);
  return digits ? `+${digits}` : "";
}

export default function PhoneInput({
  value = "",
  onChange,
  placeholder = "+9941234567890",
  status,
  style,
}: PhoneInputProps) {
  return (
    <Input
      value={value}
      onChange={(event) => onChange?.(sanitize(event.target.value))}
      placeholder={placeholder}
      status={status}
      inputMode="tel"
      type="tel"
      maxLength={PHONE_MAX_LENGTH}
      style={style ? { ...styles.phoneInput, ...style } : styles.phoneInput}
    />
  );
}
