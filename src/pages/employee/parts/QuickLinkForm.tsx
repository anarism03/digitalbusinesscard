import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Button, Form, Input } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import MobileBottomSheet from "../../../components/company-admin/mobile/MobileBottomSheet";
import ConfirmDeleteButton from "../../../components/shared/ConfirmDeleteButton";
import PhoneInput from "../../../components/shared/PhoneInput";
import { domainLabel } from "../../../utils/linkHelpers";
import {
  QUICK_LINK_EMAIL_MAX,
  QUICK_LINK_LABEL_MAX,
  QUICK_LINK_MAX_ROWS,
  QUICK_LINK_URL_MAX,
  QUICK_LINK_USERNAME_MAX,
  quickLinkRowsSchema,
} from "../../../validators/quickLink";
import { styles } from "../../../styles/employee/LinkFlow.styles";
import type { LinkFieldKind, QuickLinkResult } from "../../../types";

interface Props {
  open: boolean;
  title: string;
  icon: ReactNode;
  iconSrc?: string;
  placeholder: string;
  fieldKind: LinkFieldKind;
  urlPrefix?: string;
  allowMultiple?: boolean;
  initial?: QuickLinkResult;
  onBack: () => void;
  onClose: () => void;
  onSave: (results: QuickLinkResult[]) => void;
  onDelete?: () => void;
}

interface RowErrors {
  label?: string;
  value?: string;
}

const emptyRow = (title: string): QuickLinkResult => ({
  label: title,
  value: "",
});

export default function QuickLinkForm({
  open,
  title,
  icon,
  iconSrc,
  placeholder,
  fieldKind,
  urlPrefix,
  allowMultiple = false,
  initial,
  onBack,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [rows, setRows] = useState<QuickLinkResult[]>([emptyRow(title)]);
  const [errors, setErrors] = useState<RowErrors[]>([]);
  const isEditing = Boolean(initial);

  useEffect(() => {
    if (open) {
      setRows([initial ?? emptyRow(title)]);
      setErrors([]);
    }
  }, [open, title, initial]);

  const updateRow = (
    index: number,
    field: keyof QuickLinkResult,
    value: string,
  ) => {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    );
    setErrors((current) =>
      current.map((rowError, rowIndex) =>
        rowIndex === index ? { ...rowError, [field]: undefined } : rowError,
      ),
    );
  };

  const handleSave = () => {
    const candidates = rows.map((row) => ({
      ...row,
      label: row.label.trim() || title,
    }));
    const parsed = quickLinkRowsSchema(fieldKind).safeParse(candidates);

    if (!parsed.success) {
      const nextErrors: RowErrors[] = candidates.map(() => ({}));
      parsed.error.issues.forEach((issue) => {
        const [rowIndex, field] = issue.path;
        if (
          typeof rowIndex === "number" &&
          (field === "label" || field === "value")
        ) {
          nextErrors[rowIndex][field] = issue.message;
        }
      });
      setErrors(nextErrors);
      return;
    }

    onSave(parsed.data);
  };

  const fieldLabel =
    fieldKind === "phone"
      ? "Nömrə"
      : fieldKind === "email"
        ? "E-poçt"
        : fieldKind === "username"
          ? "İstifadəçi adı"
          : "URL";

  return (
    <MobileBottomSheet open={open} onClose={onClose} title={title}>
      <div style={styles.quickLinkHeader}>
        <span style={styles.quickLinkIcon}>
          {iconSrc ? (
            <img src={iconSrc} alt="" style={styles.quickLinkIconImage} />
          ) : (
            icon
          )}
        </span>
        <strong style={styles.quickLinkTitle}>{title}</strong>
      </div>

      <Form layout="vertical">
        {rows.map((row, index) => (
          <div key={index} style={styles.quickLinkRow}>
            <Form.Item
              label="Başlıq"
              validateStatus={errors[index]?.label ? "error" : undefined}
            >
              <Input
                value={row.label}
                onChange={(event) =>
                  updateRow(index, "label", event.target.value)
                }
                placeholder={title}
                maxLength={QUICK_LINK_LABEL_MAX}
              />
            </Form.Item>
            <Form.Item
              label={fieldLabel}
              validateStatus={errors[index]?.value ? "error" : undefined}
            >
              {fieldKind === "phone" ? (
                <PhoneInput
                  value={row.value}
                  onChange={(value) => updateRow(index, "value", value)}
                  status={errors[index]?.value ? "error" : undefined}
                />
              ) : fieldKind === "username" ? (
                <Input
                  value={row.value}
                  onChange={(event) =>
                    updateRow(index, "value", event.target.value)
                  }
                  placeholder={placeholder}
                  autoFocus={index === 0}
                  addonBefore={domainLabel(urlPrefix)}
                  maxLength={QUICK_LINK_USERNAME_MAX}
                />
              ) : (
                <Input
                  value={row.value}
                  onChange={(event) =>
                    updateRow(index, "value", event.target.value)
                  }
                  placeholder={placeholder}
                  autoFocus={index === 0}
                  inputMode={fieldKind === "email" ? "email" : "url"}
                  type={fieldKind === "email" ? "email" : "url"}
                  maxLength={
                    fieldKind === "email"
                      ? QUICK_LINK_EMAIL_MAX
                      : QUICK_LINK_URL_MAX
                  }
                />
              )}
            </Form.Item>
          </div>
        ))}
      </Form>

      {allowMultiple && !isEditing && (
        <div style={styles.quickLinkStepControls}>
          <Button
            shape="circle"
            icon={<MinusOutlined />}
            aria-label="Sonuncu məlumatı sil"
            disabled={rows.length === 1}
            onClick={() => {
              setRows((current) => current.slice(0, -1));
              setErrors((current) => current.slice(0, -1));
            }}
          />
          <Button
            shape="circle"
            type="primary"
            icon={<PlusOutlined />}
            aria-label="Yeni məlumat əlavə et"
            disabled={rows.length >= QUICK_LINK_MAX_ROWS}
            onClick={() => {
              setRows((current) => [...current, emptyRow(title)]);
              setErrors((current) => [...current, {}]);
            }}
          />
        </div>
      )}

      <div style={styles.quickLinkActions}>
        {onDelete ? (
          <ConfirmDeleteButton
            onConfirm={onDelete}
            resetKey={`${open}:${initial?.value ?? ""}`}
            style={{ flex: 1 }}
          />
        ) : (
          <Button onClick={onBack} style={{ flex: 1 }}>
            Geri
          </Button>
        )}
        <Button
          type="primary"
          style={{ flex: 2 }}
          disabled={rows.some((row) => !row.value.trim())}
          onClick={handleSave}
        >
          Yadda saxla
        </Button>
      </div>
    </MobileBottomSheet>
  );
}
