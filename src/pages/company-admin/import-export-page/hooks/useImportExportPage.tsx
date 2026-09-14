import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../../../store/hooks";
import { useEmployeesPage } from "../../../../hooks/useEmployees";
import { useMyCompany } from "../../../../hooks/useCompanies";
import { readPositiveInt, updateSearchParams } from "../../../../utils/urlSearch";
import { useExcelExport } from "./useExcelExport";
import { useExcelImport } from "./useExcelImport";
import { useHtmlExport } from "./useHtmlExport";

export function useImportExportPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = readPositiveInt(searchParams.get("page"), 1);
  const pageSize = readPositiveInt(searchParams.get("pageSize"), 50);
  const user = useAppSelector((state) => state.auth.user);
  const companyId = user?.companyId ?? "";
  const { data: pageData, isLoading: employeesLoading } = useEmployeesPage(
    companyId,
    page,
    pageSize,
  );
  const employees = pageData?.items ?? [];
  const totalCount = pageData?.totalCount ?? employees.length;
  const { data: company } = useMyCompany();
  const limitReached = !!company?.userLimit && totalCount >= company.userLimit;

  const employeeOptions = employees.map((employee) => ({
    label: `${employee.fullName} — ${employee.email}`,
    value: employee.id,
  }));

  const excelExport = useExcelExport(companyId);
  const htmlExport = useHtmlExport(companyId);
  const excelImport = useExcelImport(companyId, limitReached, company?.userLimit);

  const goToPage = (nextPage: number) => {
    setSearchParams((curr) => updateSearchParams(curr, { page: nextPage }));
  };

  return {
    company,
    employeeOptions,
    employeesLoading,
    goToPage,
    limitReached,
    page,
    pageSize,
    totalCount,
    ...excelExport,
    ...htmlExport,
    ...excelImport,
  };
}
