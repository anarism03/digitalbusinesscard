import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import {
  DeleteOutlined,
  GlobalOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import MobileBottomSheet from "../../../components/company-admin/mobile/MobileBottomSheet";
import ConfirmDeleteButton from "../../../components/shared/ConfirmDeleteButton";
import { useImageUploadPreview } from "../../../hooks/useImageUploadPreview";
import { useAssetSrc } from "../../../hooks/useAssetSrc";
import {
  QUICK_LINK_LABEL_MAX,
  QUICK_LINK_URL_MAX,
  quickLinkRowSchema,
} from "../../../validators/quickLink";
import { styles } from "../../../styles/employee/LinkFlow.styles";
import type { WebsiteLinkResult } from "../../../types";

interface Props {
  open: boolean;
  initial?: WebsiteLinkResult;
  onBack: () => void;
  onClose: () => void;
  onSave: (result: WebsiteLinkResult) => void;
  onDelete?: () => void;
}

interface FieldErrors {
  headline?: string;
  url?: string;
}

export default function WebsiteLinkForm({
  open,
  initial,
  onBack,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [headline, setHeadline] = useState("Sayt linki");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const logoUpload = useImageUploadPreview(initial?.iconUrl, {
    maxSizePx: 512,
    quality: 0.86,
  });
  const logoSrc = useAssetSrc(logoUpload.previewSrc);

  useEffect(() => {
    if (!open) return;
    setHeadline(initial?.headline || "Sayt linki");
    setUrl(initial?.url || "");
    setErrors({});
    logoUpload.reset(initial?.iconUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial?.headline, initial?.url, initial?.iconUrl]);

  const handleSave = () => {
    const parsed = quickLinkRowSchema("url").safeParse({
      label: headline,
      value: url,
    });

    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      parsed.error.issues.forEach((issue) => {
        if (issue.path[0] === "label") nextErrors.headline = issue.message;
        if (issue.path[0] === "value") nextErrors.url = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    onSave({
      headline: parsed.data.label || "Sayt linki",
      url: parsed.data.value,
      iconUrl: logoUpload.previewSrc,
    });
  };

  return (
    <MobileBottomSheet open={open} onClose={onClose} title="Sayt linki">
      <div style={styles.quickLinkHeader}>
        <span style={styles.quickLinkIcon}>
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="Sayt logosu"
              style={styles.quickLinkIconImage}
            />
          ) : (
            <GlobalOutlined />
          )}
        </span>
        <strong style={styles.quickLinkTitle}>Sayt linki</strong>
      </div>

      <Form layout="vertical">
        <div style={styles.quickLinkRow}>
          <Form.Item
            label="Başlıq"
            validateStatus={errors.headline ? "error" : undefined}
          >
            <Input
              value={headline}
              onChange={(event) => {
                setHeadline(event.target.value);
                setErrors((current) => ({ ...current, headline: undefined }));
              }}
              placeholder="Mənim saytım"
              maxLength={QUICK_LINK_LABEL_MAX}
            />
          </Form.Item>
          <Form.Item
            label="URL"
            validateStatus={errors.url ? "error" : undefined}
          >
            <Input
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                setErrors((current) => ({ ...current, url: undefined }));
              }}
              placeholder="https://example.com"
              inputMode="url"
              type="url"
              maxLength={QUICK_LINK_URL_MAX}
            />
          </Form.Item>
          <Form.Item label="Sayt logosu">
            <div style={styles.websiteLogoActions}>
              <label style={styles.websiteLogoUploadButton}>
                <UploadOutlined />
                {logoSrc ? "Logonu dəyiş" : "Logo yüklə"}
                <input
                  type="file"
                  accept="image/*"
                  style={styles.hiddenFileInput}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (file) logoUpload.beforeUpload(file);
                  }}
                />
              </label>
              {logoSrc && (
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => logoUpload.reset(undefined)}
                >
                  Sil
                </Button>
              )}
            </div>
          </Form.Item>
        </div>
      </Form>

      <div style={styles.quickLinkActions}>
        {onDelete ? (
          <ConfirmDeleteButton
            onConfirm={onDelete}
            resetKey={`${open}:${initial?.url ?? ""}`}
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
          loading={logoUpload.isProcessing}
          disabled={!url.trim() || logoUpload.isProcessing}
          onClick={handleSave}
        >
          Yadda saxla
        </Button>
      </div>
    </MobileBottomSheet>
  );
}
