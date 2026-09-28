import {
  BankOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  MailOutlined,
  RightOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Form } from "antd";
import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { strings } from "../../constants/strings";
import { useApiMutation } from "../../hooks/useApi";
import { authService } from "../../services/auth.service";
import { setCredentials } from "../../store/authSlice";
import { useAppDispatch } from "../../store/hooks";
import { getApiErrorMessage } from "../../utils/apiError";
import { decodeJwt } from "../../utils/jwt";
import { pickFirstLogin, pickPasswordExpiryDays } from "../../utils/normalize";
import { createLoginSchema, type LoginFormValues } from "../../validators/auth";
import SetClappLogo from "../../components/shared/SetClappLogo";
import { styles } from "../../styles/login/LoginPage.styles";

const s = strings.auth;

function FieldInput({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon: ReactNode;
  error?: string;
  children: (inputStyle: CSSProperties) => ReactNode;
}) {
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.fieldLabel}>{label}</label>
      <div
        style={{
          ...styles.inputWrap,
          ...(error ? styles.inputWrapError : {}),
        }}
      >
        <span style={styles.inputIcon}>{icon}</span>
        {children(styles.input)}
      </div>
      {error && <div style={styles.errorText}>{error}</div>}
    </div>
  );
}

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const isSuperAdminMode = searchParams.get("mode") === "super-admin";
  const loginSchema = createLoginSchema(isSuperAdminMode);
  const [modeError, setModeError] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const previousBackground = document.body.style.background;
    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.background = "#e6eef6";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.background = previousBackground;
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", companyVoen: "" },
  });

  useEffect(() => {
    setValue("companyVoen", "");
    clearErrors("companyVoen");
    setModeError(undefined);
  }, [clearErrors, isSuperAdminMode, setValue]);

  const { mutate, isPending, error } = useApiMutation(
    (values: LoginFormValues) => {
      const { companyVoen, ...credentials } = values;
      return authService.login(
        isSuperAdminMode ? credentials : { ...credentials, companyVoen },
      );
    },
    {
      onSuccess: (data) => {
        const decoded = decodeJwt(data.accessToken);
        if (!decoded) return;

        if (isSuperAdminMode !== (decoded.role === "SUPER_ADMIN")) {
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
    <div style={styles.page}>
      <div style={styles.wrap}>
        <div style={styles.brandCard}>
          <div style={styles.logoBox}>
            <img
              src="/layered-cards-logo.svg"
              alt=""
              style={styles.logoImage}
            />
          </div>
          <div>
            <div style={styles.brandName}>SetClapp</div>
            <div style={styles.brandSubtitle}>
              Rəqəmsal vizitkart platforması
            </div>
          </div>
        </div>

        <div style={styles.formCard}>
          <div
            key={isSuperAdminMode ? "super" : "company"}
            className="dlogin-form-fade"
          >
            <h1 style={styles.formTitle}>
              {isSuperAdminMode ? "Super Admin girişi" : "Sistemə giriş"}
            </h1>
            <p style={styles.formSubtitle}>
              {isSuperAdminMode
                ? "İdarəetmə hesabınıza daxil olun"
                : "Şirkət hesabınıza daxil olun"}
            </p>

            {errorMsg && !isVoenError && (
              <Alert
                type="error"
                message={errorMsg}
                style={styles.alert}
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
                    <FieldInput
                      label="Şirkət VÖEN"
                      icon={<BankOutlined />}
                      error={errors.companyVoen?.message}
                    >
                      {(inputStyle) => (
                        <input
                          {...field}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10),
                            )
                          }
                          placeholder="1234567890"
                          inputMode="numeric"
                          maxLength={10}
                          autoComplete="organization"
                          style={inputStyle}
                        />
                      )}
                    </FieldInput>
                  )}
                />
              )}

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <FieldInput
                    label={s.email}
                    icon={<MailOutlined />}
                    error={errors.email?.message}
                  >
                    {(inputStyle) => (
                      <input
                        {...field}
                        placeholder="info@sirket.az"
                        autoComplete="email"
                        style={inputStyle}
                      />
                    )}
                  </FieldInput>
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <FieldInput
                    label={s.password}
                    icon={<LockOutlined />}
                    error={errors.password?.message}
                  >
                    {(inputStyle) => (
                      <>
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          style={inputStyle}
                        />
                        <button
                          type="button"
                          aria-label={
                            showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"
                          }
                          style={styles.eyeToggle}
                          onClick={() => setShowPassword((v) => !v)}
                        >
                          {showPassword ? (
                            <EyeInvisibleOutlined />
                          ) : (
                            <EyeOutlined />
                          )}
                        </button>
                      </>
                    )}
                  </FieldInput>
                )}
              />

              <Button
                type="primary"
                htmlType="submit"
                loading={isPending}
                style={styles.submitButton}
              >
                Daxil ol
              </Button>
            </Form>
          </div>
        </div>

        <Link
          to={isSuperAdminMode ? "/login" : "/login?mode=super-admin"}
          replace
          style={styles.superAdminCard}
        >
          <span style={styles.superAdminIcon}>
            <SafetyOutlined />
          </span>
          <span style={styles.superAdminText}>
            <div style={styles.superAdminTitle}>
              {isSuperAdminMode
                ? "Şirkət hesabı ilə daxil ol"
                : "Super Admin girişi"}
            </div>
            <div style={styles.superAdminSubtitle}>
              {isSuperAdminMode
                ? "Şirkət hesabınıza qayıdın"
                : "Platforma üzrə bütün şirkətlərə giriş"}
            </div>
          </span>
          <RightOutlined style={styles.superAdminChevron} />
        </Link>

        <p style={styles.footer}>
          <a
            href="https://www.setclapp.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="SetClapp"
            style={styles.footerLogoLink}
          >
            <SetClappLogo height={16} />
          </a>
          © 2019 - 2026 SetClapp MMC
        </p>
      </div>
    </div>
  );
}
