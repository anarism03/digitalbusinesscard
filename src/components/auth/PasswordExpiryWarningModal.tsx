import { Modal, Button, Alert } from "antd";
import { ClockCircleOutlined, LockOutlined } from "@ant-design/icons";
import { useFrameContainer } from "../layout/FrameContainerContext";

interface Props {
  open: boolean;
  daysLeft: number;
  onClose: () => void;
  onChangePassword: () => void;
}

export default function PasswordExpiryWarningModal({
  open,
  daysLeft,
  onClose,
  onChangePassword,
}: Props) {
  const getContainer = useFrameContainer();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      destroyOnHidden
      getContainer={getContainer}
      title={
        <span>
          <ClockCircleOutlined style={{ marginRight: 8, color: "#d46b08" }} />
          Şifrənin istifadə müddəti bitir
        </span>
      }
      footer={[
        <Button key="close" onClick={onClose}>
          Bağla
        </Button>,
        <Button
          key="change"
          type="primary"
          icon={<LockOutlined />}
          onClick={onChangePassword}
        >
          Şifrəni yenilə
        </Button>,
      ]}
    >
      <Alert
        type="warning"
        showIcon
        message={`Şifrənizin istifadə müddəti ${daysLeft} gün sonra bitir. Zəhmət olmasa şifrənizi yeniləyin.`}
      />
    </Modal>
  );
}
