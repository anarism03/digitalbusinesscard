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
import { ROLE_TO_NUM } from "../../../constants/roles";
import { strings } from "../../../constants/strings";
import { message } from "../../../utils/feedback";
import type { EmployeeFormValues } from "../../../validators/employee";

const TEAM_ROUTE = "/admin/card?context=company&view=team";
const s = strings.employees.form;

export default function EmployeeFormPage() {
  const navigate = useNavigate();
  const companyId = useAppSelector((state) => state.auth.user?.companyId) ?? "";

  const createEmployee = useCreateEmployee();
  const setCanEdit = useSetEmployeeCanEdit();

  const { data: company } = useMyCompany();
  const { data: employees = [] } = useEmployees(companyId);
  const limitReached =
    company?.userLimit != null &&
    company.userLimit > 0 &&
    employees.length >= company.userLimit;

  const handleSubmit = async (values: EmployeeFormValues) => {
    let newId: string;
    try {
      const created = await createEmployee.mutateAsync({
        ...values,
        companyId,
        middleName: values.middleName || undefined,
        role: ROLE_TO_NUM.EMPLOYEE,
        isActive: true,
      });

      newId = mapEmployee(created).id;
    } catch {
      return;
    }

    if (newId) {
      try {
        await setCanEdit.mutateAsync({ id: newId, canEdit: false });
      } catch {
        message.warning(
          "Əməkdaş yaradıldı, amma redaktə icazəsi yenilənmədi. İcazəni tənzimləmələrdə yoxlayın.",
        );
      }
    }

    navigate(
      newId ? `/admin/card?context=company&employeeId=${newId}` : TEAM_ROUTE,
    );
  };

  return (
    <div>
      <PageHeader title={s.createTitle} back />
      <Card>
        {limitReached ? (
          <Alert
            type="warning"
            showIcon
            message="Şirkətiniz əməkdaş limitinə çatıb"
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
