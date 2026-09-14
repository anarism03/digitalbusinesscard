import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Button, DatePicker, Form, Input } from "antd";
import dayjs from "dayjs";
import MobileBottomSheet from "./MobileBottomSheet";
import ConfirmDeleteButton from "../../shared/ConfirmDeleteButton";
import { maxMessage } from "../../../validators/textRules";
import type { ContactCardFormValues } from "../../../types";

const { TextArea } = Input;

const ADDITIONAL_INFO_MAX = 150;
const FIELD_MAX = 100;

type FieldKind = "text" | "textarea" | "date";
type FieldErrors = Partial<Record<keyof ContactCardFormValues, string>>;

interface FieldConfig {
  key: keyof ContactCardFormValues;
  placeholder: string;
  hint: string;
  maxLength: number;
  kind?: FieldKind;
}

const BUTTON_LABEL_FIELD: FieldConfig = {
  key: "buttonLabel",
  placeholder: "Düymə adı",
  hint: "Düymə adını daxil edin",
  maxLength: FIELD_MAX,
};

const FIELD_CONFIG: FieldConfig[] = [
  { key: "jobTitle", placeholder: "Vəzifə", hint: "Kontakt kartı üçün vəzifəni daxil edin", maxLength: FIELD_MAX },
  { key: "website", placeholder: "Vebsayt", hint: "Kontakt kartı üçün vebsaytı daxil edin", maxLength: FIELD_MAX },
  { key: "birthday", placeholder: "Doğum günü", hint: "Kontaktda doğum günü bölməsində görünəcək", maxLength: 10, kind: "date" },
  { key: "additionalInfo", placeholder: "Əlavə məlumat", hint: "Profildə və kontaktda görünəcək", maxLength: ADDITIONAL_INFO_MAX, kind: "textarea" },
];

interface Props {
  open: boolean;
  initial: ContactCardFormValues;
  firstName: string;
  lastName: string;
  middleName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onMiddleNameChange: (value: string) => void;
  onClose: () => void;
  onSave: (fields: ContactCardFormValues) => void;
  onDelete?: () => void;
}

const styles = {
  field: {
    marginBottom: 10,
  },
  input: {
    background: "#f3f4f6",
    border: "1px solid transparent",
    borderRadius: 14,
    padding: "12px 16px",
    fontSize: 15,
    fontWeight: 700,
    textAlign: "center",
  },
  hint: {
    display: "block",
    textAlign: "center",
    fontSize: 12,
    color: "#98a2b3",
    margin: "4px 0 0",
  },
} satisfies Record<string, CSSProperties>;

function FieldWithHint({
  value,
  onChange,
  placeholder,
  hint,
  maxLength,
  kind = "text",
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  hint: string;
  maxLength: number;
  kind?: FieldKind;
  error?: string;
}) {
  return (
    <div style={styles.field}>
      {kind === "textarea" ? (
        <TextArea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          showCount
          status={error ? "error" : undefined}
          autoSize={{ minRows: 3, maxRows: 6 }}
          style={{ ...styles.input, textAlign: "left" }}
        />
      ) : kind === "date" ? (
        <DatePicker
          value={value ? dayjs(value) : null}
          onChange={(date) => onChange(date ? date.format("YYYY-MM-DD") : "")}
          format="DD/MM/YYYY"
          placeholder={placeholder}
          status={error ? "error" : undefined}
          style={{ ...styles.input, width: "100%" }}
        />
      ) : (
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          showCount
          status={error ? "error" : undefined}
          style={styles.input}
        />
      )}
      <span style={styles.hint}>{hint}</span>
    </div>
  );
}

export default function ContactCardForm({
  open,
  initial,
  firstName,
  lastName,
  middleName,
  onFirstNameChange,
  onLastNameChange,
  onMiddleNameChange,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [fields, setFields] = useState<ContactCardFormValues>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (open) {
      setFields(initial);
      setErrors({});
    }
  }, [open, initial]);

  const setField = (key: keyof ContactCardFormValues) => (value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSave = () => {
    const nextErrors: FieldErrors = {};
    if (fields.jobTitle.trim().length > FIELD_MAX) {
      nextErrors.jobTitle = maxMessage("Vəzifə", FIELD_MAX);
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const trimmed = FIELD_CONFIG.reduce(
      (result, field) => ({
        ...result,
        [field.key]: fields[field.key].trim(),
      }),
      {
        buttonLabel: fields.buttonLabel.trim(),
        name: [firstName, lastName, middleName].filter(Boolean).join(" "),
      } as ContactCardFormValues,
    );
    onSave(trimmed);
  };

  return (
    <MobileBottomSheet open={open} onClose={onClose} title="Kontaktı yüklə">
      <Form layout="vertical">
        <FieldWithHint
          value={fields.buttonLabel}
          onChange={setField("buttonLabel")}
          placeholder={BUTTON_LABEL_FIELD.placeholder}
          hint={BUTTON_LABEL_FIELD.hint}
          maxLength={BUTTON_LABEL_FIELD.maxLength}
          error={errors.buttonLabel}
        />
        <FieldWithHint
          value={firstName}
          onChange={onFirstNameChange}
          placeholder="Ad"
          hint="Kontaktda görünəcək ad"
          maxLength={FIELD_MAX}
        />
        <FieldWithHint
          value={lastName}
          onChange={onLastNameChange}
          placeholder="Soyad"
          hint="Kontaktda görünəcək soyad"
          maxLength={FIELD_MAX}
        />
        <FieldWithHint
          value={middleName}
          onChange={onMiddleNameChange}
          placeholder="Ata adı (ixtiyari)"
          hint="Kontaktda görünəcək ata adı"
          maxLength={50}
        />
        {FIELD_CONFIG.map((field) => (
          <FieldWithHint
            key={field.key}
            value={fields[field.key]}
            onChange={setField(field.key)}
            placeholder={field.placeholder}
            hint={field.hint}
            maxLength={field.maxLength}
            kind={field.kind}
            error={errors[field.key]}
          />
        ))}
      </Form>

      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        {onDelete ? (
          <ConfirmDeleteButton
            onConfirm={onDelete}
            resetKey={`${open}:${initial.buttonLabel}:${initial.name}`}
            style={{ flex: 1 }}
          />
        ) : (
          <Button onClick={onClose} style={{ flex: 1 }}>
            Ləğv et
          </Button>
        )}
        <Button type="primary" style={{ flex: 2 }} onClick={handleSave}>
          Yadda saxla
        </Button>
      </div>
    </MobileBottomSheet>
  );
}
