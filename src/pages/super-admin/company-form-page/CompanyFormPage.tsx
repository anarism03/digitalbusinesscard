import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Card } from "antd";
import {
  useCompanies,
  useCompany,
  useCreateCompany,
  useUpdateCompany,
} from "../../../hooks/useCompanies";
import CompanyForm from "./parts/CompanyForm";
import PageHeader from "../../../components/shared/PageHeader";
import LoadingSkeleton from "../../../components/shared/LoadingSkeleton";
import ErrorState from "../../../components/shared/ErrorState";
import { strings } from "../../../constants/strings";
import type { CompanyFormValues } from "../../../validators/company";
import CompanyAdminCreatedModal from "./modals/CompanyAdminCreatedModal";
import type { CompanyAdminCredentials } from "../../../types";

const s = strings.companies.form;

export default function CompanyFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  const { data: companies = [], isLoading: companiesLoading } = useCompanies();
  const {
    data: company,
    isLoading: companyLoading,
    isError,
    refetch,
  } = useCompany(id);
  const [adminInfo, setAdminInfo] = useState<CompanyAdminCredentials | null>(
    null,
  );

  const handleSubmit = async (values: CompanyFormValues) => {
    const payload = {
      name: values.name,
      userLimit: values.userLimit,
      voen: values.voen || undefined,
      logoUrl: isEdit ? (values.logoUrl ?? "") : values.logoUrl || undefined,
      address: values.address || undefined,
      email: values.email || undefined,
      phone: values.phone || undefined,
    };

    try {
      if (isEdit && id) {
        await updateCompany.mutateAsync({ id, data: payload });
        navigate("/super-admin/companies");
        return;
      }

      const created = await createCompany.mutateAsync(payload);
      const voen = created.voen || payload.voen;
      if (created.adminEmail || created.defaultPassword) {
        setAdminInfo({
          email: created.adminEmail,
          password: created.defaultPassword,
          voen,
        });
        return;
      }

      navigate("/super-admin/companies");
    } catch {}
  };

  if (isEdit && companyLoading) return <LoadingSkeleton />;
  if (isEdit && isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeader title={isEdit ? "Şirkəti redaktə et" : s.createTitle} back />
      <Card>
        {isEdit && !company ? (
          <Alert type="warning" showIcon message="Şirkət tapılmadı" />
        ) : (
          <CompanyForm
            defaultValues={company}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/super-admin/companies")}
            isLoading={
              createCompany.isPending ||
              updateCompany.isPending ||
              companiesLoading ||
              companyLoading
            }
            existingVoens={companies
              .filter((item) => item.id !== id)
              .map((item) => item.voen)}
            submitText={isEdit ? "Yadda saxla" : "Şirkət yarat"}
          />
        )}
      </Card>

      <CompanyAdminCreatedModal
        credentials={adminInfo}
        onClose={() => navigate("/super-admin/companies")}
      />
    </div>
  );
}
