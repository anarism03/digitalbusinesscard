import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import MobileBottomSheet from "./MobileBottomSheet";
import ConfirmDeleteButton from "../../shared/ConfirmDeleteButton";
import {
  domainLabel,
  normalizeUrl,
  isValidUrl,
  normalizePhone,
  urlToUsername,
  usernameToUrl,
} from "../../../utils/linkHelpers";
import PhoneInput from "../../shared/PhoneInput";

interface Props {
  open: boolean;
  title: string;
  placeholder: string;
  fieldKind: "phone" | "url" | "username";
  urlPrefix?: string;
  initialValue: string;
  showHeadline?: boolean;
  initialHeadline?: string;
  onClose: () => void;
  onSave: (value: string, headline?: string) => void;
  onDelete?: () => void;
}

export default function CoreFieldSheet({
  open,
  title,
  placeholder,
  fieldKind,
  urlPrefix,
  initialValue,
  showHeadline = false,
  initialHeadline = "",
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [value, setValue] = useState(
    fieldKind === "username" && urlPrefix
      ? urlToUsername(urlPrefix, initialValue)
      : initialValue,
  );
  const [headline, setHeadline] = useState(initialHeadline);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (open) {
      setValue(
        fieldKind === "username" && urlPrefix
          ? urlToUsername(urlPrefix, initialValue)
          : initialValue,
      );
      setHeadline(initialHeadline);
      setError(undefined);
    }
  }, [open, initialValue, initialHeadline, fieldKind, urlPrefix]);

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    if (fieldKind === "username" && urlPrefix) {
      const fullUrl = usernameToUrl(urlPrefix, trimmed);
      onSave(fullUrl, showHeadline ? headline.trim() : undefined);
      return;
    }

    if (fieldKind === "url") {
      const normalized = normalizeUrl(trimmed);
      if (!isValidUrl(normalized)) {
        setError("Düzgün URL daxil edin");
        return;
      }
      onSave(normalized, showHeadline ? headline.trim() : undefined);
      return;
    }

    onSave(normalizePhone(trimmed));
  };

  return (
    <MobileBottomSheet open={open} onClose={onClose} title={title}>
      <Form layout="vertical">
        <Form.Item
          label={
            fieldKind === "phone"
              ? "Nömrə"
              : fieldKind === "username"
                ? "İstifadəçi adı"
                : "URL"
          }
          validateStatus={error ? "error" : undefined}
        >
          {fieldKind === "phone" ? (
            <PhoneInput
              value={value}
              onChange={(nextValue) => {
                setValue(nextValue);
                setError(undefined);
              }}
              placeholder={placeholder}
              status={error ? "error" : ""}
            />
          ) : fieldKind === "username" ? (
            <Input
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setError(undefined);
              }}
              placeholder={placeholder}
              autoFocus
              addonBefore={domainLabel(urlPrefix)}
              maxLength={60}
            />
          ) : (
            <Input
              type="url"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setError(undefined);
              }}
              placeholder={placeholder}
              autoFocus
              inputMode="url"
              maxLength={300}
            />
          )}
        </Form.Item>
        {showHeadline && (
          <Form.Item label="Başlıq">
            <Input
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
              placeholder="Məsələn: Bakı ofisi"
              maxLength={200}
            />
          </Form.Item>
        )}
      </Form>

      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        {onDelete ? (
          <ConfirmDeleteButton
            onConfirm={onDelete}
            resetKey={`${open}:${initialValue}`}
            style={{ flex: 1 }}
          />
        ) : (
          <Button onClick={onClose} style={{ flex: 1 }}>
            Ləğv et
          </Button>
        )}
        <Button
          type="primary"
          style={{ flex: 2 }}
          disabled={!value.trim()}
          onClick={handleSave}
        >
          Yadda saxla
        </Button>
      </div>
    </MobileBottomSheet>
  );
}
