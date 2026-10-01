import { useAppSelector } from "../../../../store/hooks";
import { useEmployees } from "../../../../hooks/useEmployees";
import { useMyCompany } from "../../../../hooks/useCompanies";
import { useExcelExport } from "./useExcelExport";
import { useExcelImport } from "./useExcelImport";
import { useHtmlExport } from "./useHtmlExport";

export function useImportExportPage() {
  const user = useAppSelector((state) => state.auth.user);
  const companyId = user?.companyId ?? "";
  const {
    data: employees = [],
    isLoading: employeesLoading,
    isError: employeesError,
    refetch: refetchEmployees,
  } = useEmployees(companyId);
  const {
    data: company,
    isLoading: companyLoading,
    isError: companyError,
    refetch: refetchCompany,
  } = useMyCompany();
  const limitReached =
    company?.userLimit != null &&
    company.userLimit > 0 &&
    employees.length >= company.userLimit;

  const employeeOptions = employees.map((employee) => ({
    label: `${employee.fullName} — ${employee.email}`,
    value: employee.id,
  }));

  const excelExport = useExcelExport(companyId);
  const htmlExport = useHtmlExport(companyId);
  const excelImport = useExcelImport(
    companyId,
    limitReached,
    company?.userLimit,
  );

  return {
    company,
    companyError,
    refetchCompany,
    employeeOptions,
    employeesLoading,
    employeesError,
    refetchEmployees,
    canImport:
      !employeesLoading &&
      !employeesError &&
      !companyLoading &&
      !companyError &&
      Boolean(company),
    limitReached,
    ...excelExport,
    ...htmlExport,
    ...excelImport,
  };
}
