import { Button, Input, Modal, Space } from "antd";
import { CopyOutlined, LockOutlined, ReloadOutlined } from "@ant-design/icons";
import { useFrameContainer } from "../../../../components/layout/FrameContainerContext";
import { useGeneratedPassword } from "../../../../hooks/useGeneratedPassword";
import { styles } from "../../../../styles/company-admin/EmployeeForm.styles";

interface ResetPasswordModalProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onReset: (newPassword: string) => Promise<void>;
}

export default function ResetPasswordModal({
  open,
  loading,
  onClose,
  onReset,
}: ResetPasswordModalProps) {
  const password = useGeneratedPassword();
  const getContainer = useFrameContainer();

  const handleReset = async () => {
    await onReset(password.value);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <span style={styles.cardTitle}>
          <LockOutlined style={styles.resetIcon} />
          Şifrəni sıfırla
        </span>
      }
      footer={null}
      centered
      destroyOnHidden
      getContainer={getContainer}
    >
      <Space.Compact style={styles.resetPasswordInput}>
        <Input.Password
          value={password.value}
          onChange={(event) => password.setValue(event.target.value)}
          maxLength={150}
          aria-label="Yeni şifrə"
        />
        <Button
          type="default"
          icon={<ReloadOutlined />}
          onClick={password.regenerate}
          aria-label="Şifrə yarat"
        />
        <Button
          type="default"
          icon={<CopyOutlined />}
          onClick={password.copy}
          aria-label="Şifrəni kopyala"
        />
      </Space.Compact>
      <Button
        danger
        block
        loading={loading}
        disabled={password.value.trim().length < 6}
        onClick={handleReset}
      >
        Şifrəni sıfırla
      </Button>
    </Modal>
  );
}
