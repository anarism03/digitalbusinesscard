import type { ChangeEvent } from "react";
import { Avatar, Button, Form, Typography } from "antd";
import { BankOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { styles } from "../../../styles/super-admin/CompanyForm.styles";

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
          {logoPreview ? (
            <div style={styles.previewWrap}>
              <img
                src={logoPreview}
                alt="logo"
                loading="lazy"
                style={styles.previewImage}
              />
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={onRemove}
                style={styles.removeButton}
              />
            </div>
          ) : (
            <Avatar
              size={80}
              icon={<BankOutlined />}
              shape="square"
              style={styles.logoFallback}
            />
          )}
          <div>
            <label style={styles.uploadLabel}>
              <div style={styles.uploadButton}>
                <UploadOutlined /> {logoPreview ? "Loqonu dəyiş" : "Logo yüklə"}
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
