import { apiClient } from "./axios/axiosInstance";
import type { CreateUserDto, ResetPasswordDto, UpdateUserProfileDto } from "../types";

export const employeesService = {
  getByCompany: (companyId: string, page = 1, pageSize = 20) =>
    apiClient.get(`/CompanyAdmin/users/company/${companyId}`, {
      params: { page, pageSize },
    }),

  getById: (id: string) => apiClient.get(`/User/${id}`),

  create: (data: CreateUserDto) =>
    apiClient.post("/CompanyAdmin/users", data),

  update: (id: string, data: UpdateUserProfileDto) =>
    apiClient.put(`/CompanyAdmin/users/${id}`, data),

  setActive: (id: string, isActive: boolean) =>
    apiClient.put(`/CompanyAdmin/users/${id}/active`, null, {
      params: { isActive },
    }),

  setCanEdit: (id: string, canEdit: boolean) =>
    apiClient.put(`/CompanyAdmin/users/${id}/canedit`, null, {
      params: { canEdit },
    }),

  resetPassword: (id: string, data: ResetPasswordDto) =>
    apiClient.post(`/CompanyAdmin/users/${id}/reset-password`, data),

  getNfcLink: (id: string) =>
    apiClient.get(`/CompanyAdmin/users/${id}/nfc-link`),
};
