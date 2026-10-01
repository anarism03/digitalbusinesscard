import { Alert, Button, Modal, Typography } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { styles } from "../../../../styles/super-admin/CompanyAdminCreatedModal.styles";
import { copyToClipboard } from "../../../../utils/feedback";
import type { CompanyAdminCredentials } from "../../../../types";

interface CompanyAdminCreatedModalProps {
  credentials: CompanyAdminCredentials | null;
  onClose: () => void;
}

interface CopyableRowProps {
  label: string;
  value: string;
}

function CopyableRow({ label, value }: CopyableRowProps) {
  return (
    <Typography.Paragraph style={styles.paragraph}>
      <b>{label}:</b> {value}
      <Button
        type="text"
        size="small"
        icon={<CopyOutlined />}
        onClick={() => copyToClipboard(value)}
        style={styles.copyButton}
        aria-label={`${label} kopyala`}
      />
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
      title="Şirkət yaradıldı"
      okText="Şirkətlərə qayıt"
      cancelButtonProps={{ style: styles.hiddenCancel }}
      onOk={onClose}
      onCancel={onClose}
      centered
    >
      <Alert
        type="success"
        showIcon
        message="Şirkət admininin giriş məlumatlarını saxlayın."
        style={styles.successAlert}
      />
      {credentials?.email && (
        <CopyableRow label="Admin e-poçtu" value={credentials.email} />
      )}
      {credentials?.password && (
        <CopyableRow label="Müvəqqəti şifrə" value={credentials.password} />
      )}
      {credentials?.voen && (
        <CopyableRow label="VÖEN" value={credentials.voen} />
      )}
    </Modal>
  );
}
