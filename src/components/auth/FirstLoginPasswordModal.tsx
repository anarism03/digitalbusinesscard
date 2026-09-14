import { Alert, Button, Form, Input, Modal, Typography } from "antd";
import { LockOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiMutation } from "../../hooks/useApi";
import { authService } from "../../services/auth.service";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/authSlice";
import { showApiError } from "../../utils/apiError";
import { message } from "../../utils/feedback";
import {
  firstLoginPasswordSchema,
  type FirstLoginPasswordValues,
} from "../../validators/auth";
import { useFrameContainer } from "../layout/FrameContainerContext";
import { styles } from "../../styles/auth/FirstLoginPasswordModal.styles";

interface Props {
  open: boolean;
  reason?: "first-login" | "expired";
}

export default function FirstLoginPasswordModal({
  open,
  reason = "first-login",
}: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const getContainer = useFrameContainer();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FirstLoginPasswordValues>({
    resolver: zodResolver(firstLoginPasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const changePassword = useApiMutation(
    (values: FirstLoginPasswordValues) =>
      authService.changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }),
    {
      onSuccess: () => {
        message.success("Şifrə təyin edildi. Yeni şifrə ilə daxil olun.");
        reset();
        dispatch(logout());
        navigate("/login", { replace: true });
      },
      onError: showApiError,
    },
  );

  const isExpired = reason === "expired";

  return (
    <Modal
      open={open}
      title={
        isExpired
          ? "Şifrənin müddəti bitib"
          : "İlk giriş üçün şifrə təyin edin"
      }
      centered
      closable={false}
      maskClosable={false}
      keyboard={false}
      destroyOnHidden
      getContainer={getContainer}
      footer={[
        <Button
          key="logout"
          icon={<LogoutOutlined />}
          onClick={() => dispatch(logout())}
        >
          Loginə qayıt
        </Button>,
        <Button
          key="save"
          type="primary"
          icon={<LockOutlined />}
          loading={changePassword.isPending}
          onClick={handleSubmit((v) => changePassword.mutate(v))}
        >
          Şifrəni təyin et
        </Button>,
      ]}
    >
      <Alert
        type="info"
        showIcon
        style={styles.alert}
        message={
          isExpired
            ? "Şifrənizin müddəti bitib. Davam etmək üçün yeni şifrə təyin etməlisiniz."
            : "Təhlükəsizlik üçün davam etməzdən əvvəl yeni şifrə təyin etməlisiniz."
        }
      />
      <Typography.Paragraph style={styles.description}>
        Şifrə təyin olunana qədər digər səhifələrə giriş bağlanır.
      </Typography.Paragraph>
      <Form layout="vertical">
        <Controller
          name="oldPassword"
          control={control}
          render={({ field }) => (
            <Form.Item
              label={isExpired ? "Cari şifrə" : "Cari (müvəqqəti) şifrə"}
              required
              validateStatus={errors.oldPassword ? "error" : undefined}
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
