import { useEffect, useRef, useState } from "react";
import { DatePicker, Form, Input } from "antd";
import dayjs from "dayjs";
import MobileBottomSheet from "../../../../components/shared/MobileBottomSheet";
import SheetActions from "./SheetActions";
import { maxMessage } from "../../../../validators/textRules";
import { styles } from "../../../../styles/company-admin/ContactCardForm.styles";
import type { ContactCardFormValues } from "../../../../types";

const { TextArea } = Input;

const ADDITIONAL_INFO_MAX = 150;
const FIELD_MAX = 100;

type FieldKind = "text" | "textarea" | "date";
type FieldErrors = Partial<Record<keyof ContactCardFormValues, string>>;
type NameParts = { firstName: string; lastName: string; middleName: string };

interface FieldConfig {
  key: "jobTitle" | "website" | "birthday" | "additionalInfo";
  placeholder: string;
  hint: string;
  maxLength: number;
  kind?: FieldKind;
}

const FIELD_CONFIG: FieldConfig[] = [
  {
    key: "jobTitle",
    placeholder: "Vəzifə",
    hint: "Kontakt kartı üçün vəzifəni daxil edin",
    maxLength: FIELD_MAX,
  },
  {
    key: "website",
    placeholder: "Vebsayt",
    hint: "Kontakt kartı üçün vebsaytı daxil edin",
    maxLength: FIELD_MAX,
  },
  {
    key: "birthday",
    placeholder: "Doğum günü",
    hint: "Kontaktda doğum günü bölməsində görünəcək",
    maxLength: 10,
    kind: "date",
  },
  {
    key: "additionalInfo",
    placeholder: "Əlavə məlumat",
    hint: "Profildə və kontaktda görünəcək",
    maxLength: ADDITIONAL_INFO_MAX,
    kind: "textarea",
  },
];

interface Props {
  open: boolean;
  initial: ContactCardFormValues;
  firstName: string;
  lastName: string;
  middleName: string;
  onClose: () => void;
  onSave: (fields: ContactCardFormValues, nameParts: NameParts) => void;
  onDelete?: () => void;
}

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
  const status = error ? "error" : undefined;

  return (
    <div style={styles.field}>
      {kind === "textarea" ? (
        <TextArea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          showCount
          status={status}
          autoSize={{ minRows: 3, maxRows: 6 }}
          style={{ ...styles.input, ...styles.textarea }}
        />
      ) : kind === "date" ? (
        <DatePicker
          value={value ? dayjs(value) : null}
          onChange={(date) => onChange(date ? date.format("YYYY-MM-DD") : "")}
          format="DD/MM/YYYY"
          placeholder={placeholder}
          status={status}
          style={{ ...styles.input, ...styles.datePicker }}
        />
      ) : (
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          showCount
          status={status}
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
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [fields, setFields] = useState<ContactCardFormValues>(initial);
  const [nameParts, setNameParts] = useState({
    firstName,
    lastName,
    middleName,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open && !wasOpen.current) {
      setFields(initial);
      setNameParts({ firstName, lastName, middleName });
      setErrors({});
    }
    wasOpen.current = open;
  }, [open, initial, firstName, lastName, middleName]);

  const setField = (key: keyof ContactCardFormValues) => (value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSave = () => {
    if (fields.jobTitle.trim().length > FIELD_MAX) {
      setErrors({ jobTitle: maxMessage("Vəzifə", FIELD_MAX) });
      return;
    }

    const nextNameParts = {
      firstName: nameParts.firstName.trim(),
      lastName: nameParts.lastName.trim(),
      middleName: nameParts.middleName.trim(),
    };
    onSave(
      {
        buttonLabel: fields.buttonLabel.trim(),
        name: Object.values(nextNameParts).filter(Boolean).join(" "),
        jobTitle: fields.jobTitle.trim(),
        website: fields.website.trim(),
        birthday: fields.birthday.trim(),
        additionalInfo: fields.additionalInfo.trim(),
      },
      nextNameParts,
    );
  };

  return (
    <MobileBottomSheet
      open={open}
      onClose={onClose}
      title="Kontakt kartını tənzimlə"
    >
      <Form layout="vertical">
        <FieldWithHint
          value={fields.buttonLabel}
          onChange={setField("buttonLabel")}
          placeholder="Düymə adı"
          hint="Düymə adını daxil edin"
          maxLength={FIELD_MAX}
          error={errors.buttonLabel}
        />
        <FieldWithHint
          value={nameParts.firstName}
          onChange={(value) =>
            setNameParts((prev) => ({ ...prev, firstName: value }))
          }
          placeholder="Ad"
          hint="Kontaktda görünəcək ad"
          maxLength={FIELD_MAX}
        />
        <FieldWithHint
          value={nameParts.lastName}
          onChange={(value) =>
            setNameParts((prev) => ({ ...prev, lastName: value }))
          }
          placeholder="Soyad"
          hint="Kontaktda görünəcək soyad"
          maxLength={FIELD_MAX}
        />
        <FieldWithHint
          value={nameParts.middleName}
          onChange={(value) =>
            setNameParts((prev) => ({ ...prev, middleName: value }))
          }
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

      <SheetActions
        cancelText="Ləğv et"
        onCancel={onClose}
        onDelete={onDelete}
        deleteResetKey={`${open}:${initial.buttonLabel}:${initial.name}`}
        onSave={handleSave}
      />
    </MobileBottomSheet>
  );
}
