import { message } from "../utils/feedback";
import { showApiError } from "../utils/apiError";
import { useApiQuery, useApiMutation } from "./useApi";
import { companiesService } from "../services/companies.service";
import { strings } from "../constants/strings";
import {
  mapCompany,
  mapCompanyPage,
  mapCreatedCompany,
  mapSuperAdminDashboard,
} from "../utils/mappers";
import type { CreateCompanyDto, UpdateCompanyDto } from "../types";

const COMPANIES_QUERY_KEY = "companies";
const COMPANIES_PAGE_QUERY_KEY = "companies-page";
const MY_COMPANY_QUERY_KEY = "my-company";
const SUPER_ADMIN_DASHBOARD_KEY = "super-admin-dashboard";

export function useSuperAdminDashboard() {
  return useApiQuery(SUPER_ADMIN_DASHBOARD_KEY, () =>
    companiesService.getDashboard().then(mapSuperAdminDashboard),
  );
}

export function useCompanies(page = 1, pageSize = 1000) {
  return useApiQuery(
    COMPANIES_QUERY_KEY,
    () =>
      companiesService
        .getAll(page, pageSize)
        .then((data) => mapCompanyPage(data, page, pageSize).items),
    { deps: [page, pageSize] },
  );
}

export function useCompaniesPage(page = 1, pageSize = 20) {
  return useApiQuery(
    COMPANIES_PAGE_QUERY_KEY,
    () =>
      companiesService
        .getAll(page, pageSize)
        .then((data) => mapCompanyPage(data, page, pageSize)),
    { deps: [page, pageSize] },
  );
}

export function useCompany(id?: string) {
  return useApiQuery(
    `${COMPANIES_QUERY_KEY}-${id}`,
    () => companiesService.getById(id || "").then(mapCompany),
    { enabled: !!id, deps: [id] },
  );
}

export function useCreateCompany() {
  return useApiMutation(
    (data: CreateCompanyDto) =>
      companiesService.create(data).then(mapCreatedCompany),
    {
      invalidates: [
        COMPANIES_QUERY_KEY,
        COMPANIES_PAGE_QUERY_KEY,
        SUPER_ADMIN_DASHBOARD_KEY,
      ],
      onSuccess: () => message.success(strings.companies.createSuccess),
      onError: showApiError,
    },
  );
}

export function useUpdateCompany() {
  return useApiMutation(
    ({ id, data }: { id: string; data: UpdateCompanyDto }) =>
      companiesService.update(id, data).then(mapCompany),
    {
      invalidates: [
        COMPANIES_QUERY_KEY,
        COMPANIES_PAGE_QUERY_KEY,
        SUPER_ADMIN_DASHBOARD_KEY,
      ],
      onSuccess: () => message.success(strings.companies.updateSuccess),
      onError: showApiError,
    },
  );
}

export function useSetCompanyActive() {
  return useApiMutation(
    ({ id, isActive }: { id: string; isActive: boolean }) =>
      companiesService.setActive(id, isActive),
    {
      invalidates: [
        COMPANIES_QUERY_KEY,
        COMPANIES_PAGE_QUERY_KEY,
        SUPER_ADMIN_DASHBOARD_KEY,
      ],
      onSuccess: () => message.success(strings.companies.statusUpdateSuccess),
      onError: showApiError,
    },
  );
}

export function useSetCompanyLimit() {
  return useApiMutation(
    ({ id, limit }: { id: string; limit: number }) =>
      companiesService.setLimit(id, limit),
    {
      invalidates: [
        COMPANIES_QUERY_KEY,
        COMPANIES_PAGE_QUERY_KEY,
        SUPER_ADMIN_DASHBOARD_KEY,
      ],
      onSuccess: () => message.success(strings.companies.updateSuccess),
      onError: showApiError,
    },
  );
}

export function useMyCompany(enabled = true) {
  return useApiQuery(
    MY_COMPANY_QUERY_KEY,
    () => companiesService.getMyCompany().then(mapCompany),
    { enabled },
  );
}

export function useUpdateMyCompany() {
  return useApiMutation(
    (data: UpdateCompanyDto) => companiesService.updateMyCompany(data),
    {
      invalidates: [
        MY_COMPANY_QUERY_KEY,
        COMPANIES_QUERY_KEY,
        COMPANIES_PAGE_QUERY_KEY,
      ],
      onSuccess: () => message.success("Şirkət məlumatları yeniləndi"),
      onError: showApiError,
    },
  );
}
