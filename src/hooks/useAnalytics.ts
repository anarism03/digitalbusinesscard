import { useApiQuery } from "./useApi";
import { analyticsService } from "../services/analytics.service";
import { mapChart, mapRanking, mapScanLogs, mapScansCount } from "../utils/mappers";
import type { AnalyticsQueryParams, ScanLogParams } from "../types";

export function useScansCount(params?: AnalyticsQueryParams) {
  return useApiQuery(
    "analytics-count",
    () => analyticsService.getScansCount(params).then(mapScansCount),
    { deps: [params] },
  );
}

export function useScansChart(params?: AnalyticsQueryParams) {
  return useApiQuery(
    "analytics-chart",
    () => analyticsService.getScansChart(params).then(mapChart),
    { deps: [params] },
  );
}

export function useEmployeesRanking(params?: AnalyticsQueryParams) {
  return useApiQuery(
    "analytics-ranking",
    () => analyticsService.getEmployeesRanking(params).then(mapRanking),
    { deps: [params] },
  );
}

export function useScanLogs(params?: ScanLogParams) {
  return useApiQuery(
    `analytics-logs-${params?.companyId ?? "all"}-${params?.employeeId ?? "all"}-${params?.page ?? 1}-${params?.pageSize ?? 20}`,
    () => analyticsService.getScanLogs(params).then(mapScanLogs),
    { deps: [params] },
  );
}
