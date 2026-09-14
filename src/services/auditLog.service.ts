import { apiClient } from "./axios/axiosInstance";

export const auditLogService = {
  getList: (page = 1, pageSize = 10) =>
    apiClient.get("/AuditLog", { params: { page, pageSize } }),
};
