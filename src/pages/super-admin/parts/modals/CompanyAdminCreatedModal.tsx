import { Alert, Button, Modal, Typography } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { styles } from "../../../../styles/super-admin/CompanyFormPage.styles";
import { copyToClipboard } from "../../../../utils/feedback";
import type { CompanyAdminCredentials } from "../../../../types";

interface CompanyAdminCreatedModalProps {
  credentials: CompanyAdminCredentials | null;
  onClose: () => void;
}

interface CopyableRowProps {
  label: string;
  value?: string;
  emptyText?: string;
}

function CopyableRow({
  label,
  value,
  emptyText = "Backend cavabında gəlmədi",
}: CopyableRowProps) {
  return (
    <Typography.Paragraph style={styles.paragraph}>
      <b>{label}:</b> {value || emptyText}
      {value && (
        <Button
          type="text"
          size="small"
          icon={<CopyOutlined />}
          onClick={() => copyToClipboard(value)}
          style={styles.copyButton}
          aria-label={`${label} kopyala`}
        />
      )}
    </Typography.Paragraph>
  );
}

export default function CompanyAdminCreatedModal({
  credentials,
  onClose,
}: CompanyAdminCreatedModalProps) {
  return (
    <Modal
      open={Boolean(credentials)}
      title="Company-admin avtomatik yaradıldı"
      okText="Şirkətlərə qayıt"
      cancelButtonProps={{ style: styles.hiddenCancel }}
      onOk={onClose}
      onCancel={onClose}
      centered
    >
      <Alert
        type="success"
        showIcon
        message="Yeni şirkətlə birlikdə company-admin məlumatları backend tərəfindən yaradıldı."
        style={styles.successAlert}
      />
      <CopyableRow label="Admin e-poçtu" value={credentials?.email} />
      <CopyableRow label="Default şifrə" value={credentials?.password} />
      <CopyableRow
        label="VÖEN"
        value={credentials?.voen}
        emptyText="Qeyd olunmayıb"
      />
    </Modal>
  );
}
