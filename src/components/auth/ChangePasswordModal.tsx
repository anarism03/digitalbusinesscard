import { Form, Input, Modal } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../../validators/auth";
import { useFrameContainer } from "../layout/FrameContainerContext";
import { useChangePassword } from "../../hooks/useUser";
import { isOldPasswordError, showApiError } from "../../utils/apiError";
import SwipeDownHandle from "../shared/SwipeDownHandle";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  open,
  onClose,
}: ChangePasswordModalProps) {
  const changePassword = useChangePassword();
  const getContainer = useFrameContainer();
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const close = () => {
    reset();
    onClose();
  };

  const submit = handleSubmit(async ({ oldPassword, newPassword }) => {
    try {
      await changePassword.mutateAsync({ oldPassword, newPassword });
      close();
    } catch (error) {
      if (isOldPasswordError(error)) {
        setError("oldPassword", {
          type: "server",
          message: "Cari şifrə yanlışdır",
        });
      } else {
        showApiError(error);
      }
    }
  });

  return (
    <Modal
      rootClassName="cadmin-bottom-modal"
      open={open}
      title={
        <SwipeDownHandle onClose={close} open={open}>
          Şifrəni dəyiş
        </SwipeDownHandle>
      }
      okText="Yadda saxla"
      cancelText="Ləğv et"
      confirmLoading={changePassword.isPending}
      onOk={submit}
      onCancel={close}
      maskClosable
      destroyOnHidden
      centered
      getContainer={getContainer}
    >
      <Form layout="vertical">
        <Controller
          name="oldPassword"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Cari şifrə"
              validateStatus={errors.oldPassword ? "error" : undefined}
              help={errors.oldPassword?.message}
            >
              <Input.Password
                {...field}
                placeholder="Cari şifrə"
                autoComplete="current-password"
              />
            </Form.Item>
          )}
        />
        <Controller
          name="newPassword"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Yeni şifrə"
              required
              validateStatus={errors.newPassword ? "error" : undefined}
              help={errors.newPassword?.message}
            >
              <Input.Password
                {...field}
                placeholder="Yeni şifrə"
                autoComplete="new-password"
              />
            </Form.Item>
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Yeni şifrəni təkrarlayın"
              required
              validateStatus={errors.confirmPassword ? "error" : undefined}
              help={errors.confirmPassword?.message}
            >
              <Input.Password
                {...field}
                placeholder="Yeni şifrəni təkrarlayın"
                autoComplete="new-password"
              />
            </Form.Item>
          )}
        />
      </Form>
    </Modal>
  );
}
