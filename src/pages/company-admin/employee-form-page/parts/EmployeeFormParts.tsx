import type { ReactNode } from "react";
import { Button, Form, Input, Space } from "antd";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { CopyOutlined, ReloadOutlined } from "@ant-design/icons";
import type { EmployeeFormValues } from "../../../../validators/employee";
import { styles } from "../../../../styles/company-admin/EmployeeForm.styles";

type StringFieldName =
  | "firstName"
  | "lastName"
  | "middleName"
  | "jobTitle"
  | "email"
  | "additionalInfo"
  | "linkedinUrl"
  | "facebookUrl"
  | "instagramUrl"
  | "googleMapsUrl";

interface ControlProps {
  control: Control<EmployeeFormValues>;
  errors: FieldErrors<EmployeeFormValues>;
}

interface TextFieldProps extends ControlProps {
  name: StringFieldName;
  label: ReactNode;
  placeholder: string;
  required?: boolean;
  maxLength: number;
  type?: string;
  textarea?: boolean;
  rows?: number;
}

export function TextField({
  control,
  errors,
  name,
  label,
  placeholder,
  required,
  maxLength,
  type,
  textarea,
  rows,
}: TextFieldProps) {
  const error = errors[name];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Form.Item
          label={label}
          required={required}
          validateStatus={error ? "error" : undefined}
        >
          {textarea ? (
            <Input.TextArea
              {...field}
              rows={rows}
              placeholder={placeholder}
              maxLength={maxLength}
              showCount
            />
          ) : (
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              maxLength={maxLength}
              showCount
            />
          )}
        </Form.Item>
      )}
    />
  );
}

interface PasswordFieldProps extends ControlProps {
  onRegenerate: () => void;
  onCopy: () => void;
}

export function PasswordField({
  control,
  errors,
  onRegenerate,
  onCopy,
}: PasswordFieldProps) {
  return (
    <Controller
      name="password"
      control={control}
      render={({ field }) => (
        <Form.Item
          label="Şifrə"
          required
          validateStatus={errors.password ? "error" : undefined}
        >
          <Space.Compact style={styles.fullWidth}>
            <Input.Password
              {...field}
              placeholder="Ən az 6 simvol"
              autoComplete="new-password"
              maxLength={150}
            />
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={onRegenerate}
              aria-label="Şifrə yarat"
            />
            <Button
              type="default"
              icon={<CopyOutlined />}
              onClick={onCopy}
              aria-label="Şifrəni kopyala"
            />
          </Space.Compact>
        </Form.Item>
      )}
    />
  );
}
