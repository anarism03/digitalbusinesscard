import { useApiQuery } from "./useApi";
import { analyticsService } from "../services/analytics.service";
import { mapChart, mapRanking } from "../utils/mappers";
import { toNumber } from "../utils/normalize";
import type { AnalyticsQueryParams } from "../types";

export function useScansCount(params?: AnalyticsQueryParams) {
  return useApiQuery(
    "analytics-count",
    () => analyticsService.getScansCount(params).then(toNumber),
    { deps: [params] },
  );
}

export function useScansChart(params?: AnalyticsQueryParams, enabled = true) {
  return useApiQuery(
    "analytics-chart",
    () => analyticsService.getScansChart(params).then(mapChart),
    { deps: [params], enabled },
  );
}

export function useEmployeesRanking(params?: AnalyticsQueryParams) {
  return useApiQuery(
    "analytics-ranking",
    () => analyticsService.getEmployeesRanking(params).then(mapRanking),
    { deps: [params] },
  );
}
