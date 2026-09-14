import { Alert, Button, Input, Modal, Space } from "antd";
import { CopyOutlined, LockOutlined } from "@ant-design/icons";
import { useFrameContainer } from "../../../../components/layout/FrameContainerContext";
import { styles } from "../../../../styles/company-admin/EmployeeForm.styles";
import { copyToClipboard } from "../../../../utils/feedback";

interface ResetPasswordSuccessModalProps {
  password: string | null;
  onClose: () => void;
}

export default function ResetPasswordSuccessModal({
  password,
  onClose,
}: ResetPasswordSuccessModalProps) {
  const getContainer = useFrameContainer();

  return (
    <Modal
      open={Boolean(password)}
      onCancel={onClose}
      onOk={onClose}
      okText="Bağla"
      cancelButtonProps={{ style: styles.hiddenCancel }}
      title={
        <span style={styles.cardTitle}>
          <LockOutlined style={styles.resetIcon} />
          Şifrə dəyişdirildi
        </span>
      }
      centered
      destroyOnHidden
      getContainer={getContainer}
    >
      <Alert
        type="success"
        showIcon
        message="Şifrə uğurla yeniləndi. Yeni şifrə:"
        style={styles.resetSuccessAlert}
      />
      <Space.Compact style={styles.resetPasswordInput}>
        <Input.Password value={password ?? ""} readOnly aria-label="Yeni şifrə" />
        <Button
          type="default"
          icon={<CopyOutlined />}
          onClick={() => copyToClipboard(password ?? "")}
          aria-label="Şifrəni kopyala"
        />
      </Space.Compact>
    </Modal>
  );
}
