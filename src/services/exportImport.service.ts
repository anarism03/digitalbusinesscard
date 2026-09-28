import { apiClient } from "./axios/axiosInstance";

export const exportImportService = {
  downloadVcf: (userId: string) =>
    apiClient.get<Blob>(`/ExportImport/vcf/${userId}`, {
      responseType: "blob",
    }),

  downloadExcel: (companyId: string) =>
    apiClient.get<Blob>(`/ExportImport/excel/${companyId}`, {
      responseType: "blob",
    }),

  downloadSelectedExcel: (userIds: string[]) =>
    apiClient.post<Blob>("/ExportImport/excel/export-selected", userIds, {
      responseType: "blob",
    }),

  downloadTemplate: () =>
    apiClient.get<Blob>("/ExportImport/excel/template", {
      responseType: "blob",
    }),

  importExcel: (companyId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post(`/ExportImport/excel/import/${companyId}`, formData);
  },

  downloadUserHtml: (userId: string) =>
    apiClient.get<Blob>(`/ExportImport/html/user/${userId}`, {
      responseType: "blob",
    }),

  downloadCompanyHtml: (companyId: string) =>
    apiClient.get<Blob>(`/ExportImport/html/${companyId}`, {
      responseType: "blob",
    }),

  downloadSelectedHtml: (userIds: string[]) =>
    apiClient.post<Blob>("/ExportImport/html/export-selected", userIds, {
      responseType: "blob",
    }),
};
