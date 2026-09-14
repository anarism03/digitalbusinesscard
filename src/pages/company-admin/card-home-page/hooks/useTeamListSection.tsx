import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useEmployees,
  useSetEmployeeActive,
  useResetEmployeePassword,
} from "../../../../hooks/useEmployees";
import { useMyCompany } from "../../../../hooks/useCompanies";
import { useChangePassword } from "../../../../hooks/useUser";
import { useAppSelector } from "../../../../store/hooks";
import { exportImportService } from "../../../../services/exportImport.service";
import { triggerBlobDownload } from "../../../../utils/download";
import { showApiError } from "../../../../utils/apiError";
import { SIZES } from "../../../../constants/ui";
import { readPositiveInt, updateSearchParams } from "../../../../utils/urlSearch";
import type { ChangePasswordValues, Employee, TabKey } from "../../../../types";

function readTab(value: string | null): TabKey {
  return value === "inactive" ? "inactive" : "active";
}

interface ConfirmState {
  open: boolean;
  item: Employee | null;
  targetStatus: "ACTIVE" | "INACTIVE";
}

const CLOSED_CONFIRM: ConfirmState = {
  open: false,
  item: null,
  targetStatus: "ACTIVE",
};

export function useTeamListSection(
  onSelectEmployee: (id: string, edit: boolean) => void,
) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAppSelector((s) => s.auth.user);

  const activeTab = readTab(searchParams.get("status"));
  const page = readPositiveInt(searchParams.get("page"), 1);
  const pageSize = readPositiveInt(
    searchParams.get("pageSize"),
    SIZES.tablePageSize,
  );
  const [confirm, setConfirm] = useState<ConfirmState>(CLOSED_CONFIRM);
  const ask = useCallback(
    (item: Employee, targetStatus: ConfirmState["targetStatus"]) =>
      setConfirm({ open: true, item, targetStatus }),
    [],
  );
  const close = useCallback(() => setConfirm(CLOSED_CONFIRM), []);
  const [previewEmployee, setPreviewEmployee] = useState<Employee | null>(null);
  const [shareEmployee, setShareEmployee] = useState<Employee | null>(null);
  const [identifiersEmployee, setIdentifiersEmployee] =
    useState<Employee | null>(null);
  const [resetEmployee, setResetEmployee] = useState<Employee | null>(null);
  const [resetSuccessPassword, setResetSuccessPassword] = useState<
    string | null
  >(null);
  const [changeOwnPasswordOpen, setChangeOwnPasswordOpen] = useState(false);
  const changeOwnPassword = useChangePassword();

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
      employees.map((e) => {
        const isActive =
          statusOverrides[e.id] !== undefined
            ? statusOverrides[e.id]
            : e.isActive;
        return { ...e, isActive };
      }),
    [employees, statusOverrides],
  );

  const archivedCount = useMemo(
    () => effectiveEmployees.filter((e) => !e.isActive).length,
    [effectiveEmployees],
  );

  const limit = company?.userLimit;
  const usedCount = effectiveEmployees.length;
  const limitReached = limit != null && limit > 0 && usedCount >= limit;

  const filtered = useMemo(
    () =>
      effectiveEmployees
        .filter((e) => e.isActive === (activeTab === "active"))
        .sort((a, b) => (a.id === user?.id ? -1 : b.id === user?.id ? 1 : 0)),
    [effectiveEmployees, activeTab, user?.id],
  );

  const totalCount = filtered.length;
  const pageItems = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize],
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

  const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    if (page > maxPage) {
      setEmployeeParams({ page: maxPage }, true);
    }
  }, [maxPage, page, setEmployeeParams]);

  const handleView = useCallback(
    (row: Employee) => onSelectEmployee(row.id, false),
    [onSelectEmployee],
  );

  const handleEdit = useCallback(
    (row: Employee) => onSelectEmployee(row.id, true),
    [onSelectEmployee],
  );

  const handlePreviewAvatar = useCallback((row: Employee) => {
    setPreviewEmployee(row);
  }, []);

  const handleToggleActive = useCallback(
    (row: Employee) => ask(row, row.isActive ? "INACTIVE" : "ACTIVE"),
    [ask],
  );

  const handleConfirmToggle = () => {
    if (!confirm.item) return;
    const id = confirm.item.id;
    const newStatus = !confirm.item.isActive;

    setStatusOverrides((prev) => ({ ...prev, [id]: newStatus }));

    setActive.mutate(
      { id, isActive: newStatus },
      {
        onSuccess: () => {
          setEmployeeParams({
            status: newStatus ? "active" : "inactive",
            page: 1,
          });
          void refetch();
        },
        onError: () => {
          setStatusOverrides((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        },
        onSettled: close,
      },
    );
  };

  const handleResetPassword = async (newPassword: string) => {
    if (!resetEmployee) return;
    await resetPassword.mutateAsync({
      id: resetEmployee.id,
      data: { newPassword },
    });
    setResetSuccessPassword(newPassword);
  };

  const handleDownloadVcf = useCallback(async (row: Employee) => {
    try {
      const blob = await exportImportService.downloadVcf(row.id);
      triggerBlobDownload(blob, `${row.fullName.replace(/\s+/g, "_")}.vcf`);
    } catch (error) {
      showApiError(error);
    }
  }, []);

  const handleChangeOwnPassword = async (values: ChangePasswordValues) => {
    await changeOwnPassword.mutateAsync({
      oldPassword: values.oldPassword || undefined,
      newPassword: values.newPassword,
    });
    setChangeOwnPasswordOpen(false);
  };

  return {
    navigate,
    user,
    activeTab,
    page,
    pageSize,
    confirm,
    close,
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
    changeOwnPassword,
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
    setEmployeeParams,
    handleView,
    handleEdit,
    handlePreviewAvatar,
    handleToggleActive,
    handleConfirmToggle,
    handleResetPassword,
    handleDownloadVcf,
    handleChangeOwnPassword,
  };
}
