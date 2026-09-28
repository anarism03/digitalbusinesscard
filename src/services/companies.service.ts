import { apiClient } from "./axios/axiosInstance";
import type { CreateCompanyDto, UpdateCompanyDto } from "../types";

export const companiesService = {
  getDashboard: () => apiClient.get("/SuperAdmin/dashboard"),

  getAll: (page = 1, pageSize = 20) =>
    apiClient.get("/SuperAdmin/companies", { params: { page, pageSize } }),

  getById: (id: string) => apiClient.get(`/SuperAdmin/companies/${id}`),

  create: (data: CreateCompanyDto) =>
    apiClient.post("/SuperAdmin/companies", data),

  update: (id: string, data: UpdateCompanyDto) =>
    apiClient.put(`/SuperAdmin/companies/${id}`, data),

  setActive: (id: string, isActive: boolean) =>
    apiClient.put(`/SuperAdmin/companies/${id}/active`, null, {
      params: { isActive },
    }),

  setLimit: (id: string, limit: number) =>
    apiClient.put(`/SuperAdmin/companies/${id}/limit`, limit),

  getMyCompany: () => apiClient.get("/CompanyAdmin/company"),

  updateMyCompany: (data: UpdateCompanyDto) =>
    apiClient.put("/CompanyAdmin/company", data),
};
