import { BankOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { strings } from "../../constants/strings";
import { useApiMutation } from "../../hooks/useApi";
import { authService } from "../../services/auth.service";
import { setCredentials } from "../../store/authSlice";
import { useAppDispatch } from "../../store/hooks";
import { getApiErrorMessage } from "../../utils/apiError";
import { decodeJwt } from "../../utils/jwt";
import { pickFirstLogin, pickPasswordExpiryDays } from "../../utils/normalize";
import { styles } from "../../styles/auth/LoginPage.styles";

const s = strings.auth;

type LoginValues = {
  email: string;
  password: string;
  companyVoen?: string;
};

const createLoginSchema = (isSuperAdminMode: boolean) =>
  z
    .object({
      email: z.string().min(1, s.emailRequired).email(s.emailInvalid),
      password: z.string().min(1, s.passwordRequired),
      companyVoen: z.string().optional(),
    })
    .superRefine((values, context) => {
      if (isSuperAdminMode) return;

      if (!values.companyVoen) {
        context.addIssue({
          code: "custom",
          path: ["companyVoen"],
          message: "VÖEN tələb olunur",
        });
        return;
      }

      if (!/^\d{10}$/.test(values.companyVoen)) {
        context.addIssue({
          code: "custom",
          path: ["companyVoen"],
          message: "VÖEN 10 rəqəmdən ibarət olmalıdır",
        });
      }
    });

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const isSuperAdminMode = searchParams.get("mode") === "super-admin";
  const loginSchema = createLoginSchema(isSuperAdminMode);
  const [modeError, setModeError] = useState<string>();

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", companyVoen: "" },
  });

  useEffect(() => {
    setValue("companyVoen", "");
    clearErrors("companyVoen");
    setModeError(undefined);
  }, [clearErrors, isSuperAdminMode, setValue]);

  const { mutate, isPending, error } = useApiMutation(
    (values: LoginValues) => {
      const { companyVoen, ...credentials } = values;
      return authService.login(
        isSuperAdminMode ? credentials : { ...credentials, companyVoen },
      );
    },
    {
      onSuccess: (data) => {
        const decoded = decodeJwt(data.accessToken);
        if (!decoded) return;

        if (isSuperAdminMode && decoded.role !== "SUPER_ADMIN") {
          setModeError(s.loginError);
          return;
        }

        if (!isSuperAdminMode && decoded.role === "SUPER_ADMIN") {
          setModeError(s.loginError);
          return;
        }

        const firstLogin = pickFirstLogin(data);
        const passwordExpiryDays = pickPasswordExpiryDays(data);
        dispatch(
          setCredentials({
            user: {
              ...decoded,
              ...(firstLogin !== undefined ? { isFirstLogin: firstLogin } : {}),
              ...(passwordExpiryDays !== undefined
                ? { daysUntilPasswordExpiry: passwordExpiryDays }
                : {}),
            },
            token: data.accessToken,
          }),
        );
      },
      onError: (err) => {
        const msg = getApiErrorMessage(err);
        if (!isSuperAdminMode && /vöen|voen/i.test(msg)) {
          setError("companyVoen", { type: "server", message: msg });
        }
      },
    },
  );

  const errorMsg = modeError ?? (error ? getApiErrorMessage(error) : undefined);
  const isVoenError =
    !isSuperAdminMode && errorMsg ? /vöen|voen/i.test(errorMsg) : false;

  return (
    <div className="dlogin">
      <div className="dlogin-brand" aria-hidden="true" />
      <div className="dlogin-brand-content">
        <div className="dlogin-brand__inner">
          <img
            src="/setclapp-logo.svg"
            alt="SetClapp"
            className="dlogin-logo-img"
          />
          <p className="dlogin-tag">
            Rəqəmsal Vizitkart
            <br />
            İdarəetmə Platforması
          </p>
        </div>
      </div>

      <div className="dlogin-formwrap">
        <div className="dlogin-card">
          <h1 className="dlogin-title">
            {isSuperAdminMode ? "Super Admin girişi" : s.loginTitle}
          </h1>
          <p className="dlogin-sub">
            {isSuperAdminMode
              ? "İdarəetmə hesabınıza daxil olun"
              : "Şirkət hesabınıza daxil olun"}
          </p>

          {errorMsg && !isVoenError && (
            <Alert
              type="error"
              message={errorMsg}
              style={styles.formItem}
              showIcon
            />
          )}

          <Form
            layout="vertical"
            onFinish={handleSubmit((values) => {
              setModeError(undefined);
              clearErrors("companyVoen");
              mutate(values);
            })}
          >
            {!isSuperAdminMode && (
              <Controller
                name="companyVoen"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Şirkət VÖEN"
                    required
                    validateStatus={errors.companyVoen ? "error" : undefined}
                    style={styles.formItem}
                  >
                    <Input
                      {...field}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      status={errors.companyVoen ? "error" : ""}
                      prefix={<BankOutlined style={styles.inputIcon} />}
                      placeholder="1234567890"
                      size="large"
                      autoComplete="organization"
                      inputMode="numeric"
                      maxLength={10}
                    />
                  </Form.Item>
                )}
              />
            )}

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label={s.email}
                  validateStatus={errors.email ? "error" : undefined}
                  style={styles.formItem}
                >
                  <Input
                    {...field}
                    prefix={<MailOutlined style={styles.inputIcon} />}
                    placeholder="ad@setclapp.com"
                    size="large"
                    autoComplete="email"
                  />
                </Form.Item>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label={s.password}
                  validateStatus={errors.password ? "error" : undefined}
                  style={styles.passwordItem}
                >
                  <Input.Password
                    {...field}
                    prefix={<LockOutlined style={styles.inputIcon} />}
                    placeholder="••••••••"
                    size="large"
                    autoComplete="current-password"
                  />
                </Form.Item>
              )}
            />

            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              size="large"
              block
              style={styles.loginButton}
            >
              {s.loginButton}
            </Button>

            <div className="dlogin-mode-switch">
              <span>
                {isSuperAdminMode
                  ? "Şirkət hesabı ilə daxil olursunuz?"
                  : "Super Admin hesabınız var?"}
              </span>
              <Link
                to={isSuperAdminMode ? "/login" : "/login?mode=super-admin"}
                replace
              >
                {isSuperAdminMode
                  ? "Şirkət girişinə qayıt"
                  : "Super Admin girişi"}
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
