import { useEffect, useState } from "react";
import { Card, Form, Input, Button, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { UploadOutlined, ShopOutlined, EyeOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "../../../../components/shared/PhoneInput";
import {
  useMyCompany,
  useUpdateMyCompany,
} from "../../../../hooks/useCompanies";
import { useImageUpload } from "../../../../hooks/useImageUpload";
import CompanyLogo from "../../../../components/shared/CompanyLogo";
import EmployeeLimitProgress from "./EmployeeLimitProgress";
import LoadingSkeleton from "../../../../components/shared/LoadingSkeleton";
import {
  companySettingsSchema,
  type CompanySettingsValues,
} from "../../../../validators/company";
import { styles } from "../../../../styles/company-admin/CompanySettingsCard.styles";
import { isImageDataUrl } from "../../../../utils/url";
import {
  COMPANY_LOGO_UPLOAD_OPTIONS,
  resolveCompanyLogoDataUrl,
} from "../../../../utils/companyLogo";

interface CompanySettingsCardProps {
  usedCount: number | null;
}

export default function CompanySettingsCard({
  usedCount,
}: CompanySettingsCardProps) {
  const navigate = useNavigate();
  const { data: company, isLoading } = useMyCompany();
  const updateCompany = useUpdateMyCompany();
  const logoUpload = useImageUpload(COMPANY_LOGO_UPLOAD_OPTIONS);
  const [isPreparingLogo, setIsPreparingLogo] = useState(false);
  const logoSrc = logoUpload.src ?? company?.logoUrl;
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CompanySettingsValues>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      name: "",
      voen: "",
      address: "",
      email: "",
      phone: "",
      nfcBaseUrl: "",
    },
  });

  useEffect(() => {
    if (!company) return;
    reset({
      name: company.name ?? "",
      voen: company.voen ?? "",
      address: company.address ?? "",
      email: company.email ?? "",
      phone: company.phone ?? "",
      logoUrl: company.logoUrl ?? "",
      userLimit: company.userLimit,
      nfcBaseUrl: company.nfcBaseUrl ?? "",
    });
  }, [company, reset]);

  useEffect(() => {
    if (logoUpload.src) setValue("logoUrl", logoUpload.src);
  }, [logoUpload.src, setValue]);

  const onValid = async (values: CompanySettingsValues) => {
    if (isPreparingLogo) return;
    setIsPreparingLogo(true);
    try {
      const logoUrl =
        values.logoUrl && !isImageDataUrl(values.logoUrl)
          ? ((await resolveCompanyLogoDataUrl(values.logoUrl)) ??
            values.logoUrl)
          : values.logoUrl;
      await updateCompany.mutateAsync({ ...values, logoUrl });
      logoUpload.reset();
    } catch {
    } finally {
      setIsPreparingLogo(false);
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <Card
      title={
        <span style={styles.title}>
          <span style={styles.titleIconBadge}>
            <ShopOutlined style={styles.titleIcon} />
          </span>
          Şirkət məlumatları
        </span>
      }
      extra={
        <Button
          type="text"
          htmlType="button"
          icon={<EyeOutlined />}
          aria-label="Şirkət kartını önizlə"
          title="Şirkət kartını önizlə"
          disabled={!company}
          onClick={() => navigate("/admin/card?context=company")}
          style={styles.previewButton}
        />
      }
      style={styles.card}
    >
      <div style={styles.logoRow}>
        <CompanyLogo size={76} src={logoSrc} name={company?.name} />
        <Upload
          showUploadList={false}
          accept="image/*"
          beforeUpload={logoUpload.beforeUpload}
        >
          <Button
            icon={<UploadOutlined />}
            loading={logoUpload.isProcessing}
            style={styles.uploadButton}
          >
            {logoSrc ? "Loqonu dəyiş" : "Loqo yüklə"}
          </Button>
        </Upload>
        {company?.voen && (
          <span style={styles.voenBadge}>
            VÖEN: <span style={styles.voenValue}>{company.voen}</span>
          </span>
        )}
      </div>

      {company && usedCount !== null && company.userLimit > 0 && (
        <EmployeeLimitProgress used={usedCount} total={company.userLimit} />
      )}

      <div style={styles.divider} />

      <Form layout="vertical" className="settings-form">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Şirkətin adı"
              required
              validateStatus={errors.name ? "error" : undefined}
              help={errors.name?.message}
            >
              <Input
                {...field}
                placeholder="Şirkətin adı"
                maxLength={100}
                showCount
              />
            </Form.Item>
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Ünvan"
              validateStatus={errors.address ? "error" : undefined}
              help={errors.address?.message}
            >
              <Input {...field} placeholder="Ünvan" maxLength={250} showCount />
            </Form.Item>
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="E-poçt"
              validateStatus={errors.email ? "error" : undefined}
              help={errors.email?.message}
            >
              <Input
                {...field}
                placeholder="info@sirket.az"
                maxLength={100}
                showCount
              />
            </Form.Item>
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Telefon"
              validateStatus={errors.phone ? "error" : undefined}
              help={errors.phone?.message}
            >
              <PhoneInput
                value={field.value}
                onChange={field.onChange}
                status={errors.phone ? "error" : ""}
              />
            </Form.Item>
          )}
        />

        <Controller
          name="nfcBaseUrl"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="NFC Base URL"
              validateStatus={errors.nfcBaseUrl ? "error" : undefined}
              help={errors.nfcBaseUrl?.message}
            >
              <Input
                {...field}
                placeholder="https://kartim.az"
                maxLength={250}
                showCount
              />
            </Form.Item>
          )}
        />

        <Button
          type="primary"
          onClick={handleSubmit(onValid)}
          loading={
            updateCompany.isPending ||
            logoUpload.isProcessing ||
            isPreparingLogo
          }
          disabled={logoUpload.isProcessing || isPreparingLogo}
          style={styles.saveButton}
        >
          Yadda saxla
        </Button>
      </Form>
    </Card>
  );
}
