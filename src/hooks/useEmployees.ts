import { message } from "../utils/feedback";
import { showApiError } from "../utils/apiError";
import { useApiQuery, useApiMutation } from "./useApi";
import { employeesService } from "../services/employees.service";
import { strings } from "../constants/strings";
import { mapEmployee, mapEmployeePage } from "../utils/mappers";
import { toArray } from "../utils/normalize";
import type { CreateUserDto, ResetPasswordDto, UpdateUserProfileDto } from "../types";

export const EMPLOYEES_QUERY_KEY = "employees";
const EMPLOYEES_PAGE_QUERY_KEY = "employees-page";

export function useEmployees(companyId: string, page = 1, pageSize = 1000) {
  return useApiQuery(
    EMPLOYEES_QUERY_KEY,
    () => employeesService.getByCompany(companyId, page, pageSize).then((data) => toArray(data).map(mapEmployee)),
    { enabled: !!companyId, deps: [companyId, page, pageSize] },
  );
}

export function useEmployeesPage(companyId: string, page = 1, pageSize = 20) {
  return useApiQuery(
    EMPLOYEES_PAGE_QUERY_KEY,
    () =>
      employeesService
        .getByCompany(companyId, page, pageSize)
        .then((data) => mapEmployeePage(data, page, pageSize)),
    { enabled: !!companyId, deps: [companyId, page, pageSize] },
  );
}

export function useEmployee(id: string) {
  return useApiQuery(
    `${EMPLOYEES_QUERY_KEY}-${id}`,
    () => employeesService.getById(id).then(mapEmployee),
    { enabled: !!id, deps: [id] },
  );
}

export function useCreateEmployee() {
  return useApiMutation((data: CreateUserDto) => employeesService.create(data), {
    invalidates: [EMPLOYEES_QUERY_KEY, EMPLOYEES_PAGE_QUERY_KEY],
    onSuccess: () => message.success(strings.employees.createSuccess),
    onError: showApiError,
  });
}

export function useUpdateEmployee() {
  return useApiMutation(
    ({ id, data }: { id: string; data: UpdateUserProfileDto }) =>
      employeesService.update(id, data),
    {
      invalidates: [EMPLOYEES_QUERY_KEY, EMPLOYEES_PAGE_QUERY_KEY],
      onSuccess: () => message.success(strings.employees.updateSuccess),
      onError: showApiError,
    },
  );
}

export function useSetEmployeeActive() {
  return useApiMutation(
    ({ id, isActive }: { id: string; isActive: boolean }) => employeesService.setActive(id, isActive),
    {
      invalidates: [EMPLOYEES_QUERY_KEY, EMPLOYEES_PAGE_QUERY_KEY],
      onSuccess: () => message.success(strings.employees.statusUpdateSuccess),
      onError: showApiError,
    },
  );
}

export function useSetEmployeeCanEdit() {
  return useApiMutation(
    ({ id, canEdit }: { id: string; canEdit: boolean }) => employeesService.setCanEdit(id, canEdit),
    {
      invalidates: [EMPLOYEES_QUERY_KEY, EMPLOYEES_PAGE_QUERY_KEY],
      onSuccess: () => message.success(strings.employees.updateSuccess),
      onError: showApiError,
    },
  );
}

export function useResetEmployeePassword() {
  return useApiMutation(
    ({ id, data }: { id: string; data: ResetPasswordDto }) => employeesService.resetPassword(id, data),
    {
      onSuccess: () => message.success("Şifrə uğurla sıfırlandı"),
      onError: showApiError,
    },
  );
}

function pickNfcUrl(data: unknown): string {
  const root = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  const body =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;
  const raw = body.nfcUrl ?? body.url ?? data;
  return typeof raw === "string" ? raw : "";
}

export function useNfcLink() {
  return useApiMutation(
    (id: string) => employeesService.getNfcLink(id).then(pickNfcUrl),
    { onError: showApiError },
  );
}
