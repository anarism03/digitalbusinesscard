import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Input, InputNumber, Button, Divider } from "antd";
import PhoneInput from "../../../components/shared/PhoneInput";
import { useBase64ImageUpload } from "../../../hooks/useBase64ImageUpload";
import { companySchema, type CompanyFormValues } from "../../../validators/company";
import { strings } from "../../../constants/strings";
import type { Company } from "../../../types";
import { isAllowedNumberKey } from "../../../utils/text";
import { styles } from "../../../styles/super-admin/CompanyForm.styles";
import CompanyLogoField from "./CompanyLogoField";

const s = strings.companies.form;

function toValues(company?: Company): CompanyFormValues {
  return {
    name: company?.name ?? "",
    voen: company?.voen ?? "",
    logoUrl: company?.logoUrl ?? "",
    address: company?.address ?? "",
    email: company?.email ?? "",
    phone: company?.phone ?? "",
    userLimit: company?.userLimit ?? 10,
  };
}

interface CompanyFormProps {
  defaultValues?: Company;
  onSubmit: (values: CompanyFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  existingVoens?: Array<string | undefined>;
  submitText?: string;
}

export default function CompanyForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  existingVoens = [],
  submitText = strings.common.save,
}: CompanyFormProps) {
  const logoUpload = useBase64ImageUpload({ maxSizePx: 360, quality: 0.72 });
  const isEdit = Boolean(defaultValues?.id);

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: toValues(defaultValues),
  });

  const logoPreview = logoUpload.dataUrl || watch("logoUrl");

  useEffect(() => {
    reset(toValues(defaultValues));
  }, [defaultValues, reset]);

  useEffect(() => {
    if (logoUpload.dataUrl) {
      setValue("logoUrl", logoUpload.dataUrl, { shouldDirty: true });
    }
  }, [logoUpload.dataUrl, setValue]);

  const handleValidSubmit = async (values: CompanyFormValues) => {
    const voen = values.voen.replace(/\D/g, "");
    const exists = existingVoens.some(
      (existingVoen) => (existingVoen ?? "").replace(/\D/g, "") === voen,
    );

    if (!isEdit && exists) {
      setError("voen", {
        type: "manual",
        message: "Bu VÖEN-də şirkət sistemdə var.",
      });
      return;
    }

    await onSubmit(values);
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit(handleValidSubmit)}
      style={styles.form}
    >
      <CompanyLogoField
        label={s.logo}
        hint={s.logoHint}
        logoPreview={logoPreview}
        onRemove={() => {
          logoUpload.clear();
          setValue("logoUrl", "");
        }}
        onFileChange={logoUpload.onInputChange}
      />

      <Divider style={styles.divider} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Form.Item
              label={s.name}
              required
              validateStatus={errors.name ? "error" : undefined}
            >
              <Input {...field} placeholder={s.namePlaceholder} maxLength={100} showCount />
            </Form.Item>
          )}
        />
        <Controller
          name="voen"
          control={control}
          render={({ field }) => (
            <Form.Item
              label={s.voen}
              required
              validateStatus={errors.voen ? "error" : undefined}
            >
              <Input
                {...field}
                disabled={isEdit}
                onChange={(e) =>
                  field.onChange(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder={s.voenPlaceholder}
                maxLength={10}
                inputMode="numeric"
              />
            </Form.Item>
          )}
        />
      </div>

      <Controller
        name="address"
        control={control}
        render={({ field }) => (
          <Form.Item
            label={s.address}
            required
            validateStatus={errors.address ? "error" : undefined}
          >
            <Input.TextArea
              {...field}
              placeholder={s.addressPlaceholder}
              rows={2}
              maxLength={250}
              showCount
              style={styles.textArea}
            />
          </Form.Item>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Şirkət e-poçtu"
              required
              validateStatus={errors.email ? "error" : undefined}
            >
              <Input {...field} placeholder="info@sirket.az" maxLength={100} showCount />
            </Form.Item>
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Şirkət telefonu"
              required
              validateStatus={errors.phone ? "error" : undefined}
            >
              <PhoneInput
                value={field.value}
                onChange={field.onChange}
                status={errors.phone ? "error" : ""}
              />
            </Form.Item>
          )}
        />
      </div>

      <Divider style={styles.divider} />

      <Controller
        name="userLimit"
        control={control}
        render={({ field }) => (
          <Form.Item
            label={s.employeeLimit}
            required
            validateStatus={errors.userLimit ? "error" : undefined}
          >
            <InputNumber
              {...field}
              min={1}
              precision={0}
              inputMode="numeric"
              onKeyDown={(event) => {
                if (!isAllowedNumberKey(event.key)) event.preventDefault();
              }}
              placeholder="10"
              style={styles.fullWidth}
            />
          </Form.Item>
        )}
      />

      <Form.Item style={styles.actionItem}>
        <div style={styles.actions}>
          <Button onClick={onCancel}>{strings.common.cancel}</Button>
          <Button type="primary" htmlType="submit" loading={isLoading || logoUpload.isProcessing}>
            {submitText}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
