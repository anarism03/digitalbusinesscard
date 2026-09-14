import { useNavigate } from "react-router-dom";
import { Card, Alert } from "antd";
import {
  useEmployees,
  useCreateEmployee,
  useSetEmployeeCanEdit,
} from "../../../hooks/useEmployees";
import { useMyCompany } from "../../../hooks/useCompanies";
import { mapEmployee } from "../../../utils/mappers";
import { useAppSelector } from "../../../store/hooks";
import EmployeeForm from "./parts/EmployeeForm";
import PageHeader from "../../../components/shared/PageHeader";
import { strings } from "../../../constants/strings";
import type { EmployeeFormValues } from "../../../validators/employee";
import { ROLE_TO_NUM } from "../../../types";

const TEAM_ROUTE = "/admin/card?context=company&view=team";

export default function EmployeeFormPage() {
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const createEmployee = useCreateEmployee();
  const setCanEdit = useSetEmployeeCanEdit();

  const { data: company } = useMyCompany();
  const { data: employees = [] } = useEmployees(user?.companyId ?? "");
  const totalEmployees = employees.length;
  const limitReached =
    company?.userLimit != null &&
    company.userLimit > 0 &&
    totalEmployees >= company.userLimit;

  const handleSubmit = async (values: EmployeeFormValues) => {
    const created = await createEmployee.mutateAsync({
      companyId: user?.companyId ?? "",
      firstName: values.firstName,
      lastName: values.lastName,
      middleName: values.middleName || undefined,
      jobTitle: values.jobTitle,
      email: values.email,
      phone1: values.phone1,
      password: values.password ?? "",
      role: ROLE_TO_NUM["EMPLOYEE"],
      isActive: values.isActive ?? true,
    });

    const newId = mapEmployee(created).id;
    if (newId)
      await setCanEdit.mutateAsync({
        id: newId,
        canEdit: values.canEdit ?? false,
      });

    navigate(
      newId
        ? `/admin/card?context=company&employeeId=${newId}`
        : TEAM_ROUTE,
    );
  };

  const s = strings.employees.form;

  return (
    <div>
      <PageHeader title={s.createTitle} back />
      <Card>
        {limitReached ? (
          <Alert
            type="warning"
            showIcon
            message="Şirkətiniz üçün əməkdaş limiti aşılıb"
            description={`Maksimum: ${company?.userLimit}. Deaktiv əməkdaşlar da limitə daxildir.`}
          />
        ) : (
          <EmployeeForm
            onSubmit={handleSubmit}
            onCancel={() => navigate(TEAM_ROUTE)}
            isLoading={createEmployee.isPending || setCanEdit.isPending}
          />
        )}
      </Card>
    </div>
  );
}
