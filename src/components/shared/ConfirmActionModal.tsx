import { Modal, Typography } from "antd";
import { strings } from "../../constants/strings";
import { useFrameContainer } from "../layout/FrameContainerContext";

interface Props {
  open: boolean;
  title: string;
  message: string;
  loading?: boolean;
  danger?: boolean;
  okText?: string;
  cancelText?: string;
  cancelButtonClassName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmActionModal({
  open,
  title,
  message,
  loading = false,
  danger = false,
  okText = strings.common.yes,
  cancelText = strings.common.no,
  cancelButtonClassName,
  onConfirm,
  onCancel,
}: Props) {
  const getContainer = useFrameContainer();
  return (
    <Modal
      open={open}
      title={title}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{ danger }}
      cancelButtonProps={{
        className: ["confirm-cancel-button", cancelButtonClassName]
          .filter(Boolean)
          .join(" "),
      }}
      centered
      width={400}
      getContainer={getContainer}
    >
      <Typography.Text>{message}</Typography.Text>
    </Modal>
  );
}
