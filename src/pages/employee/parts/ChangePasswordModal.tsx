import { Form, Input, Modal } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../../../validators/auth";
import { useFrameContainer } from "../../../components/layout/FrameContainerContext";
import type { ChangePasswordValues } from "../../../types";

interface ChangePasswordModalProps {
  open: boolean;
  loading?: boolean;
  onSubmit: (values: ChangePasswordValues) => Promise<void> | void;
  onCancel: () => void;
  showOldPassword?: boolean;
}

export default function ChangePasswordModal({
  open,
  loading = false,
  onSubmit,
  onCancel,
  showOldPassword = true,
}: ChangePasswordModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const getContainer = useFrameContainer();

  const close = () => {
    reset();
    onCancel();
  };

  const submit = handleSubmit(async (values) => {
    await onSubmit({
      oldPassword: values.oldPassword || undefined,
      newPassword: values.newPassword,
    });
    reset();
  });

  return (
    <Modal
      rootClassName="cadmin-bottom-modal"
      open={open}
      title="Şifrəni dəyiş"
      okText="Yadda saxla"
      cancelText="Ləğv et"
      confirmLoading={loading}
      onOk={submit}
      onCancel={close}
      destroyOnHidden
      centered
      getContainer={getContainer}
    >
      <Form layout="vertical">
        {showOldPassword && (
          <Controller
            name="oldPassword"
            control={control}
            render={({ field }) => (
              <Form.Item label="Köhnə şifrə">
                <Input.Password
                  {...field}
                  placeholder="Köhnə şifrə"
                  autoComplete="current-password"
                />
              </Form.Item>
            )}
          />
        )}
        <Controller
          name="newPassword"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Yeni şifrə"
              required
              validateStatus={errors.newPassword ? "error" : undefined}
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
              label="Yeni şifrə təkrar"
              required
              validateStatus={errors.confirmPassword ? "error" : undefined}
            >
              <Input.Password
                {...field}
                placeholder="Yeni şifrə təkrar"
                autoComplete="new-password"
              />
            </Form.Item>
          )}
        />
      </Form>
    </Modal>
  );
}
