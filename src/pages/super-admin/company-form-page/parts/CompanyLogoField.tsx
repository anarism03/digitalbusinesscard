import type { ChangeEvent } from "react";
import { Button, Form, Typography } from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import CompanyLogo from "../../../../components/shared/CompanyLogo";
import { styles } from "../../../../styles/super-admin/CompanyLogoField.styles";

interface Props {
  label: string;
  hint: string;
  logoPreview?: string;
  onRemove: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function CompanyLogoField({
  label,
  hint,
  logoPreview,
  onRemove,
  onFileChange,
}: Props) {
  return (
    <>
      <Typography.Text strong style={styles.logoLabel}>
        {label}
      </Typography.Text>
      <Form.Item style={styles.logoItem}>
        <div style={styles.logoRow}>
          <div style={styles.previewWrap}>
            <CompanyLogo src={logoPreview} size={80} />
            {logoPreview && (
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={onRemove}
                style={styles.removeButton}
              />
            )}
          </div>
          <div>
            <label style={styles.uploadLabel}>
              <div style={styles.uploadButton}>
                <UploadOutlined /> {logoPreview ? "Loqonu dəyiş" : "Loqo yüklə"}
              </div>
              <input
                type="file"
                accept="image/*"
                style={styles.hiddenFile}
                onChange={onFileChange}
              />
            </label>
            <div style={styles.logoHint}>{hint}</div>
          </div>
        </div>
      </Form.Item>
    </>
  );
}
