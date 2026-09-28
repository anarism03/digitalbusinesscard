import { message } from "../utils/feedback";
import { showApiError } from "../utils/apiError";
import { useApiQuery, useApiMutation } from "./useApi";
import { employeesService } from "../services/employees.service";
import { strings } from "../constants/strings";
import { mapEmployee, mapEmployeePage, mapNfcUrl } from "../utils/mappers";
import { fetchAllPages } from "../utils/pagination";
import type {
  CreateUserDto,
  ResetPasswordDto,
  UpdateUserProfileDto,
} from "../types";

export const EMPLOYEES_QUERY_KEY = "employees";

export function useEmployees(companyId: string) {
  return useApiQuery(
    EMPLOYEES_QUERY_KEY,
    () =>
      fetchAllPages((page, pageSize) =>
        employeesService
          .getByCompany(companyId, page, pageSize)
          .then(mapEmployeePage),
      ),
    { enabled: !!companyId, deps: [companyId] },
  );
}

export function useEmployeesPage(
  companyId: string,
  page: number,
  pageSize: number,
) {
  return useApiQuery(
    EMPLOYEES_QUERY_KEY,
    () =>
      employeesService
        .getByCompany(companyId, page, pageSize)
        .then(mapEmployeePage),
    { enabled: !!companyId, deps: [companyId, page, pageSize] },
  );
}

export function useEmployee(id: string) {
  return useApiQuery(
    EMPLOYEES_QUERY_KEY,
    () => employeesService.getById(id).then(mapEmployee),
    { enabled: !!id, deps: ["detail", id] },
  );
}

export function useCreateEmployee() {
  return useApiMutation(
    (data: CreateUserDto) => employeesService.create(data),
    {
      invalidates: [EMPLOYEES_QUERY_KEY],
      onSuccess: () => message.success(strings.employees.createSuccess),
      onError: showApiError,
    },
  );
}

export function useUpdateEmployee() {
  return useApiMutation(
    ({ id, data }: { id: string; data: UpdateUserProfileDto }) =>
      employeesService.update(id, data),
    {
      invalidates: [EMPLOYEES_QUERY_KEY],
      onSuccess: () => message.success(strings.employees.updateSuccess),
      onError: showApiError,
    },
  );
}

export function useSetEmployeeActive() {
  return useApiMutation(
    ({ id, isActive }: { id: string; isActive: boolean }) =>
      employeesService.setActive(id, isActive),
    {
      invalidates: [EMPLOYEES_QUERY_KEY],
      onSuccess: () => message.success(strings.employees.statusUpdateSuccess),
      onError: showApiError,
    },
  );
}

export function useSetEmployeeCanEdit() {
  return useApiMutation(
    ({ id, canEdit }: { id: string; canEdit: boolean }) =>
      employeesService.setCanEdit(id, canEdit),
    {
      invalidates: [EMPLOYEES_QUERY_KEY],
      onSuccess: () => message.success(strings.employees.updateSuccess),
      onError: showApiError,
    },
  );
}

export function useResetEmployeePassword() {
  return useApiMutation(
    ({ id, data }: { id: string; data: ResetPasswordDto }) =>
      employeesService.resetPassword(id, data),
    {
      onSuccess: () => message.success("Şifrə uğurla sıfırlandı"),
      onError: showApiError,
    },
  );
}

export function useNfcLink() {
  return useApiMutation(
    (id: string) => employeesService.getNfcLink(id).then(mapNfcUrl),
    { onError: showApiError },
  );
}
