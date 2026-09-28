import { useEffect, useState } from "react";
import { Form, Input } from "antd";
import MobileBottomSheet from "../../../../components/shared/MobileBottomSheet";
import PhoneInput from "../../../../components/shared/PhoneInput";
import SheetActions from "./SheetActions";
import {
  domainLabel,
  normalizeUrl,
  isValidUrl,
  normalizePhone,
  urlToUsername,
  usernameToUrl,
} from "../../../../utils/url";
import type { LinkFieldKind } from "../../../../types";

type CoreFieldKind = Exclude<LinkFieldKind, "email">;

const FIELD_LABELS: Record<CoreFieldKind, string> = {
  phone: "Nömrə",
  username: "İstifadəçi adı",
  url: "URL",
};

interface Props {
  open: boolean;
  title: string;
  placeholder: string;
  fieldKind: CoreFieldKind;
  urlPrefix?: string;
  initialValue: string;
  showHeadline: boolean;
  initialHeadline: string;
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
  showHeadline,
  initialHeadline,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const initialDisplayValue =
    fieldKind === "username" && urlPrefix
      ? urlToUsername(urlPrefix, initialValue)
      : initialValue;

  const [value, setValue] = useState(initialDisplayValue);
  const [headline, setHeadline] = useState(initialHeadline);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (open) {
      setValue(initialDisplayValue);
      setHeadline(initialHeadline);
      setError(undefined);
    }
  }, [open, initialDisplayValue, initialHeadline]);

  const changeValue = (nextValue: string) => {
    setValue(nextValue);
    setError(undefined);
  };

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const savedHeadline = showHeadline ? headline.trim() : undefined;

    if (fieldKind === "username" && urlPrefix) {
      onSave(usernameToUrl(urlPrefix, trimmed), savedHeadline);
      return;
    }

    if (fieldKind === "url") {
      const normalized = normalizeUrl(trimmed);
      if (!isValidUrl(normalized)) {
        setError("Düzgün URL daxil edin");
        return;
      }
      onSave(normalized, savedHeadline);
      return;
    }

    onSave(normalizePhone(trimmed));
  };

  return (
    <MobileBottomSheet open={open} onClose={onClose} title={title}>
      <Form layout="vertical">
        <Form.Item
          label={FIELD_LABELS[fieldKind]}
          validateStatus={error ? "error" : undefined}
        >
          {fieldKind === "phone" ? (
            <PhoneInput
              value={value}
              onChange={changeValue}
              status={error ? "error" : ""}
            />
          ) : fieldKind === "username" ? (
            <Input
              value={value}
              onChange={(event) => changeValue(event.target.value)}
              placeholder={placeholder}
              autoFocus
              addonBefore={domainLabel(urlPrefix)}
              maxLength={60}
            />
          ) : (
            <Input
              type="url"
              value={value}
              onChange={(event) => changeValue(event.target.value)}
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

      <SheetActions
        cancelText="Ləğv et"
        onCancel={onClose}
        onDelete={onDelete}
        deleteResetKey={`${open}:${initialValue}`}
        onSave={handleSave}
        saveDisabled={!value.trim()}
      />
    </MobileBottomSheet>
  );
}
