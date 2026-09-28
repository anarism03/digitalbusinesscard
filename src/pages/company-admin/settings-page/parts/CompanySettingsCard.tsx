import { useEffect, useRef } from "react";
import { Card, Form, Input, Button, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import {
  UploadOutlined,
  BankOutlined,
  ShopOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "../../../../components/shared/PhoneInput";
import {
  useMyCompany,
  useUpdateMyCompany,
} from "../../../../hooks/useCompanies";
import { useImageUpload } from "../../../../hooks/useImageUpload";
import AssetAvatar from "../../../../components/shared/AssetAvatar";
import EmployeeLimitProgress from "./EmployeeLimitProgress";
import LoadingSkeleton from "../../../../components/shared/LoadingSkeleton";
import {
  companySettingsSchema,
  type CompanySettingsValues,
} from "../../../../validators/company";
import { styles } from "../../../../styles/company-admin/CompanySettingsCard.styles";
import { companiesService } from "../../../../services/companies.service";
import { isImageDataUrl } from "../../../../utils/url";
import { resolveVcfPhotoDataUrl } from "../../../../utils/vcard";
import type { Company, UpdateCompanyDto } from "../../../../types";

function buildCompanyUpdatePayload(company: Company): UpdateCompanyDto {
  return {
    name: company.name,
    voen: company.voen,
    address: company.address,
    email: company.email,
    phone: company.phone,
    logoUrl: company.logoUrl,
    userLimit: company.userLimit,
    nfcBaseUrl: company.nfcBaseUrl,
  };
}

interface CompanySettingsCardProps {
  usedCount: number | null;
}

export default function CompanySettingsCard({
  usedCount,
}: CompanySettingsCardProps) {
  const navigate = useNavigate();
  const { data: company, isLoading, refetch } = useMyCompany();
  const updateCompany = useUpdateMyCompany();
  const logoUpload = useImageUpload({ maxSizePx: 360, quality: 0.72 });
  const logoSrc = logoUpload.src ?? company?.logoUrl;
  const healedLogoIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (!company?.logoUrl) return;
    if (isImageDataUrl(company.logoUrl)) return;
    if (healedLogoIdRef.current === company.id) return;
    healedLogoIdRef.current = company.id;

    let cancelled = false;
    resolveVcfPhotoDataUrl(company.logoUrl)
      .then(async (base64) => {
        if (cancelled || !base64) return;
        await companiesService.updateMyCompany({
          ...buildCompanyUpdatePayload(company),
          logoUrl: base64,
        });
        if (!cancelled) void refetch();
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [company, refetch]);

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
    try {
      await updateCompany.mutateAsync(values);
      logoUpload.reset();
    } catch {}
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
          aria-label="Şirkət kartına önizləmə"
          title="Şirkət kartına önizləmə"
          disabled={!company}
          onClick={() => navigate("/admin/card?context=company")}
          style={styles.previewButton}
        />
      }
      style={styles.card}
    >
      <div style={styles.logoRow}>
        <AssetAvatar
          shape="square"
          size={76}
          src={logoSrc}
          name={company?.name}
          icon={<BankOutlined style={styles.bankIcon} />}
          imageStyle={styles.logoImage}
          style={styles.logoAvatar}
        />
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
          loading={updateCompany.isPending || logoUpload.isProcessing}
          disabled={logoUpload.isProcessing}
          style={styles.saveButton}
        >
          Yadda saxla
        </Button>
      </Form>
    </Card>
  );
}
