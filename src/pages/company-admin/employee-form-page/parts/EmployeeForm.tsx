import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form } from "antd";
import { generateTemporaryPassword } from "../../../../utils/password";
import { copyToClipboard } from "../../../../utils/feedback";
import {
  createEmployeeSchema,
  type EmployeeFormValues,
} from "../../../../validators/employee";
import { strings } from "../../../../constants/strings";
import { styles } from "../../../../styles/company-admin/EmployeeForm.styles";
import PhoneInput from "../../../../components/shared/PhoneInput";
import { PasswordField, TextField } from "./EmployeeFormParts";
import { toEmployeeFormValues } from "./employeeFormValues";

const s = strings.employees.form;

interface EmployeeFormProps {
  onSubmit: (values: EmployeeFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EmployeeForm({
  onSubmit,
  onCancel,
  isLoading,
}: EmployeeFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      ...toEmployeeFormValues(),
      password: generateTemporaryPassword(),
    },
  });

  const regeneratePassword = () => {
    setValue("password", generateTemporaryPassword(), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const copyPassword = () => copyToClipboard(getValues("password"));

  return (
    <Form
      layout="vertical"
      className="employee-create-form"
      onFinish={handleSubmit((values) => onSubmit(values))}
    >
      <TextField
        control={control}
        errors={errors}
        name="firstName"
        label="Ad"
        placeholder="Ad"
        maxLength={50}
        required
      />
      <TextField
        control={control}
        errors={errors}
        name="lastName"
        label="Soyad"
        placeholder="Soyad"
        maxLength={50}
        required
      />
      <TextField
        control={control}
        errors={errors}
        name="middleName"
        label="Ata adı"
        placeholder="Ata adı (ixtiyari)"
        maxLength={50}
      />
      <TextField
        control={control}
        errors={errors}
        name="jobTitle"
        label={s.position}
        placeholder="Vəzifə"
        maxLength={100}
        required
      />
      <TextField
        control={control}
        errors={errors}
        name="email"
        label="E-poçt"
        placeholder="email@sirket.az"
        maxLength={50}
        type="email"
        required
      />
      <Controller
        name="phone1"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="İş telefonu"
            required
            validateStatus={errors.phone1 ? "error" : undefined}
          >
            <PhoneInput
              value={field.value}
              onChange={field.onChange}
              status={errors.phone1 ? "error" : undefined}
            />
          </Form.Item>
        )}
      />
      <PasswordField
        control={control}
        errors={errors}
        onRegenerate={regeneratePassword}
        onCopy={copyPassword}
      />
      <Form.Item className="mb-0">
        <div style={styles.actions}>
          <Button onClick={onCancel}>{s.cancelButton}</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Yadda saxla
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
