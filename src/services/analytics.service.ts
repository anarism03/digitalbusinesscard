import { apiClient } from "./axios/axiosInstance";
import type { AnalyticsQueryParams, ScanLogParams } from "../types";

export const analyticsService = {
  getScansCount: (params?: AnalyticsQueryParams) =>
    apiClient.get("/Analytics/scans/count", { params }),

  getScansChart: (params?: AnalyticsQueryParams) =>
    apiClient.get("/Analytics/scans/chart", { params }),

  getEmployeesRanking: (params?: AnalyticsQueryParams) =>
    apiClient.get("/Analytics/employees/ranking", { params }),

  getScanLogs: (params?: ScanLogParams) =>
    apiClient.get("/Analytics/scans/logs", { params }),
};
