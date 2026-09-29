import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useEmployees,
  useSetEmployeeActive,
  useResetEmployeePassword,
} from "../../../../hooks/useEmployees";
import { useMyCompany } from "../../../../hooks/useCompanies";
import { useScrollSentinel } from "../../../../hooks/useInfiniteScroll";
import { useAppSelector } from "../../../../store/hooks";
import { exportImportService } from "../../../../services/exportImport.service";
import { triggerBlobDownload } from "../../../../utils/file";
import { showApiError } from "../../../../utils/apiError";
import { SIZES } from "../../../../constants/ui";
import { updateSearchParams } from "../../../../utils/urlSearch";
import type { Employee, EmployeeStatusTab } from "../../../../types";

function readTab(value: string | null): EmployeeStatusTab {
  return value === "inactive" ? "inactive" : "active";
}

export function useTeamListSection(
  onSelectEmployee: (id: string, edit: boolean) => void,
) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAppSelector((s) => s.auth.user);

  const activeTab = readTab(searchParams.get("status"));
  const searchQuery = searchParams.get("q") ?? "";
  const [visibleCount, setVisibleCount] = useState<number>(SIZES.tablePageSize);
  const [confirmEmployee, setConfirmEmployee] = useState<Employee | null>(null);
  const closeConfirm = useCallback(() => setConfirmEmployee(null), []);
  const [previewEmployee, setPreviewEmployee] = useState<Employee | null>(null);
  const [shareEmployee, setShareEmployee] = useState<Employee | null>(null);
  const [identifiersEmployee, setIdentifiersEmployee] =
    useState<Employee | null>(null);
  const [resetEmployee, setResetEmployee] = useState<Employee | null>(null);
  const [resetSuccessPassword, setResetSuccessPassword] = useState<
    string | null
  >(null);
  const [changeOwnPasswordOpen, setChangeOwnPasswordOpen] = useState(false);

  const companyId = user?.companyId ?? "";
  const {
    data: employees = [],
    isLoading,
    isError,
    refetch,
  } = useEmployees(companyId);
  const setActive = useSetEmployeeActive();
  const resetPassword = useResetEmployeePassword();

  const { data: company } = useMyCompany();

  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, boolean>
  >({});

  const effectiveEmployees = useMemo(
    () =>
      employees.map((e) => ({
        ...e,
        isActive: statusOverrides[e.id] ?? e.isActive,
      })),
    [employees, statusOverrides],
  );

  const archivedCount = useMemo(
    () => effectiveEmployees.filter((e) => !e.isActive).length,
    [effectiveEmployees],
  );

  const limit = company?.userLimit;
  const usedCount = effectiveEmployees.length;
  const limitReached = limit != null && limit > 0 && usedCount >= limit;

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return effectiveEmployees
      .filter((e) => e.isActive === (activeTab === "active"))
      .filter(
        (e) =>
          !query ||
          e.fullName.toLowerCase().includes(query) ||
          (e.jobTitle ?? "").toLowerCase().includes(query),
      )
      .sort((a, b) => (a.id === user?.id ? -1 : b.id === user?.id ? 1 : 0));
  }, [effectiveEmployees, activeTab, searchQuery, user?.id]);

  const totalCount = filtered.length;
  const pageItems = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );
  const hasMore = visibleCount < filtered.length;
  const revealMore = useCallback(
    () => setVisibleCount((count) => count + SIZES.tablePageSize),
    [],
  );

  const setEmployeeParams = useCallback(
    (
      updates: Record<string, string | number | boolean | null | undefined>,
      replace = false,
    ) => {
      setSearchParams((current) => updateSearchParams(current, updates), {
        replace,
      });
    },
    [setSearchParams],
  );

  useEffect(() => {
    setVisibleCount(SIZES.tablePageSize);
  }, [activeTab, searchQuery]);

  const sentinelRef = useScrollSentinel(hasMore, revealMore);

  const handleView = useCallback(
    (row: Employee) => onSelectEmployee(row.id, false),
    [onSelectEmployee],
  );

  const handleEdit = useCallback(
    (row: Employee) => onSelectEmployee(row.id, true),
    [onSelectEmployee],
  );

  const handleToggleActive = useCallback(
    (row: Employee) => setConfirmEmployee(row),
    [],
  );

  const openChangeOwnPassword = useCallback(
    () => setChangeOwnPasswordOpen(true),
    [],
  );

  const handleConfirmToggle = () => {
    if (!confirmEmployee) return;
    const id = confirmEmployee.id;
    const newStatus = !confirmEmployee.isActive;

    setStatusOverrides((prev) => ({ ...prev, [id]: newStatus }));

    setActive.mutate(
      { id, isActive: newStatus },
      {
        onSuccess: () => {
          setEmployeeParams({ status: newStatus ? "active" : "inactive" });
        },
        onError: () => {
          setStatusOverrides((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        },
        onSettled: closeConfirm,
      },
    );
  };

  const handleResetPassword = async (newPassword: string) => {
    if (!resetEmployee) return;
    try {
      await resetPassword.mutateAsync({
        id: resetEmployee.id,
        data: { newPassword },
      });
      setResetEmployee(null);
      setResetSuccessPassword(newPassword);
    } catch {}
  };

  const handleDownloadVcf = useCallback(async (row: Employee) => {
    try {
      const blob = await exportImportService.downloadVcf(row.id);
      triggerBlobDownload(blob, `${row.fullName.replace(/\s+/g, "_")}.vcf`);
    } catch (error) {
      showApiError(error);
    }
  }, []);

  return {
    navigate,
    user,
    activeTab,
    searchQuery,
    confirmEmployee,
    closeConfirm,
    previewEmployee,
    setPreviewEmployee,
    shareEmployee,
    setShareEmployee,
    identifiersEmployee,
    setIdentifiersEmployee,
    resetEmployee,
    setResetEmployee,
    resetSuccessPassword,
    setResetSuccessPassword,
    changeOwnPasswordOpen,
    setChangeOwnPasswordOpen,
    isLoading,
    isError,
    refetch,
    setActive,
    resetPassword,
    archivedCount,
    limit,
    usedCount,
    limitReached,
    totalCount,
    pageItems,
    hasMore,
    sentinelRef,
    setEmployeeParams,
    handleView,
    handleEdit,
    handleToggleActive,
    handleConfirmToggle,
    handleResetPassword,
    handleDownloadVcf,
    openChangeOwnPassword,
  };
}
