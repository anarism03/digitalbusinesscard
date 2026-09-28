import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import {
  DeleteOutlined,
  GlobalOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import MobileBottomSheet from "../../../../components/shared/MobileBottomSheet";
import LinkFormHeader from "./LinkFormHeader";
import SheetActions from "./SheetActions";
import { useAssetSrc } from "../../../../hooks/useAssetSrc";
import { useImageUpload } from "../../../../hooks/useImageUpload";
import {
  QUICK_LINK_LABEL_MAX,
  QUICK_LINK_URL_MAX,
  quickLinkRowSchema,
} from "../../../../validators/quickLink";
import { styles } from "../../../../styles/company-admin/WebsiteLinkForm.styles";
import type { WebsiteLinkResult } from "../../../../types";

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

const DEFAULT_HEADLINE = "Sayt linki";

export default function WebsiteLinkForm({
  open,
  initial,
  onBack,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [headline, setHeadline] = useState(DEFAULT_HEADLINE);
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const logo = useImageUpload({
    initialSrc: initial?.iconUrl,
    maxSizePx: 512,
    quality: 0.86,
  });
  const { reset: resetLogo } = logo;
  const logoSrc = useAssetSrc(logo.src);

  useEffect(() => {
    if (!open) return;
    setHeadline(initial?.headline || DEFAULT_HEADLINE);
    setUrl(initial?.url || "");
    setErrors({});
    resetLogo(initial?.iconUrl);
  }, [open, initial?.headline, initial?.url, initial?.iconUrl, resetLogo]);

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
      headline: parsed.data.label || DEFAULT_HEADLINE,
      url: parsed.data.value,
      iconUrl: logo.src,
    });
  };

  return (
    <MobileBottomSheet open={open} onClose={onClose} title={DEFAULT_HEADLINE}>
      <LinkFormHeader
        title={DEFAULT_HEADLINE}
        iconSrc={logoSrc}
        iconAlt="Sayt logosu"
        fallbackIcon={<GlobalOutlined />}
      />

      <Form layout="vertical">
        <div style={styles.row}>
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
            <div style={styles.logoActions}>
              <label style={styles.logoUploadButton}>
                <UploadOutlined />
                {logoSrc ? "Logonu dəyiş" : "Logo yüklə"}
                <input
                  type="file"
                  accept="image/*"
                  style={styles.hiddenFileInput}
                  onChange={logo.onInputChange}
                />
              </label>
              {logoSrc && (
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => resetLogo()}
                >
                  Sil
                </Button>
              )}
            </div>
          </Form.Item>
        </div>
      </Form>

      <SheetActions
        cancelText="Geri"
        onCancel={onBack}
        onDelete={onDelete}
        deleteResetKey={`${open}:${initial?.url ?? ""}`}
        onSave={handleSave}
        saveDisabled={!url.trim() || logo.isProcessing}
        saveLoading={logo.isProcessing}
        divided
      />
    </MobileBottomSheet>
  );
}
